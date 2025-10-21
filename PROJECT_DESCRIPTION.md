# Project Description: AI-Powered Retrospective Analysis Platform

## 🎯 Project Overview

Build a comprehensive full-stack web application for **AI-powered retrospective analysis and team performance management** that integrates with Azure DevOps. The application should provide intelligent insights, advanced analytics, and comprehensive team effectiveness metrics for agile teams.

## 🏗️ Technical Architecture

### Frontend Requirements
- **Framework**: React 18+ with modern hooks and functional components
- **Styling**: CSS with responsive design, gradient backgrounds, and professional UI
- **Icons**: Lucide React for consistent iconography
- **HTTP Client**: Axios for API communication
- **Routing**: React Router DOM for multi-page navigation
- **State Management**: React hooks (useState, useEffect) for local state

### Backend Requirements
- **Runtime**: Node.js with Express.js framework
- **Security**: Helmet for security headers, CORS enabled
- **Environment**: dotenv for configuration management
- **Development**: Nodemon for auto-restart during development
- **HTTP Client**: Axios for external API calls

## 📱 Core Features to Implement

### 1. Azure DevOps Integration
- **Project Management**: Display all Azure DevOps projects with statistics (total, public, private)
- **Team Management**: Show teams under each project with member details
- **Retrospective Boards**: Retrieve and display retrospective boards for each team
- **Real-time Data**: Live synchronization with Azure DevOps APIs

### 2. AI-Powered Classification System
- **Intelligent Analysis**: Automatically classify retrospective items as "GOOD", "BAD", or "NEUTRAL"
- **Sentiment Analysis**: Analyze feedback content for positive/negative sentiment
- **Rule-based Logic**: Implement keyword-based classification system
- **Visual Indicators**: Color-coded badges and status indicators
- **Summary Statistics**: Provide analytics and insights

### 3. Team Performance Analytics
- **Performance Scoring**: Calculate team effectiveness scores based on retrospective activity
- **Comparative Analysis**: Compare team performance across projects
- **Progress Tracking**: Historical trend analysis and progress monitoring
- **Export Functionality**: CSV export for team performance data

## 📄 Required Pages/Components

### 1. Landing Page
- **Purpose**: Welcome page with system overview and feature highlights
- **Features**: Hero section, feature cards, testimonials, call-to-action buttons
- **Design**: Modern, professional layout with gradient backgrounds

### 2. Project Dashboard
- **Purpose**: Main dashboard showing Azure DevOps projects
- **Features**: 
  - Project cards with statistics
  - Expandable project details
  - Team listing for each project
  - Real-time data refresh
  - Performance metrics display

### 3. Retrospective Boards Page
- **Purpose**: Display retrospective boards for selected team
- **Features**:
  - Board listing with status indicators
  - Board details (title, description, phase, dates)
  - Navigation to detailed views
  - Board statistics

### 4. Retrospective Details Page
- **Purpose**: Detailed analysis of individual retrospective boards
- **Features**:
  - Comprehensive board information
  - Retrospective items table
  - AI classification results
  - Performance insights and analytics
  - Interactive charts and visualizations

### 5. Team Comparison Page
- **Purpose**: Compare team performance across projects
- **Features**:
  - Performance scoring system
  - Team comparison table
  - Filtering and search functionality
  - Export to CSV capability
  - Performance analytics

### 6. System Information Page
- **Purpose**: Documentation and system overview
- **Features**:
  - Feature descriptions
  - Technical architecture details
  - API endpoint documentation
  - Business value proposition

## 🔌 API Endpoints to Implement

### Backend API Routes
```
GET  /api/health                                    # Server health check
GET  /api/projects                                  # Get all Azure DevOps projects
POST /api/projects/:projectName/teams              # Get teams for specific project
GET  /api/teams/:teamId/retroboards               # Get retro boards for team
GET  /api/retroboards/:retrospectiveId            # Get detailed board information
POST /api/retroboards/:retrospectiveId/classify   # AI classification of items
```

### Azure DevOps API Integration
- **Projects API**: `https://dev.azure.com/{org}/_apis/projects?api-version=7.1`
- **Teams API**: `https://dev.azure.com/{org}/_apis/Contribution/HierarchyQuery?api-version=5.0-preview.1`
- **Retro Boards API**: `https://extmgmt.dev.azure.com/{org}/_apis/ExtensionManagement/InstalledExtensions/ms-devlabs/team-retrospectives/Data/Scopes/Default/Current/Collections/{teamId}/Documents?api-version=3.1-preview.1`

## 🤖 AI Classification System

### Classification Logic
- **Positive Keywords**: good, great, excellent, success, achieved, completed, delivered, quality, efficient, collaboration, teamwork, communication, etc.
- **Negative Keywords**: bad, poor, failed, broken, issue, problem, bug, error, slow, delayed, missed, difficult, complex, confusing, etc.
- **Scoring System**: Count positive vs negative keywords, classify based on majority
- **Output**: Classification (GOOD/BAD/NEUTRAL) with reasoning explanation

### Features
- **Automatic Processing**: Classify all retrospective items in a board
- **Visual Indicators**: Color-coded badges (Green for Good, Red for Bad, Gray for Neutral)
- **Summary Statistics**: Count of good vs bad points
- **Detailed Analysis**: Show classification reasoning for each item

## 🎨 UI/UX Requirements

### Design Elements
- **Color Scheme**: Professional blue/green gradient backgrounds
- **Cards**: Clean card-based layout with hover effects
- **Status Badges**: Color-coded indicators for different states
- **Icons**: Consistent iconography using Lucide React
- **Responsive**: Mobile-friendly design with adaptive grid system

### Interactive Elements
- **Hover Effects**: Smooth animations on card hover
- **Loading States**: Spinner animations during data fetching
- **Error Handling**: User-friendly error messages
- **Navigation**: Breadcrumb navigation between pages

## 🔧 Configuration & Environment

### Environment Variables
```bash
AZURE_DEVOPS_PAT=your_personal_access_token
AZURE_DEVOPS_ORG=your_organization_name
AZURE_DEVOPS_API_VERSION=7.1
AZURE_DEVOPS_BASE_URL=https://dev.azure.com
DEEPSEEK_API_KEY=your_deepseek_api_key (optional)
DEEPSEEK_BASE_URL=https://api.deepseek.com
PORT=5000
```

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "server": "cd server && npm run dev",
    "client": "cd client && npm start",
    "build": "cd client && npm run build",
    "install-all": "npm install && cd server && npm install && cd ../client && npm install"
  }
}
```

## 📊 Data Models

### Project Object
```javascript
{
  id: string,
  name: string,
  description: string,
  visibility: 'public' | 'private',
  state: string,
  revision: number,
  url: string,
  lastUpdateTime: string
}
```

### Team Object
```javascript
{
  id: string,
  name: string,
  description: string,
  principalName: string,
  isDefaultTeam: boolean,
  scope: string,
  domain: string
}
```

### Retrospective Board Object
```javascript
{
  id: string,
  title: string,
  description: string,
  activePhase: 'collect' | 'group' | 'vote',
  createdDate: string,
  modifiedDate: string,
  createdBy: object,
  isAnonymous: boolean,
  isPublic: boolean,
  maxVotesPerUser: number,
  columns: array,
  retrospectiveItems: array
}
```

### Retrospective Item Object
```javascript
{
  id: string,
  title: string,
  created_riyadh: string,
  upvotes: number,
  votes_sum: number,
  columnId: string,
  classification?: 'GOOD' | 'BAD' | 'NEUTRAL',
  reason?: string
}
```

## 🚀 Development Setup

### Project Structure
```
project/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   └── package.json
├── server/                 # Node.js backend
│   ├── index.js           # Express server
│   ├── config.js          # Configuration
│   └── package.json
├── package.json            # Root configuration
└── README.md              # Documentation
```

### Dependencies
- **Frontend**: react, react-dom, axios, lucide-react, react-router-dom
- **Backend**: express, axios, cors, helmet, dotenv, nodemon
- **Root**: concurrently

## 🎯 Key Implementation Notes

1. **Authentication**: Use Azure DevOps Personal Access Token (PAT) for API authentication
2. **Error Handling**: Implement comprehensive error handling for API failures
3. **Loading States**: Show loading indicators during data fetching
4. **Responsive Design**: Ensure mobile-friendly interface
5. **Performance**: Implement efficient data fetching and caching
6. **Security**: Never expose API keys in frontend code
7. **Documentation**: Provide clear setup instructions and API documentation

## 📈 Success Metrics

The application should provide:
- **Real-time project and team data** from Azure DevOps
- **Intelligent classification** of retrospective feedback
- **Performance analytics** for team comparison
- **Professional UI/UX** with responsive design
- **Export capabilities** for data analysis
- **Comprehensive documentation** for easy setup and use

## 🔐 Security Requirements

### Authentication
- **Personal Access Token (PAT)**: Secure Azure DevOps authentication
- **Environment Variables**: Secure API key management
- **Helmet**: Security headers and protection
- **CORS**: Cross-origin resource sharing configuration

### Data Protection
- **No Hardcoded Keys**: All sensitive data in environment variables
- **Secure Input**: Hidden input for API key setup
- **Error Handling**: Comprehensive error management
- **Input Validation**: Data sanitization and validation

## 🎨 Sample UI Components

### Project Card Component
```javascript
// Project card with expandable details
<div className="project-card">
  <div className="project-header">
    <h3>{project.name}</h3>
    <span className="visibility-badge">{project.visibility}</span>
  </div>
  <div className="project-description">{project.description}</div>
  {/* Expandable team details */}
</div>
```

### Classification Badge Component
```javascript
// Color-coded classification badge
<span className={`classification-badge ${classification.toLowerCase()}`}>
  {classification}
</span>
```

### Performance Score Component
```javascript
// Team performance score with color coding
<div className="performance-score">
  <span className={`score ${score >= 80 ? 'excellent' : score >= 60 ? 'good' : 'needs-improvement'}`}>
    {score}
  </span>
</div>
```

## 📋 Implementation Checklist

- [ ] Set up React frontend with routing
- [ ] Create Express.js backend server
- [ ] Implement Azure DevOps API integration
- [ ] Build project dashboard with statistics
- [ ] Create team management interface
- [ ] Develop retrospective boards viewer
- [ ] Implement AI classification system
- [ ] Build team comparison analytics
- [ ] Add export functionality
- [ ] Implement responsive design
- [ ] Add error handling and loading states
- [ ] Create comprehensive documentation
- [ ] Set up environment configuration
- [ ] Test all API endpoints
- [ ] Deploy and test end-to-end functionality

This description provides everything needed to build a professional-grade retrospective analysis platform with AI-powered insights and Azure DevOps integration.
