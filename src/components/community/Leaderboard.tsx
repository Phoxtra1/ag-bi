import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { getLeaderboard, UserPoints } from '@/lib/communityExtensions';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState<UserPoints[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const data = await getLeaderboard(50);
      setLeaders(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load leaderboard',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (position: number) => {
    if (position === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (position === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (position === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return <Award className="w-5 h-5 text-muted-foreground" />;
  };

  const getRankColor = (position: number) => {
    if (position === 1) return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/50';
    if (position === 2) return 'from-gray-400/20 to-gray-500/20 border-gray-400/50';
    if (position === 3) return 'from-amber-600/20 to-amber-700/20 border-amber-600/50';
    return 'border-border';
  };

  if (loading) {
    return <div className="text-center py-8">Loading leaderboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
          <TrendingUp className="w-8 h-8" />
          Community Leaderboard
        </h2>
        <p className="text-muted-foreground">Top contributors and insight leaders</p>
      </div>

      {/* Top 3 Podium */}
      {leaders.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* 2nd Place */}
          <Card className="p-6 text-center bg-gradient-to-br from-gray-400/10 to-gray-500/10 border-gray-400/30">
            <div className="flex flex-col items-center space-y-3">
              <Medal className="w-12 h-12 text-gray-400" />
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-secondary text-lg">
                  {leaders[1].username?.charAt(0).toUpperCase() || '2'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{leaders[1].username || 'User 2'}</h3>
                <p className="text-sm text-muted-foreground">Level {leaders[1].level}</p>
              </div>
              <div className="text-2xl font-bold">{leaders[1].total_points}</div>
              <Badge variant="secondary">2nd Place</Badge>
            </div>
          </Card>

          {/* 1st Place */}
          <Card className="p-6 text-center bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/50 transform scale-110 z-10">
            <div className="flex flex-col items-center space-y-3">
              <Trophy className="w-16 h-16 text-yellow-500 animate-pulse" />
              <Avatar className="w-20 h-20 border-4 border-yellow-500">
                <AvatarFallback className="bg-secondary text-xl">
                  {leaders[0].username?.charAt(0).toUpperCase() || '1'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-lg">{leaders[0].username || 'User 1'}</h3>
                <p className="text-sm text-muted-foreground">Level {leaders[0].level}</p>
              </div>
              <div className="text-3xl font-bold">{leaders[0].total_points}</div>
              <Badge className="bg-yellow-500 text-black">🏆 Champion</Badge>
            </div>
          </Card>

          {/* 3rd Place */}
          <Card className="p-6 text-center bg-gradient-to-br from-amber-600/10 to-amber-700/10 border-amber-600/30">
            <div className="flex flex-col items-center space-y-3">
              <Medal className="w-12 h-12 text-amber-600" />
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-secondary text-lg">
                  {leaders[2].username?.charAt(0).toUpperCase() || '3'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{leaders[2].username || 'User 3'}</h3>
                <p className="text-sm text-muted-foreground">Level {leaders[2].level}</p>
              </div>
              <div className="text-2xl font-bold">{leaders[2].total_points}</div>
              <Badge variant="secondary">3rd Place</Badge>
            </div>
          </Card>
        </div>
      )}

      {/* Rest of Leaderboard */}
      <div className="space-y-2">
        {leaders.slice(3).map((user, index) => {
          const position = index + 4;
          return (
            <Card key={user.$id} className={`p-4 bg-gradient-to-r ${getRankColor(position)}`}>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-8 flex justify-center">
                    {getRankIcon(position)}
                  </div>
                  <span className="font-bold text-lg w-8">{position}</span>
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-secondary">
                      {user.username?.charAt(0).toUpperCase() || position}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold">{user.username || `User ${position}`}</h4>
                    <p className="text-sm text-muted-foreground">Level {user.level} • {user.rank || 'Member'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">{user.total_points}</div>
                  <div className="text-xs text-muted-foreground">points</div>
                </div>
                {user.badges_earned && user.badges_earned.length > 0 && (
                  <div className="flex gap-1">
                    {user.badges_earned.slice(0, 3).map((badge, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {leaders.length === 0 && (
        <Card className="p-12 text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No Rankings Yet</h3>
          <p className="text-muted-foreground">Be the first to earn points and climb the leaderboard!</p>
        </Card>
      )}
    </div>
  );
};

export default Leaderboard;
