import { useState } from "react";
import { Navigation } from "@/components/layout/Navigation";
import { AuthModal } from "@/components/auth/AuthModal";
import { SocialFeed } from "@/components/feed/SocialFeed";
import { Marketplace } from "@/components/marketplace/Marketplace";
import { Services } from "@/components/services/Services";
import { Messages } from "@/components/messages/Messages";
import { Profile } from "@/components/profile/Profile";
import { Stories } from "@/components/stories/Stories";
import { LiveStreaming } from "@/components/live/LiveStreaming";
import { NeighborhoodPolls } from "@/components/polls/NeighborhoodPolls";
import { EventPlanning } from "@/components/events/EventPlanning";
import { LocalGroups } from "@/components/groups/LocalGroups";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(true);
  const [currentPage, setCurrentPage] = useState("feed");
  const [isBusiness, setIsBusiness] = useState(false);
  const { toast } = useToast();

  const handleLogin = (email: string, password: string) => {
    // In a real app, this would authenticate with the backend
    setIsAuthenticated(true);
    setShowAuthModal(false);
    toast({
      title: "Welcome back!",
      description: "Successfully logged in to LocalHub",
    });
  };

  const handleRegister = (data: Record<string, string>) => {
    // In a real app, this would create a new user account
    setIsAuthenticated(true);
    setShowAuthModal(false);
    toast({
      title: "Account created!",
      description: "Welcome to LocalHub! Your account is pending verification.",
    });
  };

  const handleToggleBusiness = () => {
    setIsBusiness(!isBusiness);
    toast({
      title: isBusiness ? "Switched to Personal" : "Switched to Business",
      description: isBusiness
        ? "You're now in personal mode"
        : "You're now in business mode with enhanced features",
    });
  };

  const renderPage = () => {
    switch (currentPage) {
      case "feed":
        return <SocialFeed />;
      case "stories":
        return <Stories />;
      case "live":
        return <LiveStreaming />;
      case "polls":
        return <NeighborhoodPolls />;
      case "events":
        return <EventPlanning />;
      case "groups":
        return <LocalGroups />;
      case "marketplace":
        return <Marketplace />;
      case "services":
        return <Services />;
      case "messages":
        return <Messages />;
      case "profile":
        return <Profile isBusiness={isBusiness} onToggleBusiness={handleToggleBusiness} />;
      default:
        return <SocialFeed />;
    }
  };

  if (!isAuthenticated) {
    return (
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isBusiness={isBusiness}
        onToggleBusiness={handleToggleBusiness}
      />

      <main className={`lg:ml-64 flex flex-col ${currentPage === "messages" ? "h-[calc(100dvh-4rem)]" : "min-h-[calc(100dvh-4rem)]"}`}>
        <div className={`${currentPage === "messages" ? "flex-1 overflow-hidden pb-16 lg:pb-0" : "container mx-auto px-4 py-4 pb-20 lg:pb-4"} flex flex-col`}>
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default Index;
