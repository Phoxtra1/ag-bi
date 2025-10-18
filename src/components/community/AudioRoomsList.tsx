import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, Users, Calendar, Radio } from 'lucide-react';
import { getAudioRooms, AudioRoom } from '@/lib/communityExtensions';
import { useToast } from '@/hooks/use-toast';
import AudioRoomDialog from './AudioRoomDialog';

const AudioRoomsList = () => {
  const [rooms, setRooms] = useState<AudioRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<AudioRoom | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const data = await getAudioRooms();
      setRooms(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load audio rooms',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoomStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-red-500';
      case 'scheduled': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading audio rooms...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Radio className="w-6 h-6" />
          Insight Talks & Audio Rooms
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <Card key={room.$id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getRoomStatusColor(room.status)}>
                      {room.status === 'live' ? '🔴 LIVE' : room.status.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">{room.room_type.replace('_', ' ')}</Badge>
                  </div>
                  <h3 className="font-semibold text-lg">{room.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{room.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Mic className="w-4 h-4" />
                  <span>{room.host_name}</span>
                  <Badge variant="secondary" className="ml-1 text-xs">{room.host_badge}</Badge>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{room.current_participants}/{room.max_participants}</span>
                </div>
                {room.scheduled_time && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(room.scheduled_time).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1">
                {room.tags.map((tag, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">#{tag}</Badge>
                ))}
              </div>

              <Button 
                className="w-full" 
                onClick={() => setSelectedRoom(room)}
                disabled={room.status === 'ended' || room.current_participants >= room.max_participants}
              >
                {room.status === 'live' ? 'Join Room' : room.status === 'scheduled' ? 'Set Reminder' : 'Ended'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {rooms.length === 0 && (
        <Card className="p-12 text-center">
          <Radio className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No Audio Rooms Yet</h3>
          <p className="text-muted-foreground">Check back soon for Insight Talks from verified experts!</p>
        </Card>
      )}

      {selectedRoom && (
        <AudioRoomDialog 
          room={selectedRoom} 
          onClose={() => setSelectedRoom(null)} 
          onJoined={loadRooms}
        />
      )}
    </div>
  );
};

export default AudioRoomsList;
