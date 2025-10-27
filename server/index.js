const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const axios = require('axios');
const config = require('./config');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Azure DevOps API helper function
const createAzureDevOpsHeaders = () => {
  const credentials = Buffer.from(`:${config.azureDevOps.pat}`).toString('base64');
  return {
    'Authorization': `Basic ${credentials}`,
    'Content-Type': 'application/json'
  };
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Get all projects from Azure DevOps
app.get('/api/projects', async (req, res) => {
  try {
    const url = `${config.azureDevOps.baseUrl}/${config.azureDevOps.organization}/_apis/projects?api-version=${config.azureDevOps.apiVersion}`;
    
    const response = await axios.get(url, {
      headers: createAzureDevOpsHeaders()
    });

    res.json({
      success: true,
      data: response.data,
      count: response.data.count,
      projects: response.data.value
    });
  } catch (error) {
    console.error('Error fetching projects:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch projects from Azure DevOps',
      details: error.response?.data || error.message
    });
  }
});

// Get project teams using Contribution API
app.post('/api/projects/:projectName/teams', async (req, res) => {
  try {
    const { projectName } = req.params;
    
    const requestBody = {
      "contributionIds": ["ms.vss-admin-web.org-admin-groups-data-provider"],
      "dataProviderContext": {
        "properties": {
          "teamsFlag": true,
          "sourcePage": {
            "url": `https://dev.azure.com/${config.azureDevOps.organization}/${projectName}/_settings/teams`,
            "routeId": "ms.vss-admin-web.project-admin-hub-route",
            "routeValues": {
              "project": projectName,
              "adminPivot": "teams",
              "controller": "ContributedPage",
              "action": "Execute",
              "serviceHost": config.azureDevOps.organization
            }
          }
        }
      }
    };

    const url = `${config.azureDevOps.baseUrl}/${config.azureDevOps.organization}/_apis/Contribution/HierarchyQuery?api-version=5.0-preview.1`;
    
    const response = await axios.post(url, requestBody, {
      headers: createAzureDevOpsHeaders()
    });

    // Extract teams from the identities array - only show default teams
    const dataProvider = response.data.dataProviders?.["ms.vss-admin-web.org-admin-groups-data-provider"];
    const allTeams = dataProvider?.identities?.filter(identity => identity.subjectKind === 'team') || [];
    
    // Filter to only show default teams
    const defaultTeams = allTeams.filter(team => team.isDefaultTeam === true);

    res.json({
      success: true,
      data: response.data,
      teams: defaultTeams.map(team => ({
        id: team.identityId,
        name: team.displayName,
        description: team.description || '',
        principalName: team.principalName,
        isDefaultTeam: team.isDefaultTeam || false,
        scope: team.scope,
        domain: team.domain
      }))
    });
  } catch (error) {
    console.error('Error fetching teams:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch teams from Azure DevOps',
      details: error.response?.data || error.message
    });
  }
});

// Get retro boards for a team using Extension Management API
app.get('/api/teams/:teamId/retroboards', async (req, res) => {
  try {
    const { teamId } = req.params;

    const url = `https://extmgmt.dev.azure.com/${config.azureDevOps.organization}/_apis/ExtensionManagement/InstalledExtensions/ms-devlabs/team-retrospectives/Data/Scopes/Default/Current/Collections/${teamId}/Documents?api-version=3.1-preview.1`;

    const response = await axios.get(url, {
      headers: createAzureDevOpsHeaders()
    });

    // Extract retro boards from the response - data is directly in response.data array
    const retroBoards = Array.isArray(response.data) ? response.data : [];

    // Process and clean the data to ensure it's safe for React rendering
    const processedRetroBoards = retroBoards.map(board => {
      // Ensure all properties are safe for rendering
      return {
        id: board.id || null,
        title: board.title || 'Untitled Retro',
        description: board.description || '',
        activePhase: board.activePhase || null,
        status: board.activePhase || 'draft', // For backward compatibility
        createdDate: board.createdDate || null,
        modifiedDate: board.modifiedDate || null,
        createdBy: board.createdBy ? {
          id: board.createdBy.id || null,
          displayName: board.createdBy.displayName || 'Unknown',
          uniqueName: board.createdBy.uniqueName || null,
          imageUrl: board.createdBy.imageUrl || null
        } : null,
        isAnonymous: Boolean(board.isAnonymous),
        isPublic: Boolean(board.isPublic),
        maxVotesPerUser: parseInt(board.maxVotesPerUser) || 0,
        columns: Array.isArray(board.columns) ? board.columns.map(col => ({
          id: col.id || null,
          title: col.title || 'Untitled Column',
          accentColor: col.accentColor || '#6c757d',
          iconClass: col.iconClass || null
        })) : [],
        teamId: board.teamId || null,
        isIncludeTeamEffectivenessMeasurement: Boolean(board.isIncludeTeamEffectivenessMeasurement),
        shouldShowFeedbackAfterCollect: Boolean(board.shouldShowFeedbackAfterCollect),
        displayPrimeDirective: Boolean(board.displayPrimeDirective),
        boardVoteCollection: board.boardVoteCollection || {},
        teamEffectivenessMeasurementVoteCollection: board.teamEffectivenessMeasurementVoteCollection || [],
        permissions: board.permissions || {},
        __etag: board.__etag || null
      };
    });

    res.json({
      success: true,
      data: response.data,
      retroBoards: processedRetroBoards
    });
  } catch (error) {
    console.error('Error fetching retro boards:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch retro boards from Azure DevOps',
      details: error.response?.data || error.message
    });
  }
});

// Get detailed data for a specific retrospective board
app.get('/api/retroboards/:retrospectiveId', async (req, res) => {
  try {
    const { retrospectiveId } = req.params;

    // Use the correct API endpoint structure - the board ID is the collection ID
    // The API structure is: Collections/{boardID}/Documents
    const url = `https://extmgmt.dev.azure.com/${config.azureDevOps.organization}/_apis/ExtensionManagement/InstalledExtensions/ms-devlabs/team-retrospectives/Data/Scopes/Default/Current/Collections/${retrospectiveId}/Documents?api-version=3.1-preview.1`;

    console.log('Fetching retrospective details from:', url);

    const response = await axios.get(url, {
      headers: createAzureDevOpsHeaders()
    });

    console.log('Response status:', response.status);
    console.log('Response data type:', typeof response.data);
    console.log('Response data length:', Array.isArray(response.data) ? response.data.length : 'Not an array');

    // The response contains an array of documents for this specific board
    const documents = Array.isArray(response.data) ? response.data : [];
    
    if (documents.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No documents found in this collection',
        collectionId: retrospectiveId,
        url: url
      });
    }

    console.log('First document sample:', JSON.stringify(documents[0], null, 2));

    // Since we're querying by board ID, we need to find the board configuration
    // The board configuration might be in one of the documents or we need to construct it
    // For now, let's use the first document as a reference and construct board info
    const firstDoc = documents[0];
    
    // Construct board information from the first document
    const boardInfo = {
      id: retrospectiveId,
      title: `Retrospective Board ${retrospectiveId.substring(0, 8)}...`,
      description: `Retrospective board containing ${documents.length} items`,
      activePhase: 'active',
      status: 'active',
      createdDate: firstDoc.created_utc || firstDoc.created_riyadh || new Date().toISOString(),
      modifiedDate: firstDoc.created_utc || firstDoc.created_riyadh || new Date().toISOString(),
      createdBy: {
        id: firstDoc.userIdRef || 'unknown',
        displayName: 'Team Member',
        uniqueName: firstDoc.userIdRef || 'unknown',
        imageUrl: null
      },
      isAnonymous: false,
      isPublic: true,
      maxVotesPerUser: 3,
      columns: [], // We'll need to extract this from the data
      teamId: firstDoc.teamId || null,
      isIncludeTeamEffectivenessMeasurement: false,
      shouldShowFeedbackAfterCollect: true,
      displayPrimeDirective: true,
      boardVoteCollection: {},
      teamEffectivenessMeasurementVoteCollection: [],
      permissions: {},
      __etag: null
    };

    // Process all retrospective items (documents) with their titles and details
    const retrospectiveItems = documents.map((doc, index) => ({
      id: doc.id || `item-${index}`,
      title: doc.title || 'Untitled Item',
      created_riyadh: doc.created_riyadh || null,
      created_utc: doc.created_utc || null,
      upvotes: parseInt(doc.upvotes) || 0,
      votes_sum: parseInt(doc.votes_sum) || 0,
      columnId: doc.columnId || null,
      boardId: doc.boardId || retrospectiveId,
      userIdRef: doc.userIdRef || null,
      // Include any additional fields
      ...doc
    }));

    // Extract unique column IDs and create column information
    const uniqueColumnIds = [...new Set(documents.map(doc => doc.columnId).filter(Boolean))];
    
    // Analyze the content of items in each column to determine column names
    const columns = uniqueColumnIds.map((columnId, index) => {
      // Get all items in this column
      const itemsInColumn = documents.filter(doc => doc.columnId === columnId);
      const allTitles = itemsInColumn.map(item => (item.title || '').toLowerCase()).join(' ');
      
      // Determine column name based on content analysis
      let columnTitle = `Column ${index + 1}`;
      let accentColor = '#6c757d';
      
      // Check for positive/negative sentiment in the content
      const positiveWords = ['good', 'great', 'excellent', 'positive', 'improved', 'better', 'success', 'achieved', 'completed', 'delivered', 'quality', 'efficient', 'collaboration', 'teamwork', 'communication', 'cooperation', 'harmony', 'commitment', 'dedication', 'performance', 'automation', 'workflow', 'easy', 'easily', 'smooth', 'seamless', 'effective', 'productive'];
      const negativeWords = ['bad', 'poor', 'failed', 'broken', 'issue', 'problem', 'bug', 'error', 'slow', 'delayed', 'missed', 'overdue', 'difficult', 'hard', 'complex', 'confusing', 'unclear', 'missing', 'lack', 'overloaded', 'loaded', 'stress', 'pressure', 'overwhelmed', 'frustrated', 'disappointed'];
      
      let positiveScore = 0;
      let negativeScore = 0;
      
      positiveWords.forEach(word => {
        if (allTitles.includes(word)) positiveScore++;
      });
      
      negativeWords.forEach(word => {
        if (allTitles.includes(word)) negativeScore++;
      });
      
             // Determine column type based on sentiment analysis
       if (positiveScore > negativeScore && positiveScore > 0) {
         columnTitle = 'What went well?';
         accentColor = '#28a745'; // Green for positive
       } else if (negativeScore > positiveScore && negativeScore > 0) {
         columnTitle = 'What didn\'t go well?';
         accentColor = '#dc3545'; // Red for negative
       } else if (allTitles.includes('action') || allTitles.includes('improve') || allTitles.includes('next')) {
         columnTitle = 'Actions & Improvements';
         accentColor = '#007bff'; // Blue for actions
       } else if (allTitles.includes('kudos') || allTitles.includes('thank') || allTitles.includes('appreciate')) {
         columnTitle = 'Kudos & Recognition';
         accentColor = '#ffc107'; // Yellow for kudos
       } else {
         // Force specific names for first two columns to ensure they're different
         if (index === 0) {
           columnTitle = 'What went well?';
           accentColor = '#28a745'; // Green
         } else if (index === 1) {
           columnTitle = 'What didn\'t go well?';
           accentColor = '#dc3545'; // Red
         } else {
           // Default column names based on position
           const defaultNames = ['Actions', 'Kudos', 'Improvements'];
           columnTitle = defaultNames[index - 2] || `Column ${index + 1}`;
           accentColor = ['#007bff', '#ffc107', '#6f42c1'][(index - 2) % 3] || '#6c757d';
         }
       }
      
      return {
        id: columnId,
        title: columnTitle,
        accentColor: accentColor,
        iconClass: null
      };
    });

    // Update board info with extracted columns
    boardInfo.columns = columns;

    res.json({
      success: true,
      data: boardInfo,
      detailedBoard: boardInfo,
      retrospectiveItems: retrospectiveItems,
      totalItems: retrospectiveItems.length,
      totalDocuments: documents.length,
      collectionId: retrospectiveId
    });
  } catch (error) {
    console.error('Error fetching retrospective details:', error.response?.data || error.message);
    console.error('Error status:', error.response?.status);
    console.error('Error headers:', error.response?.headers);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch retrospective details from Azure DevOps',
      details: error.response?.data || error.message,
      status: error.response?.status,
      collectionId: req.params.retrospectiveId
    });
  }
});

// Classify retrospective items using rule-based system
app.post('/api/retroboards/:retrospectiveId/classify', async (req, res) => {
  try {
    const { retrospectiveId } = req.params;
    const { items } = req.body;

    console.log('Classification request received for:', retrospectiveId);
    console.log('Items to classify:', items?.length || 0);

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        error: 'Items array is required'
      });
    }

    if (items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No items to classify'
      });
    }

    console.log('Using rule-based classification system...');

    // Simple rule-based classification system
    const classifyItem = (title) => {
      const lowerTitle = title.toLowerCase();
      
      // Positive keywords
      const positiveKeywords = [
        'good', 'great', 'excellent', 'positive', 'improved', 'better', 'success', 
        'achieved', 'completed', 'delivered', 'on time', 'quality', 'efficient',
        'collaboration', 'teamwork', 'communication', 'cooperation', 'harmony',
        'commitment', 'dedication', 'performance', 'automation', 'workflow',
        'easy', 'easily', 'smooth', 'seamless', 'effective', 'productive'
      ];
      
      // Negative keywords
      const negativeKeywords = [
        'bad', 'poor', 'failed', 'broken', 'issue', 'problem', 'bug', 'error',
        'slow', 'delayed', 'missed', 'overdue', 'difficult', 'hard', 'complex',
        'confusing', 'unclear', 'missing', 'lack', 'overloaded', 'loaded',
        'stress', 'pressure', 'overwhelmed', 'frustrated', 'disappointed'
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
        return { classification: 'GOOD', reason: 'Contains positive keywords indicating good performance or outcomes' };
      } else if (negativeScore > positiveScore) {
        return { classification: 'BAD', reason: 'Contains negative keywords indicating issues or problems' };
      } else {
        return { classification: 'NEUTRAL', reason: 'Balanced or neutral feedback content' };
      }
    };

    // Classify each item using the rule-based system
    const classifiedItems = items.map((item) => {
      const result = classifyItem(item.title);
      return {
        ...item,
        classification: result.classification,
        reason: result.reason
      };
    });

    console.log('Rule-based classification completed for', classifiedItems.length, 'items');

    res.json({
      success: true,
      classifiedItems,
      totalItems: classifiedItems.length
    });

  } catch (error) {
    console.error('Error classifying retrospective items:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    console.error('Error message:', error.message);
    
    res.status(500).json({
      success: false,
      error: 'Failed to classify retrospective items',
      details: error.response?.data || error.message,
      status: error.response?.status
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

// 404 handler
// Serve static files from React build
const path = require('path');
const clientBuildPath = path.join(__dirname, '../client/build');

// Serve static files
app.use(express.static(clientBuildPath));

// API routes should be before the catch-all
// All API routes are already defined above

// Catch-all handler for React Router - must be last
app.get('*', (req, res) => {
  // If it's an API route that wasn't found, return JSON error
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      error: 'Route not found'
    });
  }
  // Otherwise serve the React app
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

const PORT = config.server.port;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Azure DevOps API endpoint: ${config.azureDevOps.baseUrl}/${config.azureDevOps.organization}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📋 Projects endpoint: http://localhost:${PORT}/api/projects`);
  console.log(`👥 Teams endpoint: http://localhost:${PORT}/api/projects/:projectName/teams`);
  console.log(`🌐 Frontend: Serving React app from ${clientBuildPath}`);
  console.log(`🌍 Network access: http://0.0.0.0:${PORT} - Accessible from TBS-EMP network`);
});
