import { databases, storage, DATABASE_ID } from './appwrite';
import { ID, Query } from 'appwrite';

export const COMMUNITY_POSTS_COLLECTION_ID = 'community_posts';
export const COMMUNITY_COMMENTS_COLLECTION_ID = 'community_comments';
export const BADGES_COLLECTION_ID = 'badges';
export const ADS_COLLECTION_ID = 'ads';
export const AD_STATS_COLLECTION_ID = 'ad_stats';

export interface CommunityPost {
  $id?: string;
  user_id: string;
  user_name: string;
  user_badge?: string;
  post_type: 'text' | 'image' | 'link' | 'insight';
  content: string;
  image_url?: string;
  link_url?: string;
  likes: number;
  liked_by: string[];
  comments_count: number;
  status: 'active' | 'flagged' | 'deleted';
  created_at: string;
}

export interface CommunityComment {
  $id?: string;
  post_id: string;
  user_id: string;
  user_name: string;
  user_badge?: string;
  content: string;
  likes: number;
  liked_by: string[];
  created_at: string;
}

export interface Badge {
  $id?: string;
  name: string;
  tier: 'Pro' | 'Elite' | 'Institutional' | 'Community Leader' | 'Verified Institution' | 'Featured Partner';
  icon: string;
  color: string;
}

export interface Ad {
  $id?: string;
  title: string;
  image: string;
  link: string;
  category: string;
  sponsor: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'paused' | 'ended';
}

// Posts
export const createPost = async (postData: Omit<CommunityPost, '$id' | 'created_at'>) => {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      COMMUNITY_POSTS_COLLECTION_ID,
      ID.unique(),
      {
        ...postData,
        created_at: new Date().toISOString()
      }
    );
    return { data: response, error: null };
  } catch (error) {
    console.error('Error creating post:', error);
    return { data: null, error };
  }
};

export const getPosts = async (sortBy: 'newest' | 'trending' = 'newest', limit: number = 20) => {
  try {
    const queries = [
      Query.equal('status', 'active'),
      Query.limit(limit)
    ];

    if (sortBy === 'newest') {
      queries.push(Query.orderDesc('created_at'));
    } else {
      queries.push(Query.orderDesc('likes'));
    }

    const response = await databases.listDocuments(
      DATABASE_ID,
      COMMUNITY_POSTS_COLLECTION_ID,
      queries
    );
    return { data: response.documents, error: null };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { data: [], error };
  }
};

export const likePost = async (postId: string, userId: string) => {
  try {
    const post = await databases.getDocument(
      DATABASE_ID,
      COMMUNITY_POSTS_COLLECTION_ID,
      postId
    );

    const likedBy = post.liked_by || [];
    const isLiked = likedBy.includes(userId);

    const updatedLikedBy = isLiked
      ? likedBy.filter((id: string) => id !== userId)
      : [...likedBy, userId];

    const response = await databases.updateDocument(
      DATABASE_ID,
      COMMUNITY_POSTS_COLLECTION_ID,
      postId,
      {
        likes: updatedLikedBy.length,
        liked_by: updatedLikedBy
      }
    );
    return { data: response, error: null };
  } catch (error) {
    console.error('Error liking post:', error);
    return { data: null, error };
  }
};

export const reportPost = async (postId: string) => {
  try {
    const response = await databases.updateDocument(
      DATABASE_ID,
      COMMUNITY_POSTS_COLLECTION_ID,
      postId,
      { status: 'flagged' }
    );
    return { data: response, error: null };
  } catch (error) {
    console.error('Error reporting post:', error);
    return { data: null, error };
  }
};

export const deletePost = async (postId: string) => {
  try {
    await databases.deleteDocument(
      DATABASE_ID,
      COMMUNITY_POSTS_COLLECTION_ID,
      postId
    );
    return { error: null };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { error };
  }
};

// Comments
export const createComment = async (commentData: Omit<CommunityComment, '$id' | 'created_at'>) => {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      COMMUNITY_COMMENTS_COLLECTION_ID,
      ID.unique(),
      {
        ...commentData,
        created_at: new Date().toISOString()
      }
    );

    // Update post comments count
    const post = await databases.getDocument(
      DATABASE_ID,
      COMMUNITY_POSTS_COLLECTION_ID,
      commentData.post_id
    );

    await databases.updateDocument(
      DATABASE_ID,
      COMMUNITY_POSTS_COLLECTION_ID,
      commentData.post_id,
      { comments_count: (post.comments_count || 0) + 1 }
    );

    return { data: response, error: null };
  } catch (error) {
    console.error('Error creating comment:', error);
    return { data: null, error };
  }
};

export const getComments = async (postId: string) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COMMUNITY_COMMENTS_COLLECTION_ID,
      [
        Query.equal('post_id', postId),
        Query.orderAsc('created_at')
      ]
    );
    return { data: response.documents, error: null };
  } catch (error) {
    console.error('Error fetching comments:', error);
    return { data: [], error };
  }
};

export const likeComment = async (commentId: string, userId: string) => {
  try {
    const comment = await databases.getDocument(
      DATABASE_ID,
      COMMUNITY_COMMENTS_COLLECTION_ID,
      commentId
    );

    const likedBy = comment.liked_by || [];
    const isLiked = likedBy.includes(userId);

    const updatedLikedBy = isLiked
      ? likedBy.filter((id: string) => id !== userId)
      : [...likedBy, userId];

    const response = await databases.updateDocument(
      DATABASE_ID,
      COMMUNITY_COMMENTS_COLLECTION_ID,
      commentId,
      {
        likes: updatedLikedBy.length,
        liked_by: updatedLikedBy
      }
    );
    return { data: response, error: null };
  } catch (error) {
    console.error('Error liking comment:', error);
    return { data: null, error };
  }
};

// Badges
export const getUserBadge = (userPlan: string): string => {
  const badgeMap: { [key: string]: string } = {
    pro: 'Pro',
    elite: 'Elite',
    institutional: 'Institutional',
    'community-leader': 'Community Leader',
    'verified-institution': 'Verified Institution',
    'featured-partner': 'Featured Partner'
  };
  return badgeMap[userPlan.toLowerCase()] || '';
};

// Ads
export const getActiveAds = async () => {
  try {
    const now = new Date().toISOString();
    const response = await databases.listDocuments(
      DATABASE_ID,
      ADS_COLLECTION_ID,
      [
        Query.equal('status', 'active'),
        Query.lessThanEqual('start_date', now),
        Query.greaterThanEqual('end_date', now)
      ]
    );
    return { data: response.documents, error: null };
  } catch (error) {
    console.error('Error fetching ads:', error);
    return { data: [], error };
  }
};

export const trackAdImpression = async (adId: string) => {
  try {
    // Get current stats
    const stats = await databases.listDocuments(
      DATABASE_ID,
      AD_STATS_COLLECTION_ID,
      [Query.equal('ad_id', adId)]
    );

    if (stats.documents.length > 0) {
      // Update existing stats
      const currentStats = stats.documents[0];
      await databases.updateDocument(
        DATABASE_ID,
        AD_STATS_COLLECTION_ID,
        currentStats.$id,
        { impressions: (currentStats.impressions || 0) + 1 }
      );
    } else {
      // Create new stats
      await databases.createDocument(
        DATABASE_ID,
        AD_STATS_COLLECTION_ID,
        ID.unique(),
        {
          ad_id: adId,
          impressions: 1,
          clicks: 0,
          engagement_score: 0
        }
      );
    }
    return { error: null };
  } catch (error) {
    console.error('Error tracking ad impression:', error);
    return { error };
  }
};

export const trackAdClick = async (adId: string) => {
  try {
    const stats = await databases.listDocuments(
      DATABASE_ID,
      AD_STATS_COLLECTION_ID,
      [Query.equal('ad_id', adId)]
    );

    if (stats.documents.length > 0) {
      const currentStats = stats.documents[0];
      await databases.updateDocument(
        DATABASE_ID,
        AD_STATS_COLLECTION_ID,
        currentStats.$id,
        {
          clicks: (currentStats.clicks || 0) + 1,
          engagement_score: ((currentStats.clicks || 0) + 1) / (currentStats.impressions || 1)
        }
      );
    }
    return { error: null };
  } catch (error) {
    console.error('Error tracking ad click:', error);
    return { error };
  }
};
