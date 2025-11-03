import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Radio, Video, Trophy, DollarSign, TrendingUp } from 'lucide-react';
import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';

const CommunityAnalytics = () => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalUsers: 0,
    audioRooms: 0,
    livestreams: 0,
    sponsoredContent: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [posts, rooms, streams, sponsored] = await Promise.all([
        databases.listDocuments('amniva-db03', 'community_posts', [Query.limit(1)]),
        databases.listDocuments('amniva-db03', 'audio_rooms', [Query.limit(1)]),
        databases.listDocuments('amniva-db03', 'livestreams', [Query.limit(1)]),
        databases.listDocuments('amniva-db03', 'sponsored_content', [Query.limit(1)]),
      ]);

      setStats({
        totalPosts: posts.total,
        totalUsers: 0, // Would come from user_points collection
        audioRooms: rooms.total,
        livestreams: streams.total,
        sponsoredContent: sponsored.total,
        totalRevenue: 0, // Would be calculated from sponsored content budgets
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, trend }: any) => (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        {trend && (
          <Badge variant="secondary" className="gap-1">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </Badge>
        )}
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </div>
    </Card>
  );

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Community Analytics</h2>
        <p className="text-muted-foreground">Monitor community engagement and growth</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={Users}
          title="Total Posts"
          value={stats.totalPosts}
          subtitle="Community discussions"
        />
        <StatCard
          icon={Radio}
          title="Audio Rooms"
          value={stats.audioRooms}
          subtitle="Insight talks hosted"
        />
        <StatCard
          icon={Video}
          title="Livestreams"
          value={stats.livestreams}
          subtitle="Live sessions"
        />
        <StatCard
          icon={Trophy}
          title="Active Users"
          value={stats.totalUsers}
          subtitle="Engaged members"
        />
        <StatCard
          icon={DollarSign}
          title="Sponsored Content"
          value={stats.sponsoredContent}
          subtitle="Active campaigns"
        />
        <StatCard
          icon={TrendingUp}
          title="Revenue"
          value={`€${stats.totalRevenue.toLocaleString()}`}
          subtitle="From sponsored content"
        />
      </div>

      <Tabs defaultValue="engagement" className="space-y-4">
        <TabsList>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="monetization">Monetization</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
        </TabsList>

        <TabsContent value="engagement" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Engagement Metrics</h3>
            <p className="text-sm text-muted-foreground">
              Detailed engagement analytics including posts, comments, likes, and shares will appear here.
              Integration with charts library recommended for visualization.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="monetization" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Revenue & Sponsored Content</h3>
            <p className="text-sm text-muted-foreground">
              Track sponsored content performance, ad revenue, and monetization metrics.
              Self-service ad platform coming soon for verified accounts.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="growth" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Community Growth</h3>
            <p className="text-sm text-muted-foreground">
              Monitor user acquisition, retention rates, and community expansion metrics.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityAnalytics;
