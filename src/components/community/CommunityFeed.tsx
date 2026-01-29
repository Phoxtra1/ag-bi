import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Heart, Flag, TrendingUp, Clock, Users, Radio, Video, Trophy, Lightbulb, Building2 } from 'lucide-react';
import { getPosts, likePost, COMMUNITY_POSTS_COLLECTION_ID } from '@/lib/community';
import { client, DATABASE_ID } from '@/lib/appwrite';
import { getCurrentUser } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

import PostCard from './PostCard';
import CreatePostDialog from './CreatePostDialog';
import SponsoredContent from './SponsoredContent';
import UserPointsWidget from './UserPointsWidget';
import AudioRoomsList from './AudioRoomsList';
import LivestreamsList from './LivestreamsList';
import Leaderboard from './Leaderboard';
import { awardPoints } from '@/lib/communityExtensions';

const CommunityFeed = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'trending'>('newest');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    loadPosts();
  }, [sortBy]);

  useEffect(() => {
    const channel = `databases.${DATABASE_ID}.collections.${COMMUNITY_POSTS_COLLECTION_ID}.documents`;

    const unsubscribe = client.subscribe(channel, (event: any) => {
      if (Array.isArray(event?.events) && event.events.some((e: string) => e.includes('.create') || e.includes('.update') || e.includes('.delete'))) {
        loadPosts();
      }
    });

    return () => {
      try {
        unsubscribe();
      } catch (e) {
        // ignore
      }
    };
  }, [sortBy]);

  const loadCurrentUser = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const loadPosts = async () => {
    setLoading(true);
    const { data, error } = await getPosts(sortBy, 20);
    if (!error && data) {
      setPosts(data);
    }
    setLoading(false);
  };

  const handleLikePost = async (postId: string) => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to engage with posts",
        variant: "destructive"
      });
      return;
    }

    setPosts((prev) => prev.map((p) => {
      if (p.$id !== postId) return p;
      const liked = (p.liked_by || []).includes(currentUser.$id);
      const newLikedBy = liked
        ? (p.liked_by || []).filter((id: string) => id !== currentUser.$id)
        : ([...(p.liked_by || []), currentUser.$id]);
      return { ...p, liked_by: newLikedBy, likes: newLikedBy.length };
    }));

    try {
      const { error } = await likePost(postId, currentUser.$id);
      if (error) throw error as any;
    } catch (e: any) {
      setPosts((prev) => prev.map((p) => {
        if (p.$id !== postId) return p;
        const liked = (p.liked_by || []).includes(currentUser.$id);
        const newLikedBy = liked
          ? (p.liked_by || []).filter((id: string) => id !== currentUser.$id)
          : ([...(p.liked_by || []), currentUser.$id]);
        return { ...p, liked_by: newLikedBy, likes: newLikedBy.length };
      }));

      toast({
        title: "Failed to engage",
        description: e?.message || "Please try again",
        variant: "destructive"
      });
    }
  };

  const handlePostCreated = async () => {
    loadPosts();
    toast({
      title: "Insight Shared",
      description: "Your business insight has been shared with the community"
    });
    
    if (currentUser) {
      try {
        await awardPoints(currentUser.$id, 10, 'post_created', 'Shared a new business insight');
      } catch (error) {
        console.error('Error awarding points:', error);
      }
    }
  };

  return (
    <div className="grid lg:grid-cols-4 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-3 space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <CardTitle className="text-3xl font-bold flex items-center gap-3">
                  <Building2 className="h-8 w-8 text-primary" />
                  Amniva Business Network
                </CardTitle>
                <p className="text-muted-foreground">
                  Connect with business professionals, share market insights, and discuss investment strategies
                </p>
              </div>
              <CreatePostDialog 
                currentUser={currentUser} 
                onPostCreated={handlePostCreated}
              />
            </div>
          </CardHeader>
        </Card>

        {/* Navigation Tabs */}
        <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="newest" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Feed
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="rooms" className="flex items-center gap-2">
              <Radio className="h-4 w-4" />
              Expert Rooms
            </TabsTrigger>
            <TabsTrigger value="streams" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Webinars
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Leaders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="newest" className="space-y-4 mt-6">
            {renderPostsFeed()}
          </TabsContent>

          <TabsContent value="trending" className="space-y-4 mt-6">
            {renderPostsFeed()}
          </TabsContent>

          <TabsContent value="rooms" className="space-y-4 mt-6">
            <AudioRoomsList />
          </TabsContent>

          <TabsContent value="streams" className="space-y-4 mt-6">
            <LivestreamsList />
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-4 mt-6">
            <Leaderboard />
          </TabsContent>
        </Tabs>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1 space-y-6">
        <UserPointsWidget />
        <SponsoredContent type="post" />
      </div>
    </div>
  );

  function renderPostsFeed() {
    return (
      <div className="space-y-4">
      {loading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading business insights...</p>
          </CardContent>
        </Card>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Lightbulb className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No insights yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to share a business insight with the community!
            </p>
            {currentUser && (
              <CreatePostDialog 
                currentUser={currentUser} 
                onPostCreated={handlePostCreated}
                variant="default"
              />
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          {posts.map((post, index) => (
            <React.Fragment key={post.$id}>
              <PostCard
                post={post}
                currentUser={currentUser}
                onLike={handleLikePost}
                onPostUpdated={loadPosts}
              />
              {(index + 1) % 6 === 0 && <SponsoredContent type="post" />}
            </React.Fragment>
          ))}
        </>
      )}

      {/* Community Guidelines */}
      <Card className="border-primary/20 bg-primary/5 mt-6">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Community Guidelines
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Share actionable business insights and market analysis</li>
            <li>• Discuss entrepreneurship, innovations, and investment strategies</li>
            <li>• Cite sources when sharing market data or forecasts</li>
            <li>• Maintain professional discourse and constructive feedback</li>
          </ul>
        </CardContent>
      </Card>
      </div>
    );
  }
};

export default CommunityFeed;
