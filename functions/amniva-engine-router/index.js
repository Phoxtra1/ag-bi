// Amniva Engine Router - Main routing function for AI engines
// Handles toggle-based routing between internal AI engines and external APIs

import { Client, Databases, Functions } from 'node-appwrite';

// Initialize Appwrite
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_PROJECT_ID || 'amniva-ri03')
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const functions = new Functions(client);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'amniva-db03';
const TOGGLES_COLLECTION = 'engine-toggles';
const LOGS_COLLECTION = 'engine-logs';

// Engine function mappings
const ENGINE_FUNCTIONS = {
  verify: 'amniva-verify-engine',
  report: 'amniva-report-engine', 
  prediction: 'amniva-prediction-engine',
  trending: 'amniva-trending-engine'
};

// External API endpoints
const EXTERNAL_APIS = {
  verify: process.env.VERIFY_API_URL || 'https://api.external-verify.com/v1/verify',
  report: process.env.REPORT_API_URL || 'https://api.external-report.com/v1/analyze',
  prediction: process.env.PREDICTION_API_URL || 'https://api.external-predict.com/v1/predict',
  trending: process.env.TRENDING_API_URL || 'https://api.external-trends.com/v1/trends'
};

/**
 * Get engine toggle configuration
 */
async function getEngineToggle(engineType) {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      TOGGLES_COLLECTION,
      [`equal("engineType", "${engineType}")`]
    );
    
    if (result.documents.length === 0) {
      // Create default toggle if doesn't exist
      return await databases.createDocument(
        DATABASE_ID,
        TOGGLES_COLLECTION,
        'unique()',
        {
          engineType,
          mode: 'external', // Default to external
          enabled: true,
          confidence_threshold: 0.7,
          last_updated: new Date().toISOString(),
          updated_by: 'system'
        }
      );
    }
    
    return result.documents[0];
  } catch (error) {
    console.error('Error getting engine toggle:', error);
    // Fallback to external mode
    return {
      engineType,
      mode: 'external',
      enabled: true,
      confidence_threshold: 0.7
    };
  }
}

/**
 * Log engine request
 */
async function logEngineRequest(engineType, requestId, mode, confidence, processingTime, success, error = null, metadata = {}) {
  try {
    await databases.createDocument(
      DATABASE_ID,
      LOGS_COLLECTION,
      'unique()',
      {
        engine_type: engineType,
        request_id: requestId,
        mode_used: mode,
        confidence_score: confidence,
        processing_time_ms: processingTime,
        timestamp: new Date().toISOString(),
        success,
        error_message: error,
        metadata
      }
    );
  } catch (error) {
    console.error('Error logging request:', error);
  }
}

/**
 * Call internal AI engine
 */
async function callInternalEngine(engineType, requestData, requestId) {
  const startTime = Date.now();
  
  try {
    const functionId = ENGINE_FUNCTIONS[engineType];
    
    const result = await functions.createExecution(
      functionId,
      JSON.stringify({
        ...requestData,
        requestId,
        source: 'internal'
      }),
      false // sync execution
    );
    
    const processingTime = Date.now() - startTime;
    const response = JSON.parse(result.responseBody);
    
    return {
      success: true,
      data: response,
      processingTime,
      source: 'internal'
    };
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`Internal ${engineType} engine error:`, error);
    
    return {
      success: false,
      error: error.message,
      processingTime,
      source: 'internal'
    };
  }
}

/**
 * Call external API
 */
async function callExternalAPI(engineType, requestData, requestId) {
  const startTime = Date.now();
  
  try {
    const apiUrl = EXTERNAL_APIS[engineType];
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env[`${engineType.toUpperCase()}_API_KEY`] || ''}`,
        'X-Request-ID': requestId
      },
      body: JSON.stringify(requestData)
    });
    
    const processingTime = Date.now() - startTime;
    
    if (!response.ok) {
      throw new Error(`External API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      data,
      processingTime,
      source: 'external'
    };
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`External ${engineType} API error:`, error);
    
    return {
      success: false,
      error: error.message,
      processingTime,
      source: 'external'
    };
  }
}

/**
 * Merge internal and external results
 */
function mergeResults(internalResult, externalResult, weights = { internal: 0.6, external: 0.4 }) {
  if (!internalResult.success && !externalResult.success) {
    return {
      success: false,
      error: 'Both internal and external engines failed',
      data: null,
      confidence: 0
    };
  }
  
  if (!internalResult.success) {
    return {
      ...externalResult,
      source: 'external_fallback',
      confidence: externalResult.data.confidence * 0.8 // Reduce confidence for fallback
    };
  }
  
  if (!externalResult.success) {
    return {
      ...internalResult,
      source: 'internal_fallback',
      confidence: internalResult.data.confidence * 0.8
    };
  }
  
  // Merge successful results
  const mergedConfidence = (
    (internalResult.data.confidence || 0) * weights.internal +
    (externalResult.data.confidence || 0) * weights.external
  );
  
  return {
    success: true,
    data: {
      ...internalResult.data,
      merged_with_external: true,
      external_data: externalResult.data,
      confidence: mergedConfidence
    },
    confidence: mergedConfidence,
    processingTime: Math.max(internalResult.processingTime, externalResult.processingTime),
    source: 'merged'
  };
}

/**
 * Main routing function
 */
export default async function handler(req, res) {
  const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const startTime = Date.now();
  
  try {
    // Extract engine type from URL path
    const engineType = req.url.split('/').pop(); // verify, report, prediction, trending
    
    if (!ENGINE_FUNCTIONS[engineType]) {
      return res.status(400).json({
        success: false,
        error: 'Invalid engine type',
        requestId
      });
    }
    
    // Get toggle configuration
    const toggle = await getEngineToggle(engineType);
    
    if (!toggle.enabled) {
      return res.status(503).json({
        success: false,
        error: 'Engine is currently disabled',
        requestId
      });
    }
    
    const requestData = req.body;
    let result;
    
    // Route based on toggle mode
    switch (toggle.mode) {
      case 'internal':
        result = await callInternalEngine(engineType, requestData, requestId);
        break;
        
      case 'external':
        result = await callExternalAPI(engineType, requestData, requestId);
        break;
        
      case 'merge':
        const [internalResult, externalResult] = await Promise.all([
          callInternalEngine(engineType, requestData, requestId),
          callExternalAPI(engineType, requestData, requestId)
        ]);
        
        result = mergeResults(internalResult, externalResult, toggle.merge_weights);
        break;
        
      default:
        throw new Error(`Invalid toggle mode: ${toggle.mode}`);
    }
    
    const totalProcessingTime = Date.now() - startTime;
    
    // Log the request
    await logEngineRequest(
      engineType,
      requestId,
      toggle.mode,
      result.data?.confidence || 0,
      totalProcessingTime,
      result.success,
      result.error,
      {
        toggle_id: toggle.$id,
        user_agent: req.headers['user-agent'],
        source_ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
      }
    );
    
    // Format response
    const response = {
      success: result.success,
      engine_used: result.source || toggle.mode,
      confidence: result.data?.confidence || 0,
      processing_time_ms: totalProcessingTime,
      request_id: requestId,
      timestamp: new Date().toISOString(),
      data: result.data,
      metadata: {
        toggle_mode: toggle.mode,
        engine_type: engineType,
        fallback_used: result.source?.includes('fallback') || false
      }
    };
    
    if (result.error) {
      response.error = result.error;
      return res.status(500).json(response);
    }
    
    return res.status(200).json(response);
    
  } catch (error) {
    console.error('Router error:', error);
    
    const totalProcessingTime = Date.now() - startTime;
    
    // Log error
    await logEngineRequest(
      'unknown',
      requestId,
      'error',
      0,
      totalProcessingTime,
      false,
      error.message,
      { error_type: 'router_error' }
    );
    
    return res.status(500).json({
      success: false,
      error: 'Internal router error',
      request_id: requestId,
      timestamp: new Date().toISOString(),
      processing_time_ms: totalProcessingTime
    });
  }
}