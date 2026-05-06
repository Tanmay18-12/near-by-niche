import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Database {
  public: {
    Tables: {
      profiles: Record<string, unknown>
      posts: Record<string, unknown>
      comments: Record<string, unknown>
      marketplace_items: Record<string, unknown>
      services: Record<string, unknown>
      bookings: Record<string, unknown>
      messages: Record<string, unknown>
      business_profiles: Record<string, unknown>
    }
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const url = new URL(req.url)
    const path = url.pathname.replace('/api', '')
    const method = req.method

    // Get auth token from header
    const authHeader = req.headers.get('Authorization')
    if (authHeader) {
      supabaseClient.auth.setSession({ access_token: authHeader.replace('Bearer ', ''), refresh_token: '' })
    }

    console.log(`${method} ${path}`)

    // Authentication endpoints
    if (path === '/auth/register' && method === 'POST') {
      const { email, password, name, address, phone } = await req.json()
      
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: { name, address, phone }
        }
      })

      if (error) throw error
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (path === '/auth/login' && method === 'POST') {
      const { email, password } = await req.json()
      
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (path === '/auth/logout' && method === 'POST') {
      const { error } = await supabaseClient.auth.signOut()
      if (error) throw error
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (path === '/auth/me' && method === 'GET') {
      const { data: { user }, error } = await supabaseClient.auth.getUser()
      if (error) throw error
      
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      return new Response(JSON.stringify({ user, profile }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Social Feed endpoints
    if (path === '/posts' && method === 'GET') {
      const { data, error } = await supabaseClient
        .from('posts')
        .select(`
          *,
          profiles:user_id (name, profile_photo_url),
          comments (
            *,
            profiles:user_id (name, profile_photo_url)
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (path === '/posts' && method === 'POST') {
      const { content, photo_url, category } = await req.json()
      const { data: { user } } = await supabaseClient.auth.getUser()
      
      const { data, error } = await supabaseClient
        .from('posts')
        .insert({
          user_id: user?.id,
          content,
          photo_url,
          category
        })
        .select()
        .single()

      if (error) throw error
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (path.match(new RegExp('^/posts/[^/]+/like$')) && method === 'POST') {
      const postId = path.split('/')[2]
      
      const { data: post, error: fetchError } = await supabaseClient
        .from('posts')
        .select('like_count')
        .eq('id', postId)
        .single()

      if (fetchError) throw fetchError

      const { data, error } = await supabaseClient
        .from('posts')
        .update({ like_count: (post.like_count || 0) + 1 })
        .eq('id', postId)
        .select()
        .single()

      if (error) throw error
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (path.match(new RegExp('^/posts/[^/]+/comments$')) && method === 'GET') {
      const postId = path.split('/')[2]
      
      const { data, error } = await supabaseClient
        .from('comments')
        .select(`
          *,
          profiles:user_id (name, profile_photo_url)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (path.match(new RegExp('^/posts/[^/]+/comments$')) && method === 'POST') {
      const postId = path.split('/')[2]
      const { content } = await req.json()
      const { data: { user } } = await supabaseClient.auth.getUser()
      
      const { data, error } = await supabaseClient
        .from('comments')
        .insert({
          post_id: postId,
          user_id: user?.id,
          content
        })
        .select(`
          *,
          profiles:user_id (name, profile_photo_url)
        `)
        .single()

      if (error) throw error
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Marketplace endpoints
    if (path === '/marketplace' && method === 'GET') {
      const { data, error } = await supabaseClient
        .from('marketplace_items')
        .select(`
          *,
          profiles:seller_id (name, profile_photo_url)
        `)
        .eq('status', 'available')
        .order('created_at', { ascending: false })

      if (error) throw error
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (path === '/marketplace' && method === 'POST') {
      const { title, description, price, photo_url, category, condition } = await req.json()
      const { data: { user } } = await supabaseClient.auth.getUser()
      
      const { data, error } = await supabaseClient
        .from('marketplace_items')
        .insert({
          seller_id: user?.id,
          title,
          description,
          price,
          photo_url,
          category,
          condition
        })
        .select()
        .single()

      if (error) throw error
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (path.match(new RegExp('^/marketplace/[^/]+$')) && method === 'GET') {
      const itemId = path.split('/')[2]
      
      const { data, error } = await supabaseClient
        .from('marketplace_items')
        .select(`
          *,
          profiles:seller_id (name, profile_photo_url, phone)
        `)
        .eq('id', itemId)
        .single()

      if (error) throw error
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Services endpoints
    if (path === '/services' && method === 'GET') {
      const { data, error } = await supabaseClient
        .from('services')
        .select(`
          *,
          profiles:provider_id (name, profile_photo_url)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (path === '/services' && method === 'POST') {
      const { name, description, hourly_rate, category, availability, photo_url } = await req.json()
      const { data: { user } } = await supabaseClient.auth.getUser()
      
      const { data, error } = await supabaseClient
        .from('services')
        .insert({
          provider_id: user?.id,
          name,
          description,
          hourly_rate,
          category,
          availability,
          photo_url
        })
        .select()
        .single()

      if (error) throw error
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Bookings endpoints
    if (path === '/bookings' && method === 'POST') {
      const { service_id, booking_date, start_time, duration, special_instructions } = await req.json()
      const { data: { user } } = await supabaseClient.auth.getUser()
      
      const { data, error } = await supabaseClient
        .from('bookings')
        .insert({
          service_id,
          customer_id: user?.id,
          booking_date,
          start_time,
          duration,
          special_instructions
        })
        .select()
        .single()

      if (error) throw error
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (path === '/bookings/my-bookings' && method === 'GET') {
      const { data: { user } } = await supabaseClient.auth.getUser()
      
      const { data, error } = await supabaseClient
        .from('bookings')
        .select(`
          *,
          services (*,
            profiles:provider_id (name, profile_photo_url)
          )
        `)
        .eq('customer_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Messages endpoints
    if (path.match(new RegExp('^/messages/[^/]+$')) && method === 'GET') {
      const itemId = path.split('/')[2]
      const { data: { user } } = await supabaseClient.auth.getUser()
      
      const { data, error } = await supabaseClient
        .from('messages')
        .select(`
          *,
          sender:sender_id (name, profile_photo_url),
          recipient:recipient_id (name, profile_photo_url)
        `)
        .eq('item_id', itemId)
        .or(`sender_id.eq.${user?.id},recipient_id.eq.${user?.id}`)
        .order('created_at', { ascending: true })

      if (error) throw error
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (path === '/messages' && method === 'POST') {
      const { recipient_id, item_id, content } = await req.json()
      const { data: { user } } = await supabaseClient.auth.getUser()
      
      const { data, error } = await supabaseClient
        .from('messages')
        .insert({
          sender_id: user?.id,
          recipient_id,
          item_id,
          content
        })
        .select()
        .single()

      if (error) throw error
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Business endpoints
    if (path === '/business/profile' && method === 'GET') {
      const { data: { user } } = await supabaseClient.auth.getUser()
      
      const { data, error } = await supabaseClient
        .from('business_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (path === '/business/profile' && method === 'POST') {
      const { business_name, description, category, phone, website, hours, logo_url } = await req.json()
      const { data: { user } } = await supabaseClient.auth.getUser()
      
      const { data, error } = await supabaseClient
        .from('business_profiles')
        .insert({
          user_id: user?.id,
          business_name,
          description,
          category,
          phone,
          website,
          hours,
          logo_url
        })
        .select()
        .single()

      if (error) throw error
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // File Upload endpoint
    if (path === '/upload' && method === 'POST') {
      const formData = await req.formData()
      const file = formData.get('file') as File
      const bucket = formData.get('bucket') as string || 'post-photos'
      const { data: { user } } = await supabaseClient.auth.getUser()
      
      if (!file) throw new Error('No file provided')
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${user?.id}/${Date.now()}.${fileExt}`
      
      const { data, error } = await supabaseClient.storage
        .from(bucket)
        .upload(fileName, file)

      if (error) throw error
      
      const { data: publicUrlData } = supabaseClient.storage
        .from(bucket)
        .getPublicUrl(fileName)

      return new Response(JSON.stringify({ 
        url: publicUrlData.publicUrl,
        path: fileName 
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    return new Response(JSON.stringify({ error: 'Not found' }), { 
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })

  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  }
})