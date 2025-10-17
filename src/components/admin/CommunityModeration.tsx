import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Flag, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Eye,
  BarChart3,
  Users,
  MessageSquare
} from 'lucide-react';
import { databases, DATABASE_ID } from '@/lib/appwrite';
import { COMMUNITY_POSTS_COLLECTION_ID } from '@/lib/community';
import { Query } from 'appwrite';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

const CommunityModeration = () => {
  const [flaggedPosts, setFlaggedPosts] = useState<any[]>([]);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    activePosts: 0,
    flaggedPosts: 0,
    deletedPosts: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load flagged posts
      const flaggedResponse = await databases.listDocuments(
        DATABASE_ID,
        COMMUNITY_POSTS_COLLECTION_ID,
        [Query.equal('status', 'flagged'), Query.orderDesc('created_at')]
      );
      setFlaggedPosts(flaggedResponse.documents);

      // Load all posts for stats
      const allResponse = await databases.listDocuments(
        DATABASE_ID,
        COMMUNITY_POSTS_COLLECTION_ID,
        [Query.orderDesc('created_at'), Query.limit(100)]
      );
      setAllPosts(allResponse.documents);

      // Calculate stats
      const active = allResponse.documents.filter((p: any) => p.status === 'active').length;
      const flagged = allResponse.documents.filter((p: any) => p.status === 'flagged').length;
      const deleted = allResponse.documents.filter((p: any) => p.status === 'deleted').length;

      setStats({
        totalPosts: allResponse.total,
        activePosts: active,
        flaggedPosts: flagged,
        deletedPosts: deleted
      });
    } catch (error) {
      console.error('Error loading community data:', error);
    }
    setLoading(false);
  };

  const handleApprovePost = async (postId: string) => {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        COMMUNITY_POSTS_COLLECTION_ID,
        postId,
        { status: 'active' }
      );
      toast({
        title: "Post Approved",
        description: "The post has been restored to the community feed"
      });
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve post",
        variant: "destructive"
      });
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COMMUNITY_POSTS_COLLECTION_ID,
        postId
      );
      toast({
        title: "Post Deleted",
        description: "The post has been permanently removed"
      });
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Posts</p>
                <p className="text-2xl font-bold">{stats.totalPosts}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Posts</p>
                <p className="text-2xl font-bold text-green-600">{stats.activePosts}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Flagged</p>
                <p className="text-2xl font-bold text-orange-600">{stats.flaggedPosts}</p>
              </div>
              <Flag className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Deleted</p>
                <p className="text-2xl font-bold text-red-600">{stats.deletedPosts}</p>
              </div>
              <Trash2 className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Moderation Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5" />
            Flagged Posts - Moderation Queue
          </CardTitle>
          <CardDescription>
            Review and moderate community posts that have been flagged by users
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            </div>
          ) : flaggedPosts.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <p className="text-xl font-semibold mb-2">All Clear!</p>
              <p className="text-muted-foreground">No flagged posts require moderation</p>
            </div>
          ) : (
            <div className="space-y-4">
              {flaggedPosts.map((post) => (
                <Card key={post.$id} className="border-orange-200 bg-orange-50/30">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{post.user_name}</span>
                            {post.user_badge && (
                              <Badge variant="outline">{post.user_badge}</Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {post.post_type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                          </p>
                        </div>
                        <Badge variant="destructive">
                          <Flag className="h-3 w-3 mr-1" />
                          Flagged
                        </Badge>
                      </div>

                      <p className="text-sm whitespace-pre-wrap">{post.content}</p>

                      {post.image_url && (
                        <img 
                          src={post.image_url} 
                          alt="Post content" 
                          className="rounded-lg max-h-48 object-cover"
                        />
                      )}

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>❤️ {post.likes || 0} likes</span>
                        <span>💬 {post.comments_count || 0} comments</span>
                      </div>

                      <div className="flex gap-2 pt-2 border-t">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApprovePost(post.$id)}
                          className="text-green-600 hover:bg-green-50"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeletePost(post.$id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityModeration;
