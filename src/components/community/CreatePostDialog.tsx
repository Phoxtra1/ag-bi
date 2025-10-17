import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Image, Link, FileText } from 'lucide-react';
import { createPost, getUserBadge } from '@/lib/community';
import { useToast } from '@/hooks/use-toast';

interface CreatePostDialogProps {
  currentUser: any;
  onPostCreated: () => void;
  variant?: 'default' | 'outline';
}

const CreatePostDialog: React.FC<CreatePostDialogProps> = ({ 
  currentUser, 
  onPostCreated,
  variant = 'outline'
}) => {
  const [open, setOpen] = useState(false);
  const [postType, setPostType] = useState<'text' | 'image' | 'link' | 'insight'>('text');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter some content for your post",
        variant: "destructive"
      });
      return;
    }

    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create posts",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    const postData = {
      user_id: currentUser.$id,
      user_name: currentUser.name || currentUser.email,
      user_badge: getUserBadge(currentUser.prefs?.plan || 'pro'),
      post_type: postType,
      content: content.trim(),
      image_url: postType === 'image' ? imageUrl : undefined,
      link_url: postType === 'link' ? linkUrl : undefined,
      likes: 0,
      liked_by: [],
      comments_count: 0,
      status: 'active' as const
    };

    const { error } = await createPost(postData);

    setSubmitting(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Your post has been shared with the community"
      });
      setContent('');
      setImageUrl('');
      setLinkUrl('');
      setPostType('text');
      setOpen(false);
      onPostCreated();
    }
  };

  if (!currentUser) {
    return (
      <Button variant="outline" disabled>
        <Plus className="h-4 w-4 mr-2" />
        Sign in to Post
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant}>
          <Plus className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create a New Post</DialogTitle>
          <DialogDescription>
            Share your thoughts, insights, or resources with the Amniva community
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Post Type Selection */}
          <div className="space-y-2">
            <Label>Post Type</Label>
            <Select value={postType} onValueChange={(v: any) => setPostType(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Text Post
                  </div>
                </SelectItem>
                <SelectItem value="image">
                  <div className="flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Image Post
                  </div>
                </SelectItem>
                <SelectItem value="link">
                  <div className="flex items-center gap-2">
                    <Link className="h-4 w-4" />
                    Link Post
                  </div>
                </SelectItem>
                <SelectItem value="insight">
                  <div className="flex items-center gap-2">
                    📊 Insight
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea
              placeholder="Share your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>

          {/* Image URL (if image post) */}
          {postType === 'image' && (
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
          )}

          {/* Link URL (if link post) */}
          {postType === 'link' && (
            <div className="space-y-2">
              <Label>Link URL</Label>
              <Input
                type="url"
                placeholder="https://example.com/article"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || !content.trim()}
            >
              {submitting ? 'Posting...' : 'Post to Community'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
