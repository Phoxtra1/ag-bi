import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Heart, Flag, TrendingUp, Clock, Users } from 'lucide-react';
import { getPosts, createPost, likePost, getUserBadge } from '@/lib/community';
import { getCurrentUser } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import PostCard from './PostCard';
import CreatePostDialog from './CreatePostDialog';

const CommunityFeed = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'trending'>('newest');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadCurrentUser();
    loadPosts();
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
        description: "Please sign in to like posts",
        variant: "destructive"
      });
      return;
    }

    await likePost(postId, currentUser.$id);
    loadPosts();
  };

  const handlePostCreated = () => {
    loadPosts();
    toast({
      title: "Post Created",
      description: "Your post has been shared with the community"
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                Amniva Society
              </CardTitle>
              <p className="text-muted-foreground">
                Connect, share insights, and build community with verified professionals
              </p>
            </div>
            <CreatePostDialog 
              currentUser={currentUser} 
              onPostCreated={handlePostCreated}
            />
          </div>
        </CardHeader>
      </Card>

      {/* Sort Tabs */}
      <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as 'newest' | 'trending')}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="newest" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Newest
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trending
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Posts Feed */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading community posts...</p>
            </CardContent>
          </Card>
        ) : posts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to share something with the community!
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
          posts.map((post) => (
            <PostCard
              key={post.$id}
              post={post}
              currentUser={currentUser}
              onLike={handleLikePost}
              onPostUpdated={loadPosts}
            />
          ))
        )}
      </div>

      {/* Community Guidelines */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Community Guidelines
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Be respectful and professional in all interactions</li>
            <li>• Share accurate information and cite sources when possible</li>
            <li>• Report inappropriate content to help maintain community standards</li>
            <li>• Engage constructively and contribute meaningful insights</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityFeed;
