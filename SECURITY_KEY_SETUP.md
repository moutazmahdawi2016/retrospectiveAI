# Security Key Setup Guide

## Overview

The application now requires a security key to be entered on the landing page before accessing the system. This provides an additional layer of security to protect your Azure DevOps data.

## How It Works

1. Users must enter the security key when they first visit the landing page
2. The key is verified against the value stored in environment variables
3. Once verified, access is granted for the session
4. The verification persists in sessionStorage (cleared when browser is closed)

## Setting the Security Key

### Method 1: Using PowerShell Setup Script (Recommended)

1. Open PowerShell in the project directory
2. Run the setup script:
   ```powershell
   .\setup-env.ps1
   ```
3. Edit the script and replace `"YOUR_SECURITY_KEY_HERE"` with your desired security key
4. Run the script again to set the environment variable

### Method 2: Using Secure Prompt Script

1. Open PowerShell in the project directory
2. Run:
   ```powershell
   .\create-env.ps1
   ```
3. When prompted, enter your security access key (choose a strong password)

### Method 3: Manual Environment Variable Setup

#### For Windows (PowerShell as Administrator):
```powershell
[Environment]::SetEnvironmentVariable('SECURITY_KEY', 'your-secure-key-here', 'User')
```

#### For Linux/Mac:
```bash
export SECURITY_KEY="your-secure-key-here"
```

#### For Production Deployment (e.g., Render, Heroku, etc.):
Add the environment variable through your platform's dashboard:
- Variable Name: `SECURITY_KEY`
- Variable Value: Your secure access key

## Security Key Requirements

- **Recommended length**: At least 8 characters
- **Recommended format**: Mix of uppercase, lowercase, numbers, and special characters
- **Example**: `Thiqah2024!SecureAccess`
- **Important**: Choose a key that is both secure and memorable for your team

## Example Secure Keys

Good examples:
- `ThiqahDev2024$Secure`
- `AzureDevOps!Retro2024`
- `MyOrg@SecureKey!2024`

Avoid:
- Common passwords like `password123`
- Simple keys like `secret` or `admin`
- Keys with personal information

## Default Configuration

If no `SECURITY_KEY` is set in the environment, the system will use the default key: `default-secret-key`

**⚠️ IMPORTANT**: Change this default key in production!

## Using the Application

1. Start the application: `npm run dev`
2. Open your browser and navigate to the landing page
3. A modal will appear requesting the security key
4. Enter the key configured in your environment variables
5. Click "Access System"
6. The modal will disappear and you can use the application

## Troubleshooting

### "Invalid security key" Error

- Verify the key is set correctly in your environment variables
- Check for typos when entering the key
- Ensure there are no extra spaces before or after the key
- Restart the application after setting the environment variable

### Security Key Not Persisting

- The key check is per-session (stored in sessionStorage)
- Close the browser tab and reopen - you'll need to enter the key again
- This is intentional for security purposes

## Best Practices

1. **Use Environment Variables**: Never hardcode the security key in your code
2. **Rotate Keys Regularly**: Change your security key periodically
3. **Strong Keys**: Use a password manager to generate and store secure keys
4. **Different Keys**: Use different keys for development and production environments
5. **Share Securely**: When sharing the key with team members, use secure communication channels

## Deployment Considerations

When deploying to cloud platforms (Render, Heroku, AWS, etc.):

1. Add the `SECURITY_KEY` environment variable in your platform's dashboard
2. Set it to your chosen secure key
3. Restart the application
4. The key will now be required for all users accessing the application

## Security Notes

- The security key is sent to the server for verification
- It is not stored locally in plain text (uses sessionStorage)
- Server-side validation ensures only authenticated users can access sensitive data
- Session expires when the browser is closed
- This is a lightweight security measure - consider additional authentication for production use

