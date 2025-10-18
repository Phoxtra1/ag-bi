import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, TrendingUp } from 'lucide-react';
import { getSponsoredContent, SponsoredContent as SponsoredContentType, trackSponsoredImpression, trackSponsoredClick } from '@/lib/communityExtensions';

interface SponsoredContentProps {
  type?: 'discussion' | 'channel' | 'post' | 'banner';
}

const SponsoredContent: React.FC<SponsoredContentProps> = ({ type = 'post' }) => {
  const [content, setContent] = useState<SponsoredContentType | null>(null);

  useEffect(() => {
    loadSponsoredContent();
  }, [type]);

  const loadSponsoredContent = async () => {
    try {
      const data = await getSponsoredContent(type);
      if (data.length > 0) {
        const randomContent = data[Math.floor(Math.random() * data.length)];
        setContent(randomContent);
        // Track impression
        trackSponsoredImpression(randomContent.$id);
      }
    } catch (error) {
      console.error('Error loading sponsored content:', error);
    }
  };

  const handleClick = () => {
    if (content) {
      trackSponsoredClick(content.$id);
      if (content.target_url) {
        window.open(content.target_url, '_blank');
      }
    }
  };

  if (!content) {
    return null;
  }

  return (
    <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 relative overflow-hidden">
      <Badge className="absolute top-2 right-2 bg-primary/80 text-xs">
        Sponsored
      </Badge>
      
      <div className="space-y-3">
        {content.sponsor_logo && (
          <div className="flex items-center gap-2">
            <img 
              src={content.sponsor_logo} 
              alt={content.sponsor_name}
              className="w-8 h-8 rounded object-contain"
            />
            <span className="text-sm font-medium">{content.sponsor_name}</span>
          </div>
        )}

        <div>
          <h3 className="font-semibold text-lg mb-1">{content.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-3">{content.content}</p>
        </div>

        {content.target_url && (
          <button
            onClick={handleClick}
            className="flex items-center gap-2 text-sm text-primary hover:underline font-medium"
          >
            Learn More <ExternalLink className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>{content.impressions || 0} views</span>
          </div>
          {content.clicks > 0 && (
            <span>{content.clicks} clicks</span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default SponsoredContent;
