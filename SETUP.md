# Setup Instructions for Retrospective AI

## 🔐 API Keys Configuration

This application requires two API keys to function properly. Follow these steps to configure them securely:

### 1. Azure DevOps Personal Access Token (PAT)

1. Go to your Azure DevOps organization: `https://dev.azure.com/[your-org]/_usersSettings/tokens`
2. Create a new Personal Access Token with the following scopes:
   - **Code (read)**
   - **Work Items (read)**
   - **Project and Team (read)**
3. Copy the generated token

### 2. DeepSeek API Key

1. Visit the DeepSeek platform: `https://platform.deepseek.com/`
2. Create an account and generate an API key
3. Copy the generated key

### 3. Environment Setup

You have two options to configure your API keys:

#### Option A: Using PowerShell Script (Recommended for Windows)

1. Edit the `setup-env.ps1` file
2. Replace `YOUR_AZURE_DEVOPS_PAT_HERE` with your actual Azure DevOps PAT
3. Replace `YOUR_DEEPSEEK_API_KEY_HERE` with your actual DeepSeek API key
4. Run the script in PowerShell:
   ```powershell
   .\setup-env.ps1
   ```

#### Option B: Using Environment Variables File

1. Create a `.env.local` file in the root directory
2. Add the following content (replace with your actual keys):
   ```
   AZURE_DEVOPS_PAT=your_actual_azure_devops_pat
   AZURE_DEVOPS_ORG=ThiqahDev
   AZURE_DEVOPS_API_VERSION=7.1
   AZURE_DEVOPS_BASE_URL=https://dev.azure.com
   DEEPSEEK_API_KEY=your_actual_deepseek_api_key
   DEEPSEEK_BASE_URL=https://api.deepseek.com
   PORT=5000
   ```

### 4. Security Notes

- ✅ The `.env.local` file is already in `.gitignore` and will not be committed to Git
- ✅ API keys are no longer hardcoded in the source code
- ✅ The `setup-env.ps1` script now uses placeholder values
- ✅ Never commit your actual API keys to version control

### 5. Starting the Application

After configuring your API keys, start the application:

```bash
npm run dev
```

The application will run on:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## 🔧 Troubleshooting

If you encounter issues:

1. **API Key Errors**: Ensure your API keys are correctly set in environment variables
2. **Azure DevOps Access**: Verify your PAT has the required permissions
3. **DeepSeek API**: Check if your DeepSeek API key is valid and has sufficient credits
4. **Port Conflicts**: Change the PORT in your environment variables if needed

## 📝 Current Configuration

The application is configured to work with:
- **Azure DevOps Organization**: ThiqahDev
- **API Version**: 7.1
- **DeepSeek Base URL**: https://api.deepseek.com
- **Server Port**: 5000
