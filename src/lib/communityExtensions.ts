import { databases, storage, account } from './appwrite';
import { ID, Query } from 'appwrite';

const DATABASE_ID = 'amniva-db03';
const AUDIO_ROOMS_COLLECTION = 'audio_rooms';
const ROOM_PARTICIPANTS_COLLECTION = 'room_participants';
const LIVESTREAMS_COLLECTION = 'livestreams';
const USER_POINTS_COLLECTION = 'user_points';
const POINT_TRANSACTIONS_COLLECTION = 'point_transactions';
const LEADERBOARD_COLLECTION = 'leaderboard';
const SPONSORED_CONTENT_COLLECTION = 'sponsored_content';

// Audio Rooms
export interface AudioRoom {
  $id: string;
  title: string;
  description: string;
  host_id: string;
  host_name: string;
  host_badge: string;
  status: 'scheduled' | 'live' | 'ended';
  scheduled_time?: string;
  started_at?: string;
  ended_at?: string;
  max_participants: number;
  current_participants: number;
  tags: string[];
  room_type: 'insight_talk' | 'discussion' | 'qa' | 'panel';
  created_at: string;
}

export interface RoomParticipant {
  $id: string;
  room_id: string;
  user_id: string;
  username: string;
  user_badge: string;
  joined_at: string;
  is_speaker: boolean;
  is_muted: boolean;
}

export const createAudioRoom = async (roomData: Omit<AudioRoom, '$id' | 'created_at' | 'current_participants'>) => {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      AUDIO_ROOMS_COLLECTION,
      ID.unique(),
      {
        ...roomData,
        current_participants: 0,
        created_at: new Date().toISOString(),
      }
    );
    return response;
  } catch (error) {
    console.error('Error creating audio room:', error);
    throw error;
  }
};

export const getAudioRooms = async (status?: string) => {
  try {
    const queries = status ? [Query.equal('status', status)] : [];
    queries.push(Query.orderDesc('created_at'));
    
    const response = await databases.listDocuments(
      DATABASE_ID,
      AUDIO_ROOMS_COLLECTION,
      queries
    );
    return response.documents as unknown as AudioRoom[];
  } catch (error) {
    console.error('Error fetching audio rooms:', error);
    throw error;
  }
};

export const joinAudioRoom = async (roomId: string, userData: { user_id: string; username: string; user_badge: string }) => {
  try {
    const participant = await databases.createDocument(
      DATABASE_ID,
      ROOM_PARTICIPANTS_COLLECTION,
      ID.unique(),
      {
        room_id: roomId,
        ...userData,
        joined_at: new Date().toISOString(),
        is_speaker: false,
        is_muted: false,
      }
    );

    // Update participant count
    const room = await databases.getDocument(DATABASE_ID, AUDIO_ROOMS_COLLECTION, roomId);
    await databases.updateDocument(DATABASE_ID, AUDIO_ROOMS_COLLECTION, roomId, {
      current_participants: (room.current_participants || 0) + 1,
    });

    return participant;
  } catch (error) {
    console.error('Error joining audio room:', error);
    throw error;
  }
};

// Livestreams
export interface Livestream {
  $id: string;
  title: string;
  description: string;
  streamer_id: string;
  streamer_name: string;
  streamer_badge: string;
  status: 'scheduled' | 'live' | 'ended';
  stream_url?: string;
  thumbnail_url?: string;
  scheduled_time?: string;
  started_at?: string;
  ended_at?: string;
  viewers: number;
  tags: string[];
  created_at: string;
}

export const createLivestream = async (streamData: Omit<Livestream, '$id' | 'created_at' | 'viewers'>) => {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      LIVESTREAMS_COLLECTION,
      ID.unique(),
      {
        ...streamData,
        viewers: 0,
        created_at: new Date().toISOString(),
      }
    );
    return response;
  } catch (error) {
    console.error('Error creating livestream:', error);
    throw error;
  }
};

export const getLivestreams = async (status?: string) => {
  try {
    const queries = status ? [Query.equal('status', status)] : [];
    queries.push(Query.orderDesc('created_at'));
    
    const response = await databases.listDocuments(
      DATABASE_ID,
      LIVESTREAMS_COLLECTION,
      queries
    );
    return response.documents as unknown as Livestream[];
  } catch (error) {
    console.error('Error fetching livestreams:', error);
    throw error;
  }
};

// Gamification - Points System
export interface UserPoints {
  $id: string;
  user_id: string;
  username: string;
  total_points: number;
  level: number;
  rank: string;
  badges_earned: string[];
  achievements: string[];
}

export interface PointTransaction {
  $id: string;
  user_id: string;
  points: number;
  action_type: 'post_created' | 'comment_added' | 'like_received' | 'insight_shared' | 'room_hosted' | 'stream_completed';
  description: string;
  created_at: string;
}

export const awardPoints = async (userId: string, points: number, actionType: string, description: string) => {
  try {
    // Create transaction
    await databases.createDocument(
      DATABASE_ID,
      POINT_TRANSACTIONS_COLLECTION,
      ID.unique(),
      {
        user_id: userId,
        points,
        action_type: actionType,
        description,
        created_at: new Date().toISOString(),
      }
    );

    // Update user points
    const userPoints = await databases.listDocuments(
      DATABASE_ID,
      USER_POINTS_COLLECTION,
      [Query.equal('user_id', userId)]
    );

    if (userPoints.documents.length > 0) {
      const current = userPoints.documents[0];
      const newTotal = (current.total_points || 0) + points;
      const newLevel = Math.floor(newTotal / 100) + 1;
      
      await databases.updateDocument(
        DATABASE_ID,
        USER_POINTS_COLLECTION,
        current.$id,
        {
          total_points: newTotal,
          level: newLevel,
        }
      );
    } else {
      // Create new points record
      await databases.createDocument(
        DATABASE_ID,
        USER_POINTS_COLLECTION,
        ID.unique(),
        {
          user_id: userId,
          username: '',
          total_points: points,
          level: 1,
          rank: 'Newcomer',
          badges_earned: [],
          achievements: [],
        }
      );
    }

    return true;
  } catch (error) {
    console.error('Error awarding points:', error);
    throw error;
  }
};

export const getUserPoints = async (userId: string) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      USER_POINTS_COLLECTION,
      [Query.equal('user_id', userId)]
    );
    return response.documents[0] as unknown as UserPoints;
  } catch (error) {
    console.error('Error fetching user points:', error);
    return null;
  }
};

export const getLeaderboard = async (limit: number = 50) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      USER_POINTS_COLLECTION,
      [Query.orderDesc('total_points'), Query.limit(limit)]
    );
    return response.documents as unknown as UserPoints[];
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};

// Sponsored Content
export interface SponsoredContent {
  $id: string;
  title: string;
  content: string;
  sponsor_name: string;
  sponsor_logo?: string;
  content_type: 'discussion' | 'channel' | 'post' | 'banner';
  target_url?: string;
  impressions: number;
  clicks: number;
  budget: number;
  spent: number;
  status: 'active' | 'paused' | 'ended';
  start_date: string;
  end_date: string;
  created_at: string;
}

export const getSponsoredContent = async (contentType?: string) => {
  try {
    const queries = [
      Query.equal('status', 'active'),
      Query.orderDesc('created_at')
    ];
    
    if (contentType) {
      queries.push(Query.equal('content_type', contentType));
    }
    
    const response = await databases.listDocuments(
      DATABASE_ID,
      SPONSORED_CONTENT_COLLECTION,
      queries
    );
    return response.documents as unknown as SponsoredContent[];
  } catch (error) {
    console.error('Error fetching sponsored content:', error);
    throw error;
  }
};

export const trackSponsoredImpression = async (contentId: string) => {
  try {
    const content = await databases.getDocument(DATABASE_ID, SPONSORED_CONTENT_COLLECTION, contentId);
    await databases.updateDocument(DATABASE_ID, SPONSORED_CONTENT_COLLECTION, contentId, {
      impressions: (content.impressions || 0) + 1,
    });
  } catch (error) {
    console.error('Error tracking impression:', error);
  }
};

export const trackSponsoredClick = async (contentId: string) => {
  try {
    const content = await databases.getDocument(DATABASE_ID, SPONSORED_CONTENT_COLLECTION, contentId);
    await databases.updateDocument(DATABASE_ID, SPONSORED_CONTENT_COLLECTION, contentId, {
      clicks: (content.clicks || 0) + 1,
    });
  } catch (error) {
    console.error('Error tracking click:', error);
  }
};
