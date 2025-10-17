import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, MessageSquare, Flag, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import CommentSection from './CommentSection';
import { reportPost } from '@/lib/community';
import { useToast } from '@/hooks/use-toast';

interface PostCardProps {
  post: any;
  currentUser: any;
  onLike: (postId: string) => void;
  onPostUpdated: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUser, onLike, onPostUpdated }) => {
  const [showComments, setShowComments] = useState(false);
  const { toast } = useToast();

  const handleReport = async () => {
    const { error } = await reportPost(post.$id);
    if (!error) {
      toast({
        title: "Post Reported",
        description: "This post has been flagged for review by our moderation team"
      });
      onPostUpdated();
    }
  };

  const isLiked = currentUser && post.liked_by?.includes(currentUser.$id);
  const userInitials = post.user_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U';

  const getBadgeColor = (badge: string) => {
    const colors: { [key: string]: string } = {
      'Elite': 'bg-gradient-to-r from-yellow-400 to-amber-500',
      'Institutional': 'bg-gradient-to-r from-blue-500 to-indigo-600',
      'Pro': 'bg-gradient-to-r from-green-500 to-emerald-600',
      'Community Leader': 'bg-gradient-to-r from-purple-500 to-pink-600',
      'Verified Institution': 'bg-gradient-to-r from-cyan-500 to-blue-600',
      'Featured Partner': 'bg-gradient-to-r from-orange-500 to-red-600'
    };
    return colors[badge] || 'bg-gray-500';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{post.user_name}</span>
                {post.user_badge && (
                  <Badge className={`${getBadgeColor(post.user_badge)} text-white text-xs`}>
                    {post.user_badge}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReport}
            className="text-muted-foreground hover:text-destructive"
          >
            <Flag className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Post Content */}
        <div className="space-y-3">
          {post.post_type === 'insight' && (
            <Badge variant="outline" className="mb-2">
              📊 Insight
            </Badge>
          )}
          
          <p className="text-foreground whitespace-pre-wrap">{post.content}</p>

          {post.image_url && (
            <div className="rounded-lg overflow-hidden border">
              <img 
                src={post.image_url} 
                alt="Post image" 
                className="w-full object-cover max-h-96"
              />
            </div>
          )}

          {post.link_url && (
            <a
              href={post.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              {post.link_url}
            </a>
          )}
        </div>

        {/* Engagement Actions */}
        <div className="flex items-center gap-6 pt-3 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike(post.$id)}
            className={isLiked ? 'text-red-500' : 'text-muted-foreground'}
            disabled={!currentUser}
          >
            <Heart className={`h-5 w-5 mr-2 ${isLiked ? 'fill-red-500' : ''}`} />
            <span className="font-medium">{post.likes || 0}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="text-muted-foreground"
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            <span className="font-medium">{post.comments_count || 0}</span>
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <CommentSection
            postId={post.$id}
            currentUser={currentUser}
            onCommentAdded={onPostUpdated}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;
