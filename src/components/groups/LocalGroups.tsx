import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Plus, Search, MessageCircle, Calendar, MapPin, Settings, UserPlus, UserMinus, BookOpen, Baby, FileWarning as Running, Camera, Music, Utensils, Car, Heart, Globe, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Group {
    id: string;
    name: string;
    description: string;
    category: 'parents' | 'fitness' | 'hobbies' | 'business' | 'social' | 'education' | 'charity';
    creatorId: string;
    creatorName: string;
    creatorAvatar: string;
    memberCount: number;
    maxMembers: number;
    isPrivate: boolean;
    isApprovalRequired: boolean;
    tags: string[];
    location: string;
    meetingFrequency: string;
    lastActivity: Date;
    members: GroupMember[];
    posts: GroupPost[];
    events: GroupEvent[];
}

interface GroupMember {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    role: 'admin' | 'moderator' | 'member';
    joinedDate: Date;
    status: 'active' | 'pending' | 'banned';
}

interface GroupPost {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    content: string;
    timestamp: Date;
    likes: number;
    comments: number;
}

interface GroupEvent {
    id: string;
    title: string;
    description: string;
    date: Date;
    location: string;
    attendees: number;
    maxAttendees: number;
}

export const LocalGroups = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [showGroupDetails, setShowGroupDetails] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [groupName, setGroupName] = useState("");
    const [groupDescription, setGroupDescription] = useState("");
    const [groupCategory, setGroupCategory] = useState<Group['category']>('social');
    const [groupLocation, setGroupLocation] = useState("");
    const [groupTags, setGroupTags] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [isApprovalRequired, setIsApprovalRequired] = useState(false);
    const [maxMembers, setMaxMembers] = useState(100);
    const [meetingFrequency, setMeetingFrequency] = useState("weekly");
    const { toast } = useToast();

    // Mock data
    useEffect(() => {
        const mockGroups: Group[] = [
            {
                id: "1",
                name: "Neighborhood Parents Network",
                description: "A supportive community for parents in our neighborhood. Share tips, organize playdates, and build lasting friendships.",
                category: "parents",
                creatorId: "user1",
                creatorName: "Sarah Johnson",
                creatorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                memberCount: 45,
                maxMembers: 100,
                isPrivate: false,
                isApprovalRequired: true,
                tags: ["parents", "children", "playdates", "support"],
                location: "Oak Street Park",
                meetingFrequency: "weekly",
                lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                members: [
                    {
                        id: "m1",
                        userId: "user1",
                        userName: "Sarah Johnson",
                        userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                        role: "admin",
                        joinedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                        status: "active"
                    }
                ],
                posts: [
                    {
                        id: "p1",
                        userId: "user2",
                        userName: "Mike Chen",
                        userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                        content: "Anyone interested in organizing a weekend playdate at the park?",
                        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                        likes: 8,
                        comments: 5
                    }
                ],
                events: [
                    {
                        id: "e1",
                        title: "Monthly Parent Meetup",
                        description: "Monthly gathering for parents to connect and share experiences",
                        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                        location: "Community Center",
                        attendees: 12,
                        maxAttendees: 30
                    }
                ]
            },
            {
                id: "2",
                name: "Local Running Club",
                description: "Join our neighborhood running group for weekly runs, training tips, and race preparation.",
                category: "fitness",
                creatorId: "user3",
                creatorName: "David Wilson",
                creatorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                memberCount: 28,
                maxMembers: 50,
                isPrivate: false,
                isApprovalRequired: false,
                tags: ["running", "fitness", "training", "races"],
                location: "Central Park",
                meetingFrequency: "weekly",
                lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
                members: [],
                posts: [],
                events: [
                    {
                        id: "e2",
                        title: "Saturday Morning Run",
                        description: "5-mile group run through the neighborhood",
                        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                        location: "Central Park",
                        attendees: 8,
                        maxAttendees: 20
                    }
                ]
            },
            {
                id: "3",
                name: "Neighborhood Book Club",
                description: "Monthly book discussions and literary events for book lovers in our community.",
                category: "hobbies",
                creatorId: "user4",
                creatorName: "Emily Davis",
                creatorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                memberCount: 15,
                maxMembers: 25,
                isPrivate: false,
                isApprovalRequired: true,
                tags: ["books", "reading", "discussion", "literature"],
                location: "Local Library",
                meetingFrequency: "monthly",
                lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
                members: [],
                posts: [],
                events: []
            }
        ];

        setGroups(mockGroups);
    }, []);

    const handleCreateGroup = () => {
        if (!groupName.trim() || !groupDescription.trim()) {
            toast({
                title: "Error",
                description: "Please fill in all required fields",
                variant: "destructive"
            });
            return;
        }

        const newGroup: Group = {
            id: Date.now().toString(),
            name: groupName,
            description: groupDescription,
            category: groupCategory,
            creatorId: "currentUser",
            creatorName: "You",
            creatorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            memberCount: 1,
            maxMembers,
            isPrivate,
            isApprovalRequired,
            tags: groupTags.split(",").map(tag => tag.trim()).filter(tag => tag),
            location: groupLocation,
            meetingFrequency,
            lastActivity: new Date(),
            members: [
                {
                    id: "m1",
                    userId: "currentUser",
                    userName: "You",
                    userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                    role: "admin",
                    joinedDate: new Date(),
                    status: "active"
                }
            ],
            posts: [],
            events: []
        };

        setGroups(prev => [newGroup, ...prev]);
        setShowCreateGroup(false);
        setGroupName("");
        setGroupDescription("");
        setGroupCategory("social");
        setGroupLocation("");
        setGroupTags("");
        setIsPrivate(false);
        setIsApprovalRequired(false);
        setMaxMembers(100);
        setMeetingFrequency("weekly");

        toast({
            title: "Group created!",
            description: "Your group is now live and ready to welcome members",
        });
    };

    const handleJoinGroup = (groupId: string) => {
        setGroups(prev =>
            prev.map(group =>
                group.id === groupId
                    ? { ...group, memberCount: group.memberCount + 1 }
                    : group
            )
        );

        toast({
            title: "Request sent!",
            description: "Your request to join the group has been sent",
        });
    };

    const handleLeaveGroup = (groupId: string) => {
        setGroups(prev =>
            prev.map(group =>
                group.id === groupId
                    ? { ...group, memberCount: Math.max(0, group.memberCount - 1) }
                    : group
            )
        );

        toast({
            title: "Left group",
            description: "You have left the group",
        });
    };

    const filteredGroups = groups.filter(group => {
        const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            group.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "all" || group.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getCategoryIcon = (category: Group['category']) => {
        switch (category) {
            case 'parents': return <Baby className="w-4 h-4" />;
            case 'fitness': return <Activity className="w-4 h-4" />;
            case 'hobbies': return <BookOpen className="w-4 h-4" />;
            case 'business': return <Users className="w-4 h-4" />;
            case 'social': return <Users className="w-4 h-4" />;
            case 'education': return <BookOpen className="w-4 h-4" />;
            case 'charity': return <Heart className="w-4 h-4" />;
            default: return <Users className="w-4 h-4" />;
        }
    };

    const getCategoryColor = (category: Group['category']) => {
        switch (category) {
            case 'parents': return "bg-pink-100 text-pink-800";
            case 'fitness': return "bg-green-100 text-green-800";
            case 'hobbies': return "bg-purple-100 text-purple-800";
            case 'business': return "bg-blue-100 text-blue-800";
            case 'social': return "bg-orange-100 text-orange-800";
            case 'education': return "bg-indigo-100 text-indigo-800";
            case 'charity': return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Local Groups</h2>
                    <p className="text-muted-foreground">Interest-based communities for neighbors</p>
                </div>
                <Dialog open={showCreateGroup} onOpenChange={setShowCreateGroup}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Group
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Create New Group</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="group-name">Group Name *</Label>
                                <Input
                                    id="group-name"
                                    placeholder="e.g., Neighborhood Parents Network"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="group-description">Description *</Label>
                                <Textarea
                                    id="group-description"
                                    placeholder="Describe your group's purpose and activities..."
                                    value={groupDescription}
                                    onChange={(e) => setGroupDescription(e.target.value)}
                                    rows={3}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="group-category">Category</Label>
                                    <Select value={groupCategory} onValueChange={(value: Group['category']) => setGroupCategory(value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="parents">Parents</SelectItem>
                                            <SelectItem value="fitness">Fitness</SelectItem>
                                            <SelectItem value="hobbies">Hobbies</SelectItem>
                                            <SelectItem value="business">Business</SelectItem>
                                            <SelectItem value="social">Social</SelectItem>
                                            <SelectItem value="education">Education</SelectItem>
                                            <SelectItem value="charity">Charity</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="group-location">Location</Label>
                                    <Input
                                        id="group-location"
                                        placeholder="e.g., Community Center"
                                        value={groupLocation}
                                        onChange={(e) => setGroupLocation(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="group-frequency">Meeting Frequency</Label>
                                    <Select value={meetingFrequency} onValueChange={setMeetingFrequency}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="weekly">Weekly</SelectItem>
                                            <SelectItem value="biweekly">Bi-weekly</SelectItem>
                                            <SelectItem value="monthly">Monthly</SelectItem>
                                            <SelectItem value="quarterly">Quarterly</SelectItem>
                                            <SelectItem value="as-needed">As needed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="group-max-members">Max Members</Label>
                                    <Input
                                        id="group-max-members"
                                        type="number"
                                        placeholder="100"
                                        value={maxMembers}
                                        onChange={(e) => setMaxMembers(parseInt(e.target.value) || 100)}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="group-tags">Tags (Optional)</Label>
                                <Input
                                    id="group-tags"
                                    placeholder="parents, children, support (comma separated)"
                                    value={groupTags}
                                    onChange={(e) => setGroupTags(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="private-group"
                                        checked={isPrivate}
                                        onChange={(e) => setIsPrivate(e.target.checked)}
                                    />
                                    <Label htmlFor="private-group">Private group (invite only)</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="approval-required"
                                        checked={isApprovalRequired}
                                        onChange={(e) => setIsApprovalRequired(e.target.checked)}
                                    />
                                    <Label htmlFor="approval-required">Require approval to join</Label>
                                </div>
                            </div>
                            <Button onClick={handleCreateGroup} className="w-full">
                                Start Community
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Search groups..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="parents">Parents</SelectItem>
                        <SelectItem value="fitness">Fitness</SelectItem>
                        <SelectItem value="hobbies">Hobbies</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="charity">Charity</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Groups List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGroups.map(group => (
                    <Card key={group.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                    {getCategoryIcon(group.category)}
                                    <Badge className={getCategoryColor(group.category)}>
                                        {group.category}
                                    </Badge>
                                </div>
                                <div className="flex items-center space-x-1">
                                    {group.isPrivate ? (
                                        <Lock className="w-4 h-4 text-muted-foreground" />
                                    ) : (
                                        <Globe className="w-4 h-4 text-muted-foreground" />
                                    )}
                                </div>
                            </div>

                            <h4 className="font-semibold mb-2">{group.name}</h4>
                            <p className="text-sm text-muted-foreground mb-3">{group.description}</p>

                            <div className="flex items-center space-x-4 mb-3">
                                <div className="flex items-center space-x-1">
                                    <Avatar className="w-6 h-6">
                                        <AvatarImage src={group.creatorAvatar} />
                                        <AvatarFallback>{group.creatorName[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm">{group.creatorName}</span>
                                </div>
                                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                    <MapPin className="w-3 h-3" />
                                    <span>{group.location}</span>
                                </div>
                            </div>

                            <div className="space-y-2 mb-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Members</span>
                                    <span className="font-medium">{group.memberCount}/{group.maxMembers}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${(group.memberCount / group.maxMembers) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                                <div className="flex items-center space-x-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{group.meetingFrequency}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <MessageCircle className="w-3 h-3" />
                                    <span>{group.posts.length} posts</span>
                                </div>
                            </div>

                            {group.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {group.tags.slice(0, 3).map(tag => (
                                        <Badge key={tag} variant="outline" className="text-xs">
                                            #{tag}
                                        </Badge>
                                    ))}
                                    {group.tags.length > 3 && (
                                        <Badge variant="outline" className="text-xs">
                                            +{group.tags.length - 3} more
                                        </Badge>
                                    )}
                                </div>
                            )}

                            <div className="flex space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedGroup(group)}
                                    className="flex-1"
                                >
                                    View Details
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => handleJoinGroup(group.id)}
                                >
                                    <UserPlus className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Group Details */}
            {selectedGroup && (
                <Dialog open={showGroupDetails} onOpenChange={setShowGroupDetails}>
                    <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <DialogTitle>{selectedGroup.name}</DialogTitle>
                                    <p className="text-sm text-muted-foreground">{selectedGroup.description}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Badge className={getCategoryColor(selectedGroup.category)}>
                                        {selectedGroup.category}
                                    </Badge>
                                    {selectedGroup.isPrivate ? (
                                        <Badge variant="outline">Private</Badge>
                                    ) : (
                                        <Badge variant="outline">Public</Badge>
                                    )}
                                </div>
                            </div>
                        </DialogHeader>
                        <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="members">Members</TabsTrigger>
                                <TabsTrigger value="posts">Posts</TabsTrigger>
                                <TabsTrigger value="events">Events</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-semibold mb-2">Group Info</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center space-x-2">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{selectedGroup.location}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>Meets {selectedGroup.meetingFrequency}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Users className="w-4 h-4" />
                                                    <span>{selectedGroup.memberCount}/{selectedGroup.maxMembers} members</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <MessageCircle className="w-4 h-4" />
                                                    <span>{selectedGroup.posts.length} posts</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold mb-2">Tags</h4>
                                            <div className="flex flex-wrap gap-1">
                                                {selectedGroup.tags.map(tag => (
                                                    <Badge key={tag} variant="outline">
                                                        #{tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-2">Recent Activity</h4>
                                        <div className="space-y-2">
                                            {selectedGroup.posts.slice(0, 3).map(post => (
                                                <div key={post.id} className="p-2 border rounded">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <Avatar className="w-6 h-6">
                                                            <AvatarImage src={post.userAvatar} />
                                                            <AvatarFallback>{post.userName[0]}</AvatarFallback>
                                                        </Avatar>
                                                        <span className="text-sm font-medium">{post.userName}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {post.timestamp.toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm">{post.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="members" className="space-y-4">
                                <div className="space-y-2">
                                    {selectedGroup.members.map(member => (
                                        <div key={member.id} className="flex items-center justify-between p-2 border rounded">
                                            <div className="flex items-center space-x-2">
                                                <Avatar className="w-8 h-8">
                                                    <AvatarImage src={member.userAvatar} />
                                                    <AvatarFallback>{member.userName[0]}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-medium">{member.userName}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Joined {member.joinedDate.toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge variant={member.role === 'admin' ? 'default' : 'secondary'}>
                                                {member.role}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="posts" className="space-y-4">
                                <div className="space-y-4">
                                    {selectedGroup.posts.map(post => (
                                        <div key={post.id} className="p-3 border rounded">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <Avatar className="w-8 h-8">
                                                    <AvatarImage src={post.userAvatar} />
                                                    <AvatarFallback>{post.userName[0]}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-medium">{post.userName}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {post.timestamp.toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-sm mb-2">{post.content}</p>
                                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                                <span>{post.likes} likes</span>
                                                <span>{post.comments} comments</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="events" className="space-y-4">
                                <div className="space-y-2">
                                    {selectedGroup.events.map(event => (
                                        <div key={event.id} className="p-3 border rounded">
                                            <h5 className="font-medium mb-1">{event.title}</h5>
                                            <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{event.date.toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{event.location}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Users className="w-4 h-4" />
                                                    <span>{event.attendees}/{event.maxAttendees}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}; 