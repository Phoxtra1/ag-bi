import React, { useRef, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Image as ImageIcon, Smile, SquareGanttChart, UploadCloud } from 'lucide-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { storage, CONTENT_BUCKET_ID } from '@/lib/appwrite';
import { ID } from 'appwrite';

interface PostComposerProps {
  currentUser: any;
  content: string;
  setContent: (v: string) => void;
  imageUrl?: string;
  setImageUrl?: (v: string) => void;
}

const PostComposer: React.FC<PostComposerProps> = ({ currentUser, content, setContent, imageUrl, setImageUrl }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  const handlePickEmoji = (emoji: any) => {
    setContent(content + emoji.native);
  };

  const handleChooseFile = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !setImageUrl) return;
    try {
      setUploading(true);
      const created = await storage.createFile(CONTENT_BUCKET_ID, ID.unique(), file);
      const preview = storage.getFilePreview(CONTENT_BUCKET_ID, created.$id).toString();
      setImageUrl(preview);
    } catch (err) {
      console.error('Media upload failed', err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const placeholder = `Share something as ${currentUser?.name || currentUser?.email || 'guest'}`;

  return (
    <div className="space-y-3">
      <Textarea
        placeholder={placeholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={5}
        className="resize-none"
      />

      {imageUrl && (
        <div className="rounded-lg overflow-hidden border">
          <img src={imageUrl} alt="Selected media preview" className="w-full object-cover max-h-80" />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          <Button type="button" variant="ghost" size="sm" onClick={handleChooseFile} disabled={uploading}>
            {uploading ? <UploadCloud className="h-4 w-4 mr-2" /> : <ImageIcon className="h-4 w-4 mr-2" />}
            Media
          </Button>

          <Button type="button" variant="ghost" size="sm" disabled>
            <SquareGanttChart className="h-4 w-4 mr-2" />
            GIF
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="ghost" size="sm">
                <Smile className="h-4 w-4 mr-2" />
                Emoji
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 border-none shadow-none bg-transparent">
              {/* Emoji picker */}
              {/* @ts-ignore */}
              <Picker data={data} onEmojiSelect={handlePickEmoji} theme="light" previewPosition="none" navPosition="top" />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default PostComposer;
