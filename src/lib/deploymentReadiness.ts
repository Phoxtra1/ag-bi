
import { account, databases, storage, functions, testConnection } from './appwrite';
import { APPWRITE_CONFIG, COLLECTIONS, BUCKETS, FUNCTIONS as FUNC_IDS } from './config';

export interface DeploymentCheck {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  critical: boolean;
}

export const performDeploymentChecks = async (): Promise<DeploymentCheck[]> => {
  const checks: DeploymentCheck[] = [];

  // 1. Appwrite Connection
  try {
    const connected = await testConnection();
    checks.push({
      name: 'Appwrite Connection',
      status: connected ? 'pass' : 'fail',
      message: connected ? 'Successfully connected to Appwrite' : 'Failed to connect to Appwrite',
      critical: true
    });
  } catch (error) {
    checks.push({
      name: 'Appwrite Connection',
      status: 'fail',
      message: 'Connection test failed',
      critical: true
    });
  }

  // 2. Environment Variables
  const envVars = ['VITE_APPWRITE_ENDPOINT', 'VITE_APPWRITE_PROJECT_ID', 'VITE_APPWRITE_DATABASE_ID'];
  const missingVars = envVars.filter(varName => !import.meta.env[varName]);
  
  checks.push({
    name: 'Environment Variables',
    status: missingVars.length === 0 ? 'pass' : 'warning',
    message: missingVars.length === 0 
      ? 'All environment variables configured' 
      : `Missing: ${missingVars.join(', ')}`,
    critical: true
  });

  // 3. Database Collections
  try {
    for (const [name, id] of Object.entries(COLLECTIONS)) {
      try {
        await databases.listDocuments(APPWRITE_CONFIG.databaseId, id);
        checks.push({
          name: `Collection: ${name}`,
          status: 'pass',
          message: 'Collection accessible',
          critical: false
        });
      } catch (error) {
        checks.push({
          name: `Collection: ${name}`,
          status: 'fail',
          message: 'Collection not accessible',
          critical: true
        });
      }
    }
  } catch (error) {
    checks.push({
      name: 'Database Collections',
      status: 'fail',
      message: 'Unable to test collections',
      critical: true
    });
  }

  // 4. Storage Buckets
  try {
    for (const [name, id] of Object.entries(BUCKETS)) {
      try {
        await storage.listFiles(id);
        checks.push({
          name: `Bucket: ${name}`,
          status: 'pass',
          message: 'Bucket accessible',
          critical: false
        });
      } catch (error) {
        checks.push({
          name: `Bucket: ${name}`,
          status: 'fail',
          message: 'Bucket not accessible',
          critical: true
        });
      }
    }
  } catch (error) {
    checks.push({
      name: 'Storage Buckets',
      status: 'fail',
      message: 'Unable to test buckets',
      critical: true
    });
  }

  // 5. Functions
  try {
    const functionsList = await functions.list();
    for (const [name, id] of Object.entries(FUNC_IDS)) {
      const functionExists = functionsList.functions.some((func: any) => func.$id === id);
      checks.push({
        name: `Function: ${name}`,
        status: functionExists ? 'pass' : 'warning',
        message: functionExists ? 'Function accessible' : 'Function not found (may not be deployed)',
        critical: false
      });
    }
  } catch (error) {
    checks.push({
      name: 'Functions',
      status: 'warning',
      message: 'Unable to test functions',
      critical: false
    });
  }

  return checks;
};

export const getDeploymentStatus = (checks: DeploymentCheck[]) => {
  const criticalFails = checks.filter(c => c.critical && c.status === 'fail');
  const warnings = checks.filter(c => c.status === 'warning');
  
  if (criticalFails.length > 0) {
    return { 
      status: 'not-ready', 
      message: `${criticalFails.length} critical issues must be resolved`,
      color: 'red'
    };
  }
  
  if (warnings.length > 0) {
    return { 
      status: 'ready-with-warnings', 
      message: `Ready to deploy with ${warnings.length} warnings`,
      color: 'yellow'
    };
  }
  
  return { 
    status: 'ready', 
    message: 'All systems ready for deployment',
    color: 'green'
  };
};
