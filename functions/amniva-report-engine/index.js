// Amniva Info Engine - Internal AI-powered data analysis and insight generation
// Transforms user-submitted data into structured insights using pattern recognition

import { Client, Databases, Storage } from 'node-appwrite';

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_PROJECT_ID || 'amniva-ri03')
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'amniva-db03';

/**
 * AI-powered data analysis and insight generation engine
 */
class InfoEngine {
  constructor() {
    this.modelVersion = 'v1.5.0';
    this.confidenceThreshold = 0.70;
    
    // Known credible sources database for business intelligence
    this.credibleSources = {
      financial: {
        'Bloomberg': {
          domain: 'bloomberg.com',
          credibility: 0.98,
          expertise: ['markets', 'finance', 'economics', 'commodities'],
          verification_mechanism: 'market_data'
        },
        'Wall Street Journal': {
          domain: 'wsj.com',
          credibility: 0.96,
          expertise: ['business', 'finance', 'markets', 'economics'],
          verification_mechanism: 'institutional_analysis'
        },
        'Financial Times': {
          domain: 'ft.com',
          credibility: 0.95,
          expertise: ['global finance', 'markets', 'trade', 'economics'],
          verification_mechanism: 'institutional_analysis'
        },
        'Reuters': {
          domain: 'reuters.com',
          credibility: 0.94,
          expertise: ['markets', 'commodities', 'business', 'finance'],
          verification_mechanism: 'market_data'
        }
      },
      research: {
        'World Bank': {
          domain: 'worldbank.org',
          credibility: 0.97,
          expertise: ['development economics', 'global trade', 'investment'],
          verification_mechanism: 'research_publication'
        },
        'IMF': {
          domain: 'imf.org',
          credibility: 0.96,
          expertise: ['monetary policy', 'global economics', 'fiscal policy'],
          verification_mechanism: 'institutional_report'
        },
        'McKinsey': {
          domain: 'mckinsey.com',
          credibility: 0.92,
          expertise: ['strategy', 'market analysis', 'industry trends'],
          verification_mechanism: 'research_methodology'
        },
        'Deloitte': {
          domain: 'deloitte.com',
          credibility: 0.91,
          expertise: ['industry analysis', 'risk assessment', 'market research'],
          verification_mechanism: 'research_methodology'
        }
      },
      government: {
        'Bank of Ghana': {
          domain: 'bog.gov.gh',
          credibility: 0.95,
          expertise: ['monetary policy', 'banking', 'finance', 'economy'],
          verification_mechanism: 'official_statement'
        },
        'SEC': {
          domain: 'sec.gov',
          credibility: 0.98,
          expertise: ['securities', 'regulations', 'filings', 'compliance'],
          verification_mechanism: 'regulatory_filing'
        },
        'Federal Reserve': {
          domain: 'federalreserve.gov',
          credibility: 0.98,
          expertise: ['monetary policy', 'banking', 'interest rates'],
          verification_mechanism: 'official_statement'
        }
      },
      data: {
        'Statista': {
          domain: 'statista.com',
          credibility: 0.89,
          expertise: ['statistics', 'market data', 'industry metrics'],
          verification_mechanism: 'official_data'
        },
        'Trading Economics': {
          domain: 'tradingeconomics.com',
          credibility: 0.88,
          expertise: ['economic indicators', 'forecasts', 'market data'],
          verification_mechanism: 'official_data'
        }
      }
    };
    
    // Content patterns for different analysis mechanisms
    this.analysisPatterns = {
      official_statement: {
        indicators: ['according to', 'statement from', 'announced by', 'confirmed by'],
        confidence_boost: 0.2
      },
      official_data: {
        indicators: ['statistics show', 'data indicates', 'figures reveal', 'quarterly results'],
        confidence_boost: 0.25
      },
      institutional_analysis: {
        indicators: ['analysis shows', 'report indicates', 'assessment reveals'],
        confidence_boost: 0.18
      },
      market_data: {
        indicators: ['trading data', 'market figures', 'price movements', 'exchange rates', 'yield curve'],
        confidence_boost: 0.22
      },
      research_publication: {
        indicators: ['study shows', 'research indicates', 'analysis reveals', 'findings suggest'],
        confidence_boost: 0.18
      },
      research_methodology: {
        indicators: ['methodology', 'peer-reviewed', 'systematic analysis', 'data-driven'],
        confidence_boost: 0.15
      },
      regulatory_filing: {
        indicators: ['SEC filing', 'regulatory disclosure', 'compliance report', 'annual report'],
        confidence_boost: 0.2
      },
      institutional_report: {
        indicators: ['institutional report', 'quarterly outlook', 'annual review', 'market commentary'],
        confidence_boost: 0.17
      }
    };
  }
  
  /**
   * Extract content features for attribution analysis
   */
  extractContentFeatures(content) {
    const text = content.toLowerCase();
    
    return {
      content_length: content.length,
      word_count: text.split(/\s+/).length,
      sentence_count: text.split(/[.!?]+/).filter(s => s.trim().length > 0).length,
      has_numbers: /\d+/.test(text),
      has_percentages: /%/.test(text),
      has_dates: /\b\d{1,2}\/\d{1,2}\/\d{4}\b|\b\d{4}\b/.test(text),
      has_quotes: /"[^"]*"/.test(content),
      has_attributions: /according to|says|stated|announced|confirmed/i.test(content),
      has_statistics: /\d+%|\d+\.\d+%|\d+ percent/i.test(content),
      formal_language: this.detectFormalLanguage(text),
      urgency_indicators: this.detectUrgencyIndicators(text),
      source_mentions: this.extractSourceMentions(content)
    };
  }
  
  /**
   * Detect formal language patterns
   */
  detectFormalLanguage(text) {
    const formalIndicators = [
      'pursuant to', 'in accordance with', 'hereby', 'whereas',
      'therefore', 'furthermore', 'consequently', 'respectively',
      'notwithstanding', 'aforementioned'
    ];
    
    const matches = formalIndicators.filter(indicator => 
      text.includes(indicator)
    ).length;
    
    return matches / formalIndicators.length;
  }
  
  /**
   * Detect urgency indicators
   */
  detectUrgencyIndicators(text) {
    const urgencyWords = [
      'urgent', 'immediate', 'breaking', 'emergency', 'alert',
      'critical', 'important', 'latest', 'just in', 'developing'
    ];
    
    const matches = urgencyWords.filter(word => 
      text.includes(word)
    ).length;
    
    return matches / urgencyWords.length;
  }
  
  /**
   * Extract potential source mentions from content
   */
  extractSourceMentions(content) {
    const mentions = [];
    
    // Look for direct source mentions
    const sourcePatterns = [
      /according to ([^,\.]+)/gi,
      /([^,\.]+) announced/gi,
      /([^,\.]+) stated/gi,
      /([^,\.]+) confirmed/gi,
      /([^,\.]+) revealed/gi,
      /source: ([^,\.]+)/gi
    ];
    
    sourcePatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        mentions.push(match[1].trim());
      }
    });
    
    return mentions;
  }
  
  /**
   * Analyze content similarity with known sources
   */
  analyzeSourceSimilarity(content, features) {
    const similarities = [];
    
    // Check all credible sources
    Object.entries(this.credibleSources).forEach(([category, sources]) => {
      Object.entries(sources).forEach(([sourceName, sourceData]) => {
        const similarity = this.calculateContentSimilarity(
          content, 
          features, 
          sourceName, 
          sourceData
        );
        
        if (similarity.score > 0.3) { // Only include meaningful similarities
          similarities.push({
            source: sourceName,
            category,
            similarity_score: similarity.score,
            matching_factors: similarity.factors,
            credibility: sourceData.credibility,
            verification_mechanism: sourceData.verification_mechanism
          });
        }
      });
    });
    
    return similarities.sort((a, b) => b.similarity_score - a.similarity_score);
  }
  
  /**
   * Calculate similarity between content and known source
   */
  calculateContentSimilarity(content, features, sourceName, sourceData) {
    let score = 0;
    const factors = [];
    const contentLower = content.toLowerCase();
    
    // Check for direct source mention
    if (contentLower.includes(sourceName.toLowerCase())) {
      score += 0.4;
      factors.push('direct_mention');
    }
    
    // Check for domain mention
    if (contentLower.includes(sourceData.domain)) {
      score += 0.3;
      factors.push('domain_reference');
    }
    
    // Check expertise match
    const expertiseMatch = sourceData.expertise.filter(topic => 
      contentLower.includes(topic)
    ).length;
    
    if (expertiseMatch > 0) {
      score += (expertiseMatch / sourceData.expertise.length) * 0.25;
      factors.push(`expertise_match_${expertiseMatch}`);
    }
    
    // Check verification mechanism patterns
    const mechanismPatterns = this.verificationPatterns[sourceData.verification_mechanism];
    if (mechanismPatterns) {
      const patternMatch = mechanismPatterns.indicators.filter(indicator =>
        contentLower.includes(indicator)
      ).length;
      
      if (patternMatch > 0) {
        score += mechanismPatterns.confidence_boost;
        factors.push('verification_pattern_match');
      }
    }
    
    // Content type matching
    if (features.has_statistics && sourceData.expertise.includes('statistics')) {
      score += 0.1;
      factors.push('statistical_content');
    }
    
    if (features.formal_language > 0.3 && sourceData.verification_mechanism === 'official_statement') {
      score += 0.1;
      factors.push('formal_language');
    }
    
    return {
      score: Math.min(1.0, score),
      factors
    };
  }
  
  /**
   * Determine verification status based on analysis
   */
  determineVerificationStatus(similarities, features) {
    if (similarities.length === 0) {
      return {
        status: 'unverified',
        confidence: 0.3,
        reason: 'No matching credible sources found'
      };
    }
    
    const topSimilarity = similarities[0];
    
    if (topSimilarity.similarity_score > 0.8 && topSimilarity.credibility > 0.9) {
      return {
        status: 'verified',
        confidence: topSimilarity.similarity_score * topSimilarity.credibility,
        reason: `High similarity with credible source: ${topSimilarity.source}`
      };
    }
    
    if (topSimilarity.similarity_score > 0.6 && topSimilarity.credibility > 0.8) {
      return {
        status: 'verified',
        confidence: topSimilarity.similarity_score * topSimilarity.credibility * 0.9,
        reason: `Moderate similarity with credible source: ${topSimilarity.source}`
      };
    }
    
    if (similarities.length > 1 && similarities[0].similarity_score > 0.5) {
      return {
        status: 'verified',
        confidence: topSimilarity.similarity_score * topSimilarity.credibility * 0.8,
        reason: `Multiple source matches found`
      };
    }
    
    return {
      status: 'disputed',
      confidence: 0.5,
      reason: 'Low similarity with known sources, requires manual verification'
    };
  }
  
  /**
   * Extract context and background information
   */
  extractContext(content, similarities) {
    let context = '';
    
    if (similarities.length > 0) {
      const primarySource = similarities[0];
      context = `Content appears to originate from or relate to ${primarySource.source}, ` +
               `a ${primarySource.category} source with ${Math.round(primarySource.credibility * 100)}% credibility rating. `;
      
      if (primarySource.verification_mechanism) {
        context += `Verification method: ${primarySource.verification_mechanism.replace('_', ' ')}. `;
      }
      
      if (similarities.length > 1) {
        context += `Additional sources with similar content patterns detected: ` +
                  `${similarities.slice(1, 3).map(s => s.source).join(', ')}.`;
      }
    } else {
      context = 'No matching patterns found with known credible sources. ' +
               'Content may be original reporting, opinion, or from unverified sources.';
    }
    
    return context;
  }
  
  /**
   * Main report attribution analysis
   */
  async analyzeAttribution(inputData) {
    const startTime = Date.now();
    
    try {
      const { content, metadata = {}, sources = [], requestId } = inputData;
      
      if (!content || typeof content !== 'string') {
        throw new Error('Content is required and must be a string');
      }
      
      // Extract content features
      const features = this.extractContentFeatures(content);
      
      // Analyze source similarity
      const similarities = this.analyzeSourceSimilarity(content, features);
      
      // Determine verification status
      const verification = this.determineVerificationStatus(similarities, features);
      
      // Extract context
      const context = this.extractContext(content, similarities);
      
      // Determine primary source and mechanism
      const primarySource = similarities.length > 0 ? similarities[0].source : 'Unknown';
      const mechanism = similarities.length > 0 ? 
        similarities[0].verification_mechanism.replace('_', ' ') : 
        'manual_verification_required';
      
      // Get related sources
      const relatedSources = similarities.slice(1, 4).map(s => s.source);
      
      // Calculate overall confidence
      const confidence = verification.confidence;
      
      const processingTime = Date.now() - startTime;
      
      return {
        success: true,
        confidence,
        data: {
          primary_source: primarySource,
          attribution_confidence: confidence,
          mechanism,
          related_sources: relatedSources,
          context,
          verification_status: verification.status,
          analysis_details: {
            source_matches: similarities.length,
            content_features: Object.keys(features).length,
            verification_reason: verification.reason
          }
        },
        metadata: {
          processing_time_ms: processingTime,
          model_version: this.modelVersion,
          features_analyzed: features,
          top_similarities: similarities.slice(0, 3)
        }
      };
      
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error('Report engine error:', error);
      
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
    const inputData = req.body;
    
    if (!inputData.content) {
      return res.status(400).json({
        success: false,
        error: 'Content is required for attribution analysis'
      });
    }
    
    const engine = new ReportEngine();
    const result = await engine.analyzeAttribution(inputData);
    
    // Add request tracking
    result.request_id = inputData.requestId;
    result.timestamp = new Date().toISOString();
    result.engine_type = 'report';
    result.source = 'internal';
    
    return res.status(200).json(result);
    
  } catch (error) {
    console.error('Report handler error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}