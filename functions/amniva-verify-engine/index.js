// Amniva Verify Engine - Internal AI-powered content verification
// Classifies content as authentic or misleading using NLP/ML models

import { Client, Databases, Storage } from 'node-appwrite';

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_PROJECT_ID || 'amniva-ri03')
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'amniva-db03';

/**
 * AI-powered content verification engine
 * Uses NLP models to classify content authenticity
 */
class VerifyEngine {
  constructor() {
    this.modelVersion = 'v1.2.0';
    this.confidenceThreshold = 0.75;
    
    // Simulated ML model weights (in production, load from Appwrite Storage)
    this.authenticityKeywords = [
      'verified', 'confirmed', 'official', 'documented', 'evidence-based',
      'peer-reviewed', 'fact-checked', 'credible source', 'eyewitness',
      'government statement', 'press release', 'expert analysis'
    ];
    
    this.misleadingIndicators = [
      'unconfirmed', 'rumored', 'alleged', 'conspiracy', 'fake news',
      'hoax', 'misinformation', 'clickbait', 'sensational', 'biased',
      'propaganda', 'manipulation', 'out of context', 'doctored'
    ];
    
    this.riskFactors = [
      'emotional language', 'urgent claims', 'lack of sources',
      'anonymous sources', 'contradicts known facts', 'suspicious timing',
      'viral spread pattern', 'bot amplification', 'domain reputation'
    ];
  }
  
  /**
   * Extract features from content for ML processing
   */
  extractFeatures(content) {
    const text = content.toLowerCase();
    const words = text.split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    return {
      wordCount: words.length,
      sentenceCount: sentences.length,
      avgWordsPerSentence: words.length / sentences.length,
      hasLinks: /https?:\/\//.test(content),
      hasEmails: /@\w+\.\w+/.test(content),
      hasNumbers: /\d+/.test(content),
      hasCapitalization: /[A-Z]{2,}/.test(content),
      exclamationCount: (content.match(/!/g) || []).length,
      questionCount: (content.match(/\?/g) || []).length,
      authenticityScore: this.calculateAuthenticityScore(text),
      misleadingScore: this.calculateMisleadingScore(text),
      emotionalScore: this.calculateEmotionalScore(text)
    };
  }
  
  /**
   * Calculate authenticity indicators
   */
  calculateAuthenticityScore(text) {
    let score = 0;
    let matches = [];
    
    this.authenticityKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        score += 1;
        matches.push(keyword);
      }
    });
    
    return {
      score: score / this.authenticityKeywords.length,
      matches
    };
  }
  
  /**
   * Calculate misleading indicators
   */
  calculateMisleadingScore(text) {
    let score = 0;
    let matches = [];
    
    this.misleadingIndicators.forEach(indicator => {
      if (text.includes(indicator)) {
        score += 1;
        matches.push(indicator);
      }
    });
    
    return {
      score: score / this.misleadingIndicators.length,
      matches
    };
  }
  
  /**
   * Calculate emotional manipulation score
   */
  calculateEmotionalScore(text) {
    const emotionalWords = [
      'shocking', 'incredible', 'unbelievable', 'urgent', 'breaking',
      'exclusive', 'secret', 'hidden', 'exposed', 'revealed', 'betrayed'
    ];
    
    let score = 0;
    let matches = [];
    
    emotionalWords.forEach(word => {
      if (text.includes(word)) {
        score += 1;
        matches.push(word);
      }
    });
    
    return {
      score: score / emotionalWords.length,
      matches
    };
  }
  
  /**
   * Simulate source verification
   */
  async verifySourceCredibility(sources = []) {
    // Business and financial credible sources
    const credibleDomains = [
      // Global Financial & Business Sources
      'bloomberg.com', 'reuters.com', 'wsj.com', 'ft.com', 'economist.com',
      'cnbc.com', 'marketwatch.com', 'forbes.com', 'barrons.com', 'investing.com',
      // Data & Research
      'statista.com', 'worldbank.org', 'imf.org', 'wto.org', 'oecd.org',
      'tradingeconomics.com', 'fred.stlouisfed.org', 'bls.gov',
      // African Financial Sources
      'bankofghana.gov.gh', 'afdb.org', 'africanews.com',
      'nairametrics.com', 'businessday.ng', 'thebftonline.com',
      // Government & Regulatory
      'sec.gov', 'federalreserve.gov', 'ecb.europa.eu', 'bis.org',
      // Academic & Research
      'hbr.org', 'mckinsey.com', 'bcg.com', 'bain.com', 'deloitte.com',
      'pwc.com', 'ey.com', 'kpmg.com', 'accenture.com'
    ];
    
    const verifiedSources = [];
    const unknownSources = [];
    
    sources.forEach(source => {
      const domain = this.extractDomain(source);
      if (credibleDomains.includes(domain)) {
        verifiedSources.push(source);
      } else {
        unknownSources.push(source);
      }
    });
    
    return {
      verified: verifiedSources,
      unknown: unknownSources,
      credibilityScore: verifiedSources.length / (sources.length || 1)
    };
  }
  
  /**
   * Extract domain from URL
   */
  extractDomain(url) {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  }
  
  /**
   * Main verification process
   */
  async verify(content, sources = [], metadata = {}) {
    const startTime = Date.now();
    
    try {
      // Extract features
      const features = this.extractFeatures(content);
      
      // Verify sources
      const sourceVerification = await this.verifySourceCredibility(sources);
      
      // Calculate base authenticity score
      let authenticityScore = features.authenticityScore.score * 0.4 +
                             sourceVerification.credibilityScore * 0.3 +
                             (1 - features.misleadingScore.score) * 0.2 +
                             (1 - features.emotionalScore.score) * 0.1;
      
      // Apply content-specific adjustments
      if (features.hasLinks && features.hasNumbers) {
        authenticityScore += 0.1; // Factual content often has links and stats
      }
      
      if (features.exclamationCount > 3) {
        authenticityScore -= 0.1; // Excessive exclamations reduce credibility
      }
      
      if (features.avgWordsPerSentence < 5) {
        authenticityScore -= 0.05; // Very short sentences may indicate simplification
      }
      
      // Ensure score is between 0 and 1
      authenticityScore = Math.max(0, Math.min(1, authenticityScore));
      
      // Determine if content is authentic
      const isAuthentic = authenticityScore >= this.confidenceThreshold;
      
      // Compile evidence
      const evidence = [];
      if (features.authenticityScore.matches.length > 0) {
        evidence.push(`Credibility indicators: ${features.authenticityScore.matches.join(', ')}`);
      }
      if (sourceVerification.verified.length > 0) {
        evidence.push(`Verified sources: ${sourceVerification.verified.length}`);
      }
      if (features.hasLinks) {
        evidence.push('Contains reference links');
      }
      
      // Identify risk factors
      const riskFactors = [];
      if (features.misleadingScore.matches.length > 0) {
        riskFactors.push(`Misleading indicators: ${features.misleadingScore.matches.join(', ')}`);
      }
      if (features.emotionalScore.matches.length > 0) {
        riskFactors.push(`Emotional language: ${features.emotionalScore.matches.join(', ')}`);
      }
      if (sourceVerification.unknown.length > 0) {
        riskFactors.push(`Unverified sources: ${sourceVerification.unknown.length}`);
      }
      if (features.exclamationCount > 2) {
        riskFactors.push('Excessive exclamation marks');
      }
      
      const processingTime = Date.now() - startTime;
      
      return {
        success: true,
        confidence: authenticityScore,
        data: {
          is_authentic: isAuthentic,
          authenticity_score: authenticityScore,
          evidence,
          risk_factors: riskFactors,
          sources_checked: sources.length,
          processing_details: {
            word_count: features.wordCount,
            sentence_count: features.sentenceCount,
            credible_sources: sourceVerification.verified.length,
            model_version: this.modelVersion
          }
        },
        metadata: {
          processing_time_ms: processingTime,
          features_extracted: Object.keys(features).length,
          model_version: this.modelVersion
        }
      };
      
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error('Verify engine error:', error);
      
      return {
        success: false,
        confidence: 0,
        error: error.message,
        metadata: {
          processing_time_ms: processingTime,
          model_version: this.modelVersion
        }
      };
    }
  }
}

/**
 * Main function handler
 */
export default async function handler(req, res) {
  try {
    const { content, sources, metadata, requestId } = req.body;
    
    if (!content || typeof content !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Content is required and must be a string'
      });
    }
    
    const engine = new VerifyEngine();
    const result = await engine.verify(content, sources || [], metadata || {});
    
    // Add request tracking
    result.request_id = requestId;
    result.timestamp = new Date().toISOString();
    result.engine_type = 'verify';
    result.source = 'internal';
    
    return res.status(200).json(result);
    
  } catch (error) {
    console.error('Verify handler error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}