# Retrospective Insight with AI

A full-stack application for AI-powered retrospective insights, helping teams analyze and improve their processes through intelligent feedback classification and analytics.

## ✨ Features

### 🏗️ **Projects Management**
- View all Azure DevOps projects in your organization
- Project statistics (total, public, private)
- Project details including ID, state, revision, and URL
- Real-time project data from Azure DevOps API

### 👥 **Teams Management**
- View teams under selected projects
- Team information including name, description, principal name, scope, and domain
- Special highlighting for default teams
- Uses Azure DevOps Contribution API for accurate team data

### 📋 **Retro Boards (NEW!)**
- **Navigate to retro boards** by clicking on any team
- View all retrospective boards for a selected team
- Board details including:
  - Title and description
  - Current phase (Collect, Group, Vote)
  - Creation and modification dates
  - Creator information
  - Privacy settings (Anonymous/Named, Public/Private)
  - Voting limits
  - Board columns with colors and titles
- Uses Azure DevOps Extension Management API for retro boards

## 🚀 Tech Stack

- **Frontend**: React 18 with modern hooks
- **Backend**: Node.js with Express.js
- **HTTP Client**: Axios for API calls
- **Icons**: Lucide React for beautiful UI icons
- **Styling**: CSS with responsive design
- **Development**: Nodemon for backend, React Scripts for frontend

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Azure DevOps Personal Access Token (PAT)
- Access to ThiqahDev organization

## 🔧 Installation

1. **Clone or download the project**
2. **Install dependencies**:
   ```bash
   npm run install-all
   ```
3. **Start the application**:
   ```bash
   npm run dev
   ```
   
   Or use the batch file:
   ```bash
   start-app.bat
   ```

## 🌐 Access URLs

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 🔌 API Endpoints

### Backend API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Server health check |
| `GET` | `/api/projects` | Get all Azure DevOps projects |
| `POST` | `/api/projects/:projectName/teams` | Get teams for a specific project |
| `GET` | `/api/teams/:teamId/retroboards` | Get retro boards for a specific team |
| `GET` | `/api/retroboards/:retrospectiveId` | Get retro board details for a specific board |
| `POST` | `/api/retroboards/:retrospectiveId/classify` | Classify retrospective items using ChatGPT AI |

### Azure DevOps APIs Used

1. **Projects API**: `https://dev.azure.com/ThiqahDev/_apis/projects?api-version=7.1`
2. **Teams API**: `https://dev.azure.com/ThiqahDev/_apis/Contribution/HierarchyQuery?api-version=5.0-preview.1`
3. **Retro Boards API**: `https://extmgmt.dev.azure.com/ThiqahDev/_apis/ExtensionManagement/InstalledExtensions/ms-devlabs/team-retrospectives/Data/Scopes/Default/Current/Collections/{teamId}/Documents?api-version=3.1-preview.1`
4. **Retro Board Detail API**: `https://extmgmt.dev.azure.com/ThiqahDev/_apis/ExtensionManagement/InstalledExtensions/ms-devlabs/team-retrospectives/Data/Scopes/Default/Current/Collections/{retrospectiveId}/Documents?api-version=3.1-preview.1`

## 🤖 AI Classification Feature

The application now includes AI-powered classification of retrospective feedback using ChatGPT:

### Features:
- **Automatic Classification**: Classifies each retrospective item as "GOOD" or "BAD" based on content analysis
- **AI Reasoning**: Provides explanations for each classification decision
- **Visual Indicators**: Color-coded badges (Green for Good, Red for Bad)
- **Summary Statistics**: Shows count of good vs. bad points
- **Smart Analysis**: Uses natural language processing to understand sentiment and context

### How to Use:
1. Navigate to any retrospective board detail page
2. Click the **"Classify with AI"** button
3. Wait for ChatGPT to analyze all feedback items
4. View the classification results with reasons
5. Use the summary statistics to understand team sentiment

### Setup Required:
To use the AI classification feature, you need to:

1. **Get an OpenAI API Key**:
   - Sign up at [OpenAI](https://platform.openai.com/)
   - Generate an API key
   - Add it to your environment variables or config

2. **Configure the API Key**:
   ```bash
   # Option 1: Environment variable
   export OPENAI_API_KEY="your-api-key-here"
   
   # Option 2: Update server/config.js
   openai: {
     apiKey: 'your-api-key-here'
   }
   ```

### Example Classification:
- **"Great team collaboration this sprint"** → **GOOD** - Positive feedback about teamwork
- **"We need better documentation"** → **BAD** - Identified area for improvement
- **"Deadlines were too tight"** → **BAD** - Process concern
- **"Code review process is working well"** → **GOOD** - Positive process feedback

## 🎯 How to Use

### 1. **View Projects**
- Open http://localhost:3000
- Projects load automatically
- View project statistics at the top

### 2. **View Teams**
- Click on any project card
- Teams load automatically using the Contribution API
- See team details and special highlighting for default teams

### 3. **View Retro Boards** ⭐ **NEW!**
- Click on any team card (look for the blue "Click to view Retro Boards" button)
- Navigate to the retro boards page
- View all retrospective boards for that team
- See board details, phases, columns, and settings

### 4. **Navigation**
- Use "Back to Teams" to return from retro boards to teams view
- Use "Back to Projects" to return to the main projects view

## 🔐 Configuration

The application uses the following configuration in `server/config.js`:

```javascript
{
  azureDevOps: {
    pat: 'your-personal-access-token',
    organization: 'ThiqahDev',
    apiVersion: '7.1',
    baseUrl: 'https://dev.azure.com'
  },
  server: {
    port: 5000
  }
}
```

## 🎨 UI Features

### **Responsive Design**
- Mobile-friendly layout
- Adaptive grid system
- Touch-friendly interactions

### **Visual Enhancements**
- Gradient backgrounds
- Hover effects and animations
- Status badges with colors
- Icon integration throughout
- Card-based layout

### **Status Indicators**
- **Projects**: Public/Private visibility
- **Teams**: Default team highlighting
- **Retro Boards**: Phase status (Collecting, Grouping, Voting)

## 🚀 Development

### **Available Scripts**

```bash
npm run dev          # Start both backend and frontend
npm run server       # Start backend only
npm run client       # Start frontend only
npm run build        # Build frontend for production
npm run install-all  # Install all dependencies
```

### **Project Structure**

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   └── RetroBoards.js
│   │   ├── App.js         # Main application
│   │   └── index.css      # Global styles
│   └── package.json
├── server/                 # Node.js backend
│   ├── index.js           # Express server
│   ├── config.js          # Configuration
│   └── package.json
├── package.json            # Root package.json
└── start-app.bat          # Windows batch file
```

## 🔍 Troubleshooting

### **Common Issues**

1. **Port Already in Use**
   ```bash
   # Find process using port 5000
   netstat -ano | findstr :5000
   # Kill the process
   taskkill /PID <PID> /F
   ```

2. **Dependencies Not Installed**
   ```bash
   npm run install-all
   ```

3. **PowerShell Issues**
   - Use `start-app.bat` instead of running commands manually
   - PowerShell doesn't support `&&` operator like bash

### **API Errors**

- Check your Personal Access Token in `server/config.js`
- Verify Azure DevOps organization access
- Check network connectivity to Azure DevOps

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section
2. Verify your Azure DevOps permissions
3. Check the browser console for errors
4. Review the server logs

---

**Happy Azure DevOps Management! 🚀**
