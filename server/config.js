const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Debug environment variables
console.log('🔍 Environment Variables Debug:');
console.log('AZURE_DEVOPS_PAT length:', process.env.AZURE_DEVOPS_PAT ? process.env.AZURE_DEVOPS_PAT.length : 'undefined');
console.log('AZURE_DEVOPS_ORG:', process.env.AZURE_DEVOPS_ORG);
console.log('AZURE_DEVOPS_API_VERSION:', process.env.AZURE_DEVOPS_API_VERSION);
console.log('AZURE_DEVOPS_BASE_URL:', process.env.AZURE_DEVOPS_BASE_URL);

module.exports = {
  azureDevOps: {
    pat: process.env.AZURE_DEVOPS_PAT,
    organization: process.env.AZURE_DEVOPS_ORG || 'ThiqahDev',
    apiVersion: process.env.AZURE_DEVOPS_API_VERSION || '7.1',
    baseUrl: process.env.AZURE_DEVOPS_BASE_URL || 'https://dev.azure.com'
  },
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY || '',
    baseUrl: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com'
  },
  server: {
    port: process.env.PORT || 8000
  }
};
