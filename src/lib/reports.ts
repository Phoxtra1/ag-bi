import { databases } from './appwrite';
import { DATABASE_ID, REPORTS_COLLECTION_ID, INSIGHTS_COLLECTION_ID } from './database';
import { ID, Models } from 'appwrite';

export interface ReportSubmission {
  title: string;
  category: 'Environment' | 'Political' | 'Weather' | 'Business' | 'Disaster' | 'Other';
  content: string;
  location?: string;
  tags?: string[];
  userId: string;
  userEmail: string;
  userName: string;
  userPlan: 'Free' | 'Pro' | 'Elite' | 'Institutional';
  status?: 'pending' | 'ai_processed' | 'human_reviewed' | 'delivered';
  submissionType?: 'text' | 'data' | 'observation';
}

export interface InsightData {
  reportId: string;
  userId: string;
  userEmail: string;
  userPlan: 'Free' | 'Pro' | 'Elite' | 'Institutional';
  
  // AI-generated fields
  aiSummary?: string;
  aiKeyObservations?: string[];
  aiRecommendedActions?: string[];
  aiConfidence?: number;
  aiPatterns?: string;
  aiStatus?: 'pending' | 'generated' | 'failed';
  
  // Human review fields
  humanReviewed?: boolean;
  humanReviewedBy?: string;
  humanReviewDate?: string;
  humanEnhancedSummary?: string;
  humanEnhancedObservations?: string[];
  humanEnhancedActions?: string[];
  humanVerified?: boolean;
  humanFeedback?: string;
  
  // Delivery status
  status: 'pending_ai' | 'pending_review' | 'verified' | 'delivered';
  deliveryMethod?: 'dashboard' | 'email';
  deliveredAt?: string;
}

// Create report submission
export async function createReportSubmission(data: ReportSubmission) {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      REPORTS_COLLECTION_ID,
      ID.unique(),
      {
        title: data.title,
        category: data.category,
        content: data.content,
        location: data.location || '',
        tags: data.tags || [],
        userId: data.userId,
        userEmail: data.userEmail,
        userName: data.userName,
        userPlan: data.userPlan,
        status: data.status || 'pending',
        submissionType: data.submissionType || 'text',
        submittedAt: new Date().toISOString()
      }
    );
    return response;
  } catch (error) {
    console.error('Error creating report submission:', error);
    throw error;
  }
}

// Get user reports
export async function getUserReports(userId: string): Promise<Models.DocumentList<Models.Document>> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      REPORTS_COLLECTION_ID,
      [`userId="${userId}"`]
    );
    return response;
  } catch (error) {
    console.error('Error fetching user reports:', error);
    throw error;
  }
}

// Get all reports (admin)
export async function getAllReports(): Promise<Models.DocumentList<Models.Document>> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      REPORTS_COLLECTION_ID
    );
    return response;
  } catch (error) {
    console.error('Error fetching all reports:', error);
    throw error;
  }
}

// Create insight
export async function createInsight(data: InsightData) {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      INSIGHTS_COLLECTION_ID,
      ID.unique(),
      {
        reportId: data.reportId,
        userId: data.userId,
        userEmail: data.userEmail,
        userPlan: data.userPlan,
        aiSummary: data.aiSummary || '',
        aiKeyObservations: data.aiKeyObservations || [],
        aiRecommendedActions: data.aiRecommendedActions || [],
        aiConfidence: data.aiConfidence || 0,
        aiPatterns: data.aiPatterns || '',
        aiStatus: data.aiStatus || 'pending',
        humanReviewed: data.humanReviewed || false,
        humanVerified: data.humanVerified || false,
        status: data.status,
        createdAt: new Date().toISOString()
      }
    );
    return response;
  } catch (error) {
    console.error('Error creating insight:', error);
    throw error;
  }
}

// Get pending insights for admin review
export async function getPendingInsights(): Promise<Models.DocumentList<Models.Document>> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      INSIGHTS_COLLECTION_ID,
      [`status="pending_review"`]
    );
    return response;
  } catch (error) {
    console.error('Error fetching pending insights:', error);
    throw error;
  }
}

// Get user insights
export async function getUserInsights(userId: string): Promise<Models.DocumentList<Models.Document>> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      INSIGHTS_COLLECTION_ID,
      [`userId="${userId}"`]
    );
    return response;
  } catch (error) {
    console.error('Error fetching user insights:', error);
    throw error;
  }
}

// Update insight with human review
export async function updateInsightReview(
  insightId: string,
  reviewData: {
    humanReviewedBy: string;
    humanEnhancedSummary?: string;
    humanEnhancedObservations?: string[];
    humanEnhancedActions?: string[];
    humanVerified: boolean;
    humanFeedback?: string;
    status: 'verified' | 'delivered';
  }
) {
  try {
    const response = await databases.updateDocument(
      DATABASE_ID,
      INSIGHTS_COLLECTION_ID,
      insightId,
      {
        humanReviewed: true,
        humanReviewDate: new Date().toISOString(),
        humanReviewedBy: reviewData.humanReviewedBy,
        humanEnhancedSummary: reviewData.humanEnhancedSummary || '',
        humanEnhancedObservations: reviewData.humanEnhancedObservations || [],
        humanEnhancedActions: reviewData.humanEnhancedActions || [],
        humanVerified: reviewData.humanVerified,
        humanFeedback: reviewData.humanFeedback || '',
        status: reviewData.status
      }
    );
    return response;
  } catch (error) {
    console.error('Error updating insight review:', error);
    throw error;
  }
}

// Update insight status
export async function updateInsightStatus(
  insightId: string,
  status: 'pending_ai' | 'pending_review' | 'verified' | 'delivered'
) {
  try {
    const response = await databases.updateDocument(
      DATABASE_ID,
      INSIGHTS_COLLECTION_ID,
      insightId,
      { status }
    );
    return response;
  } catch (error) {
    console.error('Error updating insight status:', error);
    throw error;
  }
}

// Update report status
export async function updateReportStatus(
  reportId: string,
  status: 'pending' | 'ai_processed' | 'human_reviewed' | 'delivered'
) {
  try {
    const response = await databases.updateDocument(
      DATABASE_ID,
      REPORTS_COLLECTION_ID,
      reportId,
      { status }
    );
    return response;
  } catch (error) {
    console.error('Error updating report status:', error);
    throw error;
  }
}
