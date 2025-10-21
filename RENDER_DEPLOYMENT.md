# Render Deployment Guide

## Overview
This guide explains how to deploy the Retrospective AI application to Render.

## Prerequisites
- GitHub repository with your code
- Render account (https://render.com)
- Azure DevOps Personal Access Token

## Deployment Steps

### Option 1: Using render.yaml (Recommended)

1. **Connect Your Repository**
   - Log in to Render Dashboard
   - Click "New +" and select "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file

2. **Set Environment Variables**
   - In the Render Dashboard, go to your web service
   - Navigate to "Environment" section
   - Add the following **secret** environment variable:
     - `AZURE_DEVOPS_PAT` = Your Azure DevOps Personal Access Token
   
   The other variables are already configured in render.yaml:
   - `AZURE_DEVOPS_ORG` = ThiqahDev
   - `AZURE_DEVOPS_API_VERSION` = 7.1
   - `AZURE_DEVOPS_BASE_URL` = https://dev.azure.com
   - `PORT` = 8000

3. **Deploy**
   - Click "Apply" or "Deploy"
   - Render will build and deploy your application

### Option 2: Manual Setup

1. **Create a New Web Service**
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository
   - Select the branch (e.g., `feature/initial-upload` or `main`)

2. **Configure Build Settings**
   - **Name**: retrospective-ai-backend
   - **Environment**: Node
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Root Directory**: Leave blank (uses repo root)

3. **Set Environment Variables**
   Add these in the Environment section:
   - `NODE_ENV` = production
   - `AZURE_DEVOPS_PAT` = [Your PAT] (Keep this secret!)
   - `AZURE_DEVOPS_ORG` = ThiqahDev
   - `AZURE_DEVOPS_API_VERSION` = 7.1
   - `AZURE_DEVOPS_BASE_URL` = https://dev.azure.com
   - `PORT` = 8000

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically deploy

## Important Notes

### Security
- **Never commit** your Azure DevOps PAT to GitHub
- Always use environment variables for sensitive data
- The `AZURE_DEVOPS_PAT` should be marked as "Secret" in Render

### Build Process
The build process will:
1. Install server dependencies (`npm install` in the server directory)
2. Start the server with `npm start`

### Accessing Your Application
After deployment:
- Your backend API will be available at: `https://your-app-name.onrender.com`
- Health check: `https://your-app-name.onrender.com/api/health`
- Projects endpoint: `https://your-app-name.onrender.com/api/projects`

## Troubleshooting

### Module Not Found Errors
If you see "Cannot find module 'express'" or similar errors:
1. Ensure the build command includes `cd server && npm install`
2. Check that `server/package.json` has all required dependencies
3. Redeploy the service

### Environment Variables Not Loading
1. Verify all environment variables are set in Render Dashboard
2. Make sure `dotenv` is listed in `server/package.json` dependencies
3. Check that `server/config.js` loads environment variables correctly

### API Connection Issues
1. Verify your Azure DevOps PAT is valid and not expired
2. Check that the PAT has proper permissions (Read access to projects)
3. Confirm the organization name is correct

## Updating Your Deployment

To deploy updates:
1. Push changes to your GitHub repository
2. Render will automatically detect and deploy changes (if auto-deploy is enabled)
3. Or manually trigger a deploy from the Render Dashboard

## Frontend Deployment (Optional)

To deploy the React frontend separately:
1. Uncomment the static site section in `render.yaml`
2. Create a new Static Site in Render
3. Set build command: `cd client && npm install && npm run build`
4. Set publish directory: `client/build`
5. Add environment variable: `REACT_APP_API_URL` pointing to your backend URL

## Support

For Render-specific issues, visit:
- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com

