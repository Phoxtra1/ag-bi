import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';
import { getComments, createComment, likeComment, getUserBadge } from '@/lib/community';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface CommentSectionProps {
  postId: string;
  currentUser: any;
  onCommentAdded: () => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, currentUser, onCommentAdded }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    setLoading(true);
    const { data } = await getComments(postId);
    if (data) {
      setComments(data);
    }
    setLoading(false);
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to comment",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    const commentData = {
      post_id: postId,
      user_id: currentUser.$id,
      user_name: currentUser.name || currentUser.email,
      user_badge: getUserBadge(currentUser.prefs?.plan || 'pro'),
      content: newComment.trim(),
      likes: 0,
      liked_by: []
    };

    const { error } = await createComment(commentData);

    setSubmitting(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive"
      });
    } else {
      setNewComment('');
      loadComments();
      onCommentAdded();
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to like comments",
        variant: "destructive"
      });
      return;
    }

    await likeComment(commentId, currentUser.$id);
    loadComments();
  };

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
    <div className="space-y-4 pt-4 border-t">
      {/* Comment Input */}
      {currentUser && (
        <div className="flex gap-3">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {(currentUser.name || currentUser.email)?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder={`Comment as ${currentUser?.name || currentUser?.email}`}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={2}
              className="resize-none"
            />
            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={handleSubmitComment}
                disabled={submitting || !newComment.trim()}
              >
                {submitting ? 'Posting...' : 'Comment'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            const isLiked = currentUser && comment.liked_by?.includes(currentUser.$id);
            const userInitials = comment.user_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U';

            return (
              <div key={comment.$id} className="flex gap-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-muted text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{comment.user_name}</span>
                    {comment.user_badge && (
                      <Badge className={`${getBadgeColor(comment.user_badge)} text-white text-xs`}>
                        {comment.user_badge}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{comment.content}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLikeComment(comment.$id)}
                    className={`h-auto p-1 ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
                    disabled={!currentUser}
                  >
                    <Heart className={`h-3 w-3 mr-1 ${isLiked ? 'fill-red-500' : ''}`} />
                    <span className="text-xs">{comment.likes || 0}</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
