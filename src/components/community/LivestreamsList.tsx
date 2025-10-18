import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, Eye, Calendar } from 'lucide-react';
import { getLivestreams, Livestream } from '@/lib/communityExtensions';
import { useToast } from '@/hooks/use-toast';

const LivestreamsList = () => {
  const [streams, setStreams] = useState<Livestream[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadStreams();
  }, []);

  const loadStreams = async () => {
    try {
      const data = await getLivestreams();
      setStreams(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load livestreams',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading livestreams...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Video className="w-6 h-6" />
          Live Streams
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {streams.map((stream) => (
          <Card key={stream.$id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {stream.thumbnail_url && (
              <div className="relative">
                <img 
                  src={stream.thumbnail_url} 
                  alt={stream.title}
                  className="w-full h-48 object-cover"
                />
                {stream.status === 'live' && (
                  <Badge className="absolute top-2 right-2 bg-red-500">
                    🔴 LIVE
                  </Badge>
                )}
              </div>
            )}
            
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-lg">{stream.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{stream.description}</p>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">{stream.streamer_name}</span>
                <Badge variant="secondary" className="text-xs">{stream.streamer_badge}</Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{stream.viewers} viewers</span>
                </div>
                {stream.scheduled_time && stream.status !== 'live' && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(stream.scheduled_time).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1">
                {stream.tags.map((tag, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">#{tag}</Badge>
                ))}
              </div>

              <Button 
                className="w-full" 
                disabled={stream.status === 'ended'}
              >
                {stream.status === 'live' ? 'Watch Now' : stream.status === 'scheduled' ? 'Set Reminder' : 'Stream Ended'}
              </Button>

              <div className="text-xs text-muted-foreground text-center">
                Livestreaming ready for API integration
              </div>
            </div>
          </Card>
        ))}
      </div>

      {streams.length === 0 && (
        <Card className="p-12 text-center">
          <Video className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No Livestreams Yet</h3>
          <p className="text-muted-foreground">Stay tuned for live insights and discussions!</p>
        </Card>
      )}
    </div>
  );
};

export default LivestreamsList;
