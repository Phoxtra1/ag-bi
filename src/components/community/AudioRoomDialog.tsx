import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Users } from 'lucide-react';
import { AudioRoom, joinAudioRoom } from '@/lib/communityExtensions';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser } from '@/lib/auth';

interface AudioRoomDialogProps {
  room: AudioRoom;
  onClose: () => void;
  onJoined: () => void;
}

const AudioRoomDialog: React.FC<AudioRoomDialogProps> = ({ room, onClose, onJoined }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const { toast } = useToast();

  const handleJoinRoom = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'Please sign in to join audio rooms',
          variant: 'destructive',
        });
        return;
      }

      await joinAudioRoom(room.$id, {
        user_id: user.$id,
        username: user.name || 'Anonymous',
        user_badge: 'Pro', // This should come from user's actual plan
      });

      setIsJoined(true);
      onJoined();
      
      toast({
        title: 'Joined room',
        description: `You've joined ${room.title}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to join room',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Badge className="bg-red-500">{room.status === 'live' ? '🔴 LIVE' : room.status}</Badge>
            {room.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-muted-foreground">{room.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Host:</span>
            <span>{room.host_name}</span>
            <Badge variant="secondary">{room.host_badge}</Badge>
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="text-sm">
              {room.current_participants} of {room.max_participants} participants
            </span>
          </div>

          {isJoined ? (
            <div className="bg-secondary/20 p-6 rounded-lg text-center space-y-4">
              <div className="text-lg font-medium">You're in the room!</div>
              <p className="text-sm text-muted-foreground">
                Audio streaming is simulated. In production, this would use WebRTC or a service like Daily.co or Agora.
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  variant={isMuted ? "destructive" : "default"}
                  onClick={() => setIsMuted(!isMuted)}
                  className="gap-2"
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  {isMuted ? 'Unmute' : 'Mute'}
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Leave Room
                </Button>
              </div>
            </div>
          ) : (
            <Button className="w-full" onClick={handleJoinRoom}>
              Join Audio Room
            </Button>
          )}

          <div className="text-xs text-muted-foreground text-center">
            Note: Audio rooms require WebRTC integration for full functionality
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AudioRoomDialog;
