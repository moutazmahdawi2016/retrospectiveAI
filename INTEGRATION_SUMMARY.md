# Azure DevOps Integration Summary

## 🎯 **Integration Overview**

This summary provides everything needed to integrate Azure DevOps project management, team analytics, and retrospective analysis functionality into another website or application.

## 🔌 **Core APIs & Endpoints**

### **1. Azure DevOps Projects API**
```javascript
// Endpoint
GET https://dev.azure.com/{organization}/_apis/projects?api-version=7.1

// Authentication
const headers = {
  'Authorization': `Basic ${Buffer.from(`:${PAT_TOKEN}`).toString('base64')}`,
  'Content-Type': 'application/json'
};

// Response Structure
{
  "count": 5,
  "value": [
    {
      "id": "project-id",
      "name": "Project Name",
      "description": "Project Description",
      "visibility": "public|private",
      "state": "wellFormed",
      "revision": 1,
      "url": "https://dev.azure.com/org/project",
      "lastUpdateTime": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### **2. Teams API (Contribution API)**
```javascript
// Endpoint
POST https://dev.azure.com/{organization}/_apis/Contribution/HierarchyQuery?api-version=5.0-preview.1

// Request Body
{
  "contributionIds": ["ms.vss-admin-web.org-admin-groups-data-provider"],
  "dataProviderContext": {
    "properties": {
      "teamsFlag": true,
      "sourcePage": {
        "url": `https://dev.azure.com/${organization}/${projectName}/_settings/teams`,
        "routeId": "ms.vss-admin-web.project-admin-hub-route",
        "routeValues": {
          "project": projectName,
          "adminPivot": "teams",
          "controller": "ContributedPage",
          "action": "Execute",
          "serviceHost": organization
        }
      }
    }
  }
}

// Response Structure
{
  "dataProviders": {
    "ms.vss-admin-web.org-admin-groups-data-provider": {
      "identities": [
        {
          "identityId": "team-id",
          "displayName": "Team Name",
          "description": "Team Description",
          "principalName": "team@domain.com",
          "subjectKind": "team",
          "isDefaultTeam": true,
          "scope": "project",
          "domain": "domain"
        }
      ]
    }
  }
}
```

### **3. Retrospective Boards API**
```javascript
// Endpoint
GET https://extmgmt.dev.azure.com/{organization}/_apis/ExtensionManagement/InstalledExtensions/ms-devlabs/team-retrospectives/Data/Scopes/Default/Current/Collections/{teamId}/Documents?api-version=3.1-preview.1

// Response Structure
[
  {
    "id": "board-id",
    "title": "Retrospective Title",
    "description": "Board Description",
    "activePhase": "collect|group|vote",
    "createdDate": "2024-01-01T00:00:00Z",
    "modifiedDate": "2024-01-01T00:00:00Z",
    "createdBy": {
      "id": "user-id",
      "displayName": "User Name"
    },
    "isAnonymous": false,
    "isPublic": true,
    "maxVotesPerUser": 3,
    "columns": [
      {
        "id": "column-id",
        "title": "Column Title",
        "accentColor": "#28a745"
      }
    ]
  }
]
```

## 🤖 **AI Classification System**

### **Classification Logic**
```javascript
function classifyRetrospectiveItem(title) {
  const lowerTitle = title.toLowerCase();
  
  // Positive keywords
  const positiveKeywords = [
    'good', 'great', 'excellent', 'positive', 'improved', 'better', 'success', 
    'achieved', 'completed', 'delivered', 'quality', 'efficient', 'collaboration', 
    'teamwork', 'communication', 'cooperation', 'harmony', 'commitment', 
    'dedication', 'performance', 'automation', 'workflow', 'easy', 'smooth', 
    'seamless', 'effective', 'productive'
  ];
  
  // Negative keywords
  const negativeKeywords = [
    'bad', 'poor', 'failed', 'broken', 'issue', 'problem', 'bug', 'error',
    'slow', 'delayed', 'missed', 'overdue', 'difficult', 'hard', 'complex',
    'confusing', 'unclear', 'missing', 'lack', 'overloaded', 'stress', 
    'pressure', 'overwhelmed', 'frustrated', 'disappointed'
  ];
  
  let positiveScore = 0;
  let negativeScore = 0;
  
  positiveKeywords.forEach(keyword => {
    if (lowerTitle.includes(keyword)) positiveScore++;
  });
  
  negativeKeywords.forEach(keyword => {
    if (lowerTitle.includes(keyword)) negativeScore++;
  });
  
  if (positiveScore > negativeScore) {
    return { classification: 'GOOD', reason: 'Contains positive keywords indicating good performance' };
  } else if (negativeScore > positiveScore) {
    return { classification: 'BAD', reason: 'Contains negative keywords indicating issues' };
  } else {
    return { classification: 'NEUTRAL', reason: 'Balanced or neutral feedback content' };
  }
}
```

## 📊 **Team Performance Scoring**

### **Performance Calculation**
```javascript
function calculateTeamPerformanceScore(teamData) {
  const totalBoards = teamData.retroBoards.length;
  const recentActivity = teamData.retroBoards.filter(board => {
    const boardDate = new Date(board.createdDate);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return boardDate > thirtyDaysAgo;
  }).length;

  let score = 0;
  
  // Base score from number of retrospectives
  score += Math.min(totalBoards * 10, 50);
  
  // Recent activity bonus
  score += Math.min(recentActivity * 15, 30);
  
  // Team size adjustment
  const teamSizeFactor = Math.min(teamData.teamSize / 5, 1);
  score *= teamSizeFactor;
  
  // Ensure minimum score
  if (score === 0) score = 20;
  
  return Math.round(score);
}

function getPerformanceStatus(score) {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Average';
  return 'Needs Improvement';
}
```

## 🔧 **Integration Service Functions**

### **Complete Integration Service**
```javascript
class AzureDevOpsIntegrationService {
  constructor(organization, patToken) {
    this.organization = organization;
    this.patToken = patToken;
    this.baseUrl = 'https://dev.azure.com';
    this.extMgmtUrl = 'https://extmgmt.dev.azure.com';
  }

  // Authentication headers
  getAuthHeaders() {
    return {
      'Authorization': `Basic ${Buffer.from(`:${this.patToken}`).toString('base64')}`,
      'Content-Type': 'application/json'
    };
  }

  // Get all projects
  async getProjects() {
    const url = `${this.baseUrl}/${this.organization}/_apis/projects?api-version=7.1`;
    const response = await fetch(url, { headers: this.getAuthHeaders() });
    const data = await response.json();
    return data.value;
  }

  // Get teams for a project
  async getTeams(projectName) {
    const url = `${this.baseUrl}/${this.organization}/_apis/Contribution/HierarchyQuery?api-version=5.0-preview.1`;
    const requestBody = {
      "contributionIds": ["ms.vss-admin-web.org-admin-groups-data-provider"],
      "dataProviderContext": {
        "properties": {
          "teamsFlag": true,
          "sourcePage": {
            "url": `https://dev.azure.com/${this.organization}/${projectName}/_settings/teams`,
            "routeId": "ms.vss-admin-web.project-admin-hub-route",
            "routeValues": {
              "project": projectName,
              "adminPivot": "teams",
              "controller": "ContributedPage",
              "action": "Execute",
              "serviceHost": this.organization
            }
          }
        }
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(requestBody)
    });
    
    const data = await response.json();
    const teams = data.dataProviders?.["ms.vss-admin-web.org-admin-groups-data-provider"]?.identities?.filter(identity => identity.subjectKind === 'team') || [];
    
    return teams.map(team => ({
      id: team.identityId,
      name: team.displayName,
      description: team.description || '',
      principalName: team.principalName,
      isDefaultTeam: team.isDefaultTeam || false,
      scope: team.scope,
      domain: team.domain
    }));
  }

  // Get retrospective boards for a team
  async getRetrospectiveBoards(teamId) {
    const url = `${this.extMgmtUrl}/${this.organization}/_apis/ExtensionManagement/InstalledExtensions/ms-devlabs/team-retrospectives/Data/Scopes/Default/Current/Collections/${teamId}/Documents?api-version=3.1-preview.1`;
    
    const response = await fetch(url, { headers: this.getAuthHeaders() });
    const boards = await response.json();
    
    return Array.isArray(boards) ? boards.map(board => ({
      id: board.id,
      title: board.title || 'Untitled Retro',
      description: board.description || '',
      activePhase: board.activePhase || 'draft',
      createdDate: board.createdDate,
      modifiedDate: board.modifiedDate,
      createdBy: board.createdBy,
      isAnonymous: Boolean(board.isAnonymous),
      isPublic: Boolean(board.isPublic),
      maxVotesPerUser: parseInt(board.maxVotesPerUser) || 0,
      columns: board.columns || [],
      teamId: board.teamId
    })) : [];
  }

  // Get detailed retrospective board with items
  async getRetrospectiveDetails(boardId) {
    const url = `${this.extMgmtUrl}/${this.organization}/_apis/ExtensionManagement/InstalledExtensions/ms-devlabs/team-retrospectives/Data/Scopes/Default/Current/Collections/${boardId}/Documents?api-version=3.1-preview.1`;
    
    const response = await fetch(url, { headers: this.getAuthHeaders() });
    const documents = await response.json();
    
    if (!Array.isArray(documents) || documents.length === 0) {
      return null;
    }

    // Process retrospective items
    const retrospectiveItems = documents.map((doc, index) => ({
      id: doc.id || `item-${index}`,
      title: doc.title || 'Untitled Item',
      created_riyadh: doc.created_riyadh,
      upvotes: parseInt(doc.upvotes) || 0,
      votes_sum: parseInt(doc.votes_sum) || 0,
      columnId: doc.columnId,
      boardId: boardId
    }));

    // Extract columns
    const uniqueColumnIds = [...new Set(documents.map(doc => doc.columnId).filter(Boolean))];
    const columns = uniqueColumnIds.map((columnId, index) => ({
      id: columnId,
      title: `Column ${index + 1}`,
      accentColor: ['#28a745', '#dc3545', '#007bff', '#ffc107'][index % 4] || '#6c757d'
    }));

    return {
      id: boardId,
      title: `Retrospective Board ${boardId.substring(0, 8)}...`,
      description: `Retrospective board containing ${documents.length} items`,
      activePhase: 'active',
      createdDate: documents[0]?.created_riyadh || new Date().toISOString(),
      modifiedDate: documents[0]?.created_riyadh || new Date().toISOString(),
      columns: columns,
      retrospectiveItems: retrospectiveItems,
      totalItems: retrospectiveItems.length
    };
  }

  // Classify retrospective items
  classifyItems(items) {
    return items.map(item => {
      const result = this.classifyItem(item.title);
      return {
        ...item,
        classification: result.classification,
        reason: result.reason
      };
    });
  }

  classifyItem(title) {
    const lowerTitle = title.toLowerCase();
    
    const positiveKeywords = ['good', 'great', 'excellent', 'positive', 'improved', 'better', 'success', 'achieved', 'completed', 'delivered', 'quality', 'efficient', 'collaboration', 'teamwork', 'communication'];
    const negativeKeywords = ['bad', 'poor', 'failed', 'broken', 'issue', 'problem', 'bug', 'error', 'slow', 'delayed', 'missed', 'difficult', 'complex', 'confusing'];
    
    let positiveScore = 0;
    let negativeScore = 0;
    
    positiveKeywords.forEach(keyword => {
      if (lowerTitle.includes(keyword)) positiveScore++;
    });
    
    negativeKeywords.forEach(keyword => {
      if (lowerTitle.includes(keyword)) negativeScore++;
    });
    
    if (positiveScore > negativeScore) {
      return { classification: 'GOOD', reason: 'Contains positive keywords indicating good performance' };
    } else if (negativeScore > positiveScore) {
      return { classification: 'BAD', reason: 'Contains negative keywords indicating issues' };
    } else {
      return { classification: 'NEUTRAL', reason: 'Balanced or neutral feedback content' };
    }
  }

  // Calculate team performance
  async calculateTeamPerformance(teamId) {
    const retroBoards = await this.getRetrospectiveBoards(teamId);
    const totalBoards = retroBoards.length;
    const recentActivity = retroBoards.filter(board => {
      const boardDate = new Date(board.createdDate);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return boardDate > thirtyDaysAgo;
    }).length;

    let score = 0;
    score += Math.min(totalBoards * 10, 50);
    score += Math.min(recentActivity * 15, 30);
    
    if (score === 0) score = 20;
    
    return {
      totalBoards,
      recentActivity,
      score: Math.round(score),
      status: this.getPerformanceStatus(score)
    };
  }

  getPerformanceStatus(score) {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Average';
    return 'Needs Improvement';
  }
}
```

## 🚀 **Usage Example**

```javascript
// Initialize the service
const azureDevOps = new AzureDevOpsIntegrationService('YourOrg', 'your-pat-token');

// Get projects
const projects = await azureDevOps.getProjects();

// Get teams for a project
const teams = await azureDevOps.getTeams('ProjectName');

// Get retrospective boards
const boards = await azureDevOps.getRetrospectiveBoards('team-id');

// Get detailed board with items
const boardDetails = await azureDevOps.getRetrospectiveDetails('board-id');

// Classify items
const classifiedItems = azureDevOps.classifyItems(boardDetails.retrospectiveItems);

// Calculate team performance
const performance = await azureDevOps.calculateTeamPerformance('team-id');
```

## 🔐 **Required Configuration**

### **Environment Variables**
```bash
AZURE_DEVOPS_PAT=your_personal_access_token
AZURE_DEVOPS_ORG=your_organization_name
```

### **PAT Token Permissions**
- **Code (read)**
- **Work Items (read)**
- **Project and Team (read)**

## 📋 **Integration Checklist**

- [ ] Set up Azure DevOps Personal Access Token
- [ ] Configure organization name
- [ ] Implement authentication headers
- [ ] Add projects API integration
- [ ] Add teams API integration
- [ ] Add retrospective boards API integration
- [ ] Implement AI classification system
- [ ] Add team performance scoring
- [ ] Handle error cases and edge conditions
- [ ] Test all API endpoints
- [ ] Add loading states and error handling

This integration summary provides everything needed to add Azure DevOps project management, team analytics, and retrospective analysis functionality to any website or application.
