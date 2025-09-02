// Amniva Prediction Engine - Internal AI-powered predictive analytics
// Forecasts trends based on historical data and real-time inputs

import { Client, Databases, Storage } from 'node-appwrite';

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_PROJECT_ID || 'amniva-ri03')
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'amniva-db03';

/**
 * AI-powered prediction engine for trend forecasting
 */
class PredictionEngine {
  constructor() {
    this.modelVersion = 'v2.1.0';
    this.confidenceThreshold = 0.65;
    
    // Historical patterns database (simulated - in production load from Appwrite)
    this.historicalPatterns = {
      politics: {
        election_cycles: { weight: 0.3, accuracy: 0.85 },
        policy_announcements: { weight: 0.25, accuracy: 0.78 },
        public_sentiment: { weight: 0.2, accuracy: 0.72 },
        economic_indicators: { weight: 0.25, accuracy: 0.80 }
      },
      environment: {
        weather_patterns: { weight: 0.4, accuracy: 0.88 },
        seasonal_trends: { weight: 0.3, accuracy: 0.82 },
        climate_data: { weight: 0.2, accuracy: 0.75 },
        human_activity: { weight: 0.1, accuracy: 0.68 }
      },
      economy: {
        market_indicators: { weight: 0.35, accuracy: 0.83 },
        trade_patterns: { weight: 0.25, accuracy: 0.77 },
        currency_trends: { weight: 0.2, accuracy: 0.79 },
        commodity_prices: { weight: 0.2, accuracy: 0.81 }
      },
      health: {
        disease_patterns: { weight: 0.4, accuracy: 0.86 },
        vaccination_rates: { weight: 0.25, accuracy: 0.82 },
        health_policies: { weight: 0.2, accuracy: 0.74 },
        demographic_factors: { weight: 0.15, accuracy: 0.71 }
      },
      technology: {
        adoption_curves: { weight: 0.3, accuracy: 0.84 },
        innovation_cycles: { weight: 0.25, accuracy: 0.76 },
        market_disruption: { weight: 0.25, accuracy: 0.72 },
        regulatory_changes: { weight: 0.2, accuracy: 0.78 }
      }
    };
    
    // Regional factors for Ghana/Africa-specific predictions
    this.regionalFactors = {
      ghana: {
        political_stability: 0.82,
        economic_growth: 0.75,
        infrastructure_development: 0.68,
        digital_adoption: 0.71,
        agricultural_dependency: 0.85
      },
      africa: {
        demographic_dividend: 0.88,
        urbanization_rate: 0.79,
        resource_economy: 0.83,
        climate_vulnerability: 0.77,
        mobile_leapfrogging: 0.85
      }
    };
  }
  
  /**
   * Analyze input data and extract prediction features
   */
  extractPredictionFeatures(inputData) {
    const {
      topic,
      category,
      timeframe,
      historical_data = [],
      current_indicators = {},
      region = 'ghana'
    } = inputData;
    
    // Time series analysis
    const timeSeriesFeatures = this.analyzeTimeSeries(historical_data);
    
    // Trend detection
    const trendFeatures = this.detectTrends(historical_data, current_indicators);
    
    // Seasonal patterns
    const seasonalFeatures = this.analyzeSeasonality(historical_data, timeframe);
    
    // Regional context
    const regionalContext = this.regionalFactors[region] || this.regionalFactors.ghana;
    
    return {
      topic,
      category: category || this.categorizeTopics(topic),
      timeframe,
      region,
      time_series: timeSeriesFeatures,
      trends: trendFeatures,
      seasonal: seasonalFeatures,
      regional_context: regionalContext,
      data_quality: this.assessDataQuality(historical_data, current_indicators)
    };
  }
  
  /**
   * Categorize topics automatically
   */
  categorizeTopics(topic) {
    const topicLower = topic.toLowerCase();
    
    if (topicLower.includes('election') || topicLower.includes('government') || topicLower.includes('policy')) {
      return 'politics';
    }
    if (topicLower.includes('weather') || topicLower.includes('climate') || topicLower.includes('environment')) {
      return 'environment';
    }
    if (topicLower.includes('economy') || topicLower.includes('market') || topicLower.includes('financial')) {
      return 'economy';
    }
    if (topicLower.includes('health') || topicLower.includes('disease') || topicLower.includes('medical')) {
      return 'health';
    }
    if (topicLower.includes('technology') || topicLower.includes('digital') || topicLower.includes('innovation')) {
      return 'technology';
    }
    
    return 'general';
  }
  
  /**
   * Analyze time series data
   */
  analyzeTimeSeries(data) {
    if (!data || data.length < 2) {
      return { trend: 'insufficient_data', volatility: 0, momentum: 0 };
    }
    
    // Calculate trend
    const values = data.map(d => typeof d === 'object' ? d.value : d);
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    const trendDirection = secondAvg > firstAvg ? 'increasing' : 
                          secondAvg < firstAvg ? 'decreasing' : 'stable';
    
    // Calculate volatility
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const volatility = Math.sqrt(variance) / mean;
    
    // Calculate momentum
    const momentum = (secondAvg - firstAvg) / firstAvg;
    
    return {
      trend: trendDirection,
      volatility: Math.min(1, volatility),
      momentum: Math.max(-1, Math.min(1, momentum)),
      data_points: values.length
    };
  }
  
  /**
   * Detect current trends
   */
  detectTrends(historical_data, current_indicators) {
    const trends = {
      short_term: 'stable',
      medium_term: 'stable', 
      long_term: 'stable',
      confidence: 0.5
    };
    
    // Analyze current indicators
    if (current_indicators.growth_rate) {
      if (current_indicators.growth_rate > 0.05) {
        trends.short_term = 'increasing';
        trends.confidence += 0.2;
      } else if (current_indicators.growth_rate < -0.05) {
        trends.short_term = 'decreasing';
        trends.confidence += 0.2;
      }
    }
    
    if (current_indicators.sentiment_score) {
      if (current_indicators.sentiment_score > 0.7) {
        trends.medium_term = 'positive';
        trends.confidence += 0.1;
      } else if (current_indicators.sentiment_score < 0.3) {
        trends.medium_term = 'negative';
        trends.confidence += 0.1;
      }
    }
    
    return trends;
  }
  
  /**
   * Analyze seasonal patterns
   */
  analyzeSeasonality(historical_data, timeframe) {
    const currentMonth = new Date().getMonth();
    const currentQuarter = Math.floor(currentMonth / 3) + 1;
    
    // Ghana-specific seasonal factors
    const seasonalFactors = {
      1: { rainfall: 'dry', agriculture: 'harvest', economy: 'strong' }, // Q1
      2: { rainfall: 'moderate', agriculture: 'planting', economy: 'growing' }, // Q2
      3: { rainfall: 'heavy', agriculture: 'growing', economy: 'moderate' }, // Q3
      4: { rainfall: 'moderate', agriculture: 'harvest', economy: 'strong' } // Q4
    };
    
    return {
      current_quarter: currentQuarter,
      seasonal_factor: seasonalFactors[currentQuarter],
      expected_pattern: this.getSeasonalExpectation(timeframe, currentQuarter)
    };
  }
  
  /**
   * Get seasonal expectations
   */
  getSeasonalExpectation(timeframe, quarter) {
    if (timeframe.includes('agriculture') || timeframe.includes('farming')) {
      return quarter === 1 || quarter === 4 ? 'high_activity' : 'moderate_activity';
    }
    if (timeframe.includes('economy') || timeframe.includes('business')) {
      return quarter === 4 || quarter === 1 ? 'peak_season' : 'steady_growth';
    }
    if (timeframe.includes('weather') || timeframe.includes('climate')) {
      return quarter === 3 ? 'rainy_season' : quarter === 1 ? 'dry_season' : 'transition';
    }
    
    return 'normal_variation';
  }
  
  /**
   * Assess data quality
   */
  assessDataQuality(historical_data, current_indicators) {
    let quality_score = 0;
    const factors = [];
    
    if (historical_data && historical_data.length >= 12) {
      quality_score += 0.4;
      factors.push('sufficient_historical_data');
    } else if (historical_data && historical_data.length >= 6) {
      quality_score += 0.2;
      factors.push('moderate_historical_data');
    }
    
    if (current_indicators && Object.keys(current_indicators).length >= 3) {
      quality_score += 0.3;
      factors.push('multiple_indicators');
    }
    
    if (historical_data && this.isDataConsistent(historical_data)) {
      quality_score += 0.3;
      factors.push('consistent_data');
    }
    
    return {
      score: Math.min(1, quality_score),
      factors
    };
  }
  
  /**
   * Check data consistency
   */
  isDataConsistent(data) {
    if (!data || data.length < 3) return false;
    
    const values = data.map(d => typeof d === 'object' ? d.value : d);
    const outliers = values.filter(v => {
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const std = Math.sqrt(values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length);
      return Math.abs(v - mean) > 2 * std;
    });
    
    return outliers.length / values.length < 0.2; // Less than 20% outliers
  }
  
  /**
   * Generate prediction
   */
  async predict(inputData) {
    const startTime = Date.now();
    
    try {
      // Extract features
      const features = this.extractPredictionFeatures(inputData);
      
      // Get category-specific patterns
      const categoryPatterns = this.historicalPatterns[features.category] || this.historicalPatterns.general;
      
      // Calculate base prediction probability
      let baseProbability = 0.5;
      let confidence = 0.5;
      let keyFactors = [];
      
      // Apply pattern weights
      if (categoryPatterns) {
        Object.entries(categoryPatterns).forEach(([factor, config]) => {
          const factorInfluence = this.calculateFactorInfluence(factor, features);
          baseProbability += factorInfluence * config.weight;
          confidence += config.accuracy * 0.1;
          
          if (Math.abs(factorInfluence) > 0.1) {
            keyFactors.push(`${factor}: ${factorInfluence > 0 ? 'positive' : 'negative'} influence`);
          }
        });
      }
      
      // Apply regional context
      const regionalMultiplier = features.regional_context[features.category] || 0.8;
      baseProbability *= regionalMultiplier;
      
      // Apply data quality adjustment
      confidence *= features.data_quality.score;
      
      // Ensure values are in valid range
      baseProbability = Math.max(0.05, Math.min(0.95, baseProbability));
      confidence = Math.max(0.1, Math.min(1.0, confidence));
      
      // Generate uncertainty range
      const uncertaintyRange = {
        min: Math.max(0, baseProbability - (1 - confidence) * 0.3),
        max: Math.min(1, baseProbability + (1 - confidence) * 0.3)
      };
      
      // Create prediction text
      const predictionText = this.generatePredictionText(features, baseProbability);
      
      // Calculate historical accuracy for this type of prediction
      const historicalAccuracy = categoryPatterns ? 
        Object.values(categoryPatterns).reduce((acc, config) => acc + config.accuracy, 0) / Object.keys(categoryPatterns).length :
        0.75;
      
      const processingTime = Date.now() - startTime;
      
      return {
        success: true,
        confidence,
        data: {
          prediction: predictionText,
          probability: baseProbability,
          forecast_horizon: inputData.timeframe || '30 days',
          key_factors: keyFactors,
          uncertainty_range: uncertaintyRange,
          historical_accuracy: historicalAccuracy,
          regional_context: features.region,
          data_quality_score: features.data_quality.score
        },
        metadata: {
          processing_time_ms: processingTime,
          model_version: this.modelVersion,
          features_analyzed: Object.keys(features).length,
          category: features.category
        }
      };
      
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error('Prediction engine error:', error);
      
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
  
  /**
   * Calculate factor influence on prediction
   */
  calculateFactorInfluence(factor, features) {
    switch (factor) {
      case 'election_cycles':
        return features.trends.short_term === 'increasing' ? 0.2 : -0.1;
      case 'weather_patterns':
        return features.seasonal.seasonal_factor.rainfall === 'heavy' ? 0.15 : 0;
      case 'market_indicators':
        return features.time_series.momentum > 0 ? 0.25 : -0.2;
      case 'public_sentiment':
        return features.trends.medium_term === 'positive' ? 0.3 : -0.25;
      default:
        return (Math.random() - 0.5) * 0.2; // Small random influence for unknown factors
    }
  }
  
  /**
   * Generate human-readable prediction text
   */
  generatePredictionText(features, probability) {
    const intensity = probability > 0.8 ? 'highly likely' :
                     probability > 0.6 ? 'likely' :
                     probability > 0.4 ? 'moderately likely' :
                     probability > 0.2 ? 'unlikely' : 'highly unlikely';
    
    const timeContext = features.seasonal.current_quarter === 4 ? 'end of year' :
                       features.seasonal.current_quarter === 1 ? 'beginning of year' :
                       features.seasonal.current_quarter === 2 ? 'mid-year' : 'third quarter';
    
    return `Based on current trends and historical patterns, ${features.topic} is ${intensity} to occur within the specified timeframe. ` +
           `Regional factors in ${features.region} and ${timeContext} seasonal patterns support this forecast.`;
  }
}

/**
 * Main function handler
 */
export default async function handler(req, res) {
  try {
    const inputData = req.body;
    const { requestId } = inputData;
    
    if (!inputData.topic) {
      return res.status(400).json({
        success: false,
        error: 'Topic is required for prediction'
      });
    }
    
    const engine = new PredictionEngine();
    const result = await engine.predict(inputData);
    
    // Add request tracking
    result.request_id = requestId;
    result.timestamp = new Date().toISOString();
    result.engine_type = 'prediction';
    result.source = 'internal';
    
    return res.status(200).json(result);
    
  } catch (error) {
    console.error('Prediction handler error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}