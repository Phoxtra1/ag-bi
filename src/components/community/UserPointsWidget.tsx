import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, TrendingUp, Award } from 'lucide-react';
import { getUserPoints, UserPoints } from '@/lib/communityExtensions';
import { getCurrentUser } from '@/lib/auth';

const UserPointsWidget = () => {
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserPoints();
  }, []);

  const loadUserPoints = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const points = await getUserPoints(user.$id);
      setUserPoints(points);
    } catch (error) {
      console.error('Error loading user points:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  if (!userPoints) {
    return (
      <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="text-center space-y-2">
          <Star className="w-8 h-8 mx-auto text-primary" />
          <h3 className="font-semibold">Start Earning Points!</h3>
          <p className="text-sm text-muted-foreground">Contribute to earn points and unlock rewards</p>
        </div>
      </Card>
    );
  }

  const pointsToNextLevel = (userPoints.level * 100) - (userPoints.total_points % 100);
  const progressToNextLevel = ((userPoints.total_points % 100) / 100) * 100;

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Your Progress
            </h3>
            <p className="text-sm text-muted-foreground">Keep contributing to level up!</p>
          </div>
          <Badge className="text-lg px-4 py-2">
            Level {userPoints.level}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Total Points</span>
            <span className="font-bold text-primary">{userPoints.total_points}</span>
          </div>
          <Progress value={progressToNextLevel} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">
            {pointsToNextLevel} points to Level {userPoints.level + 1}
          </p>
        </div>

        {userPoints.rank && (
          <div className="flex items-center gap-2 p-3 bg-background/50 rounded-lg">
            <Award className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Current Rank</p>
              <p className="text-xs text-muted-foreground">{userPoints.rank}</p>
            </div>
          </div>
        )}

        {userPoints.badges_earned && userPoints.badges_earned.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Badges Earned</p>
            <div className="flex flex-wrap gap-1">
              {userPoints.badges_earned.map((badge, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            💡 Earn points by posting insights, helping others, and engaging with the community!
          </p>
        </div>
      </div>
    </Card>
  );
};

export default UserPointsWidget;
