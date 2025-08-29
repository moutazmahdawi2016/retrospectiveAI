import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  FileText, 
  Loader, 
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Eye,
  EyeOff,
  User,
  Vote,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Target,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

function RetroBoards({ teamId, teamName, onBack, onRetroClick }) {
  const [retroBoards, setRetroBoards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showProgress, setShowProgress] = useState(false);
  const [progressData, setProgressData] = useState(null);
  const [analyzingProgress, setAnalyzingProgress] = useState(false);
  const [isDetailedTableCollapsed, setIsDetailedTableCollapsed] = useState(true);

  const fetchRetroBoards = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/teams/${teamId}/retroboards`);
      if (response.data.success) {
        setRetroBoards(response.data.retroBoards || []);
      } else {
        setError('Failed to fetch retro boards');
      }
    } catch (err) {
      console.error('Error fetching retro boards:', err);
      setError(err.response?.data?.error || 'Failed to fetch retro boards');
    } finally {
      setLoading(false);
    }
  };

  // Analyze team progress over time
  const analyzeTeamProgress = async () => {
    if (retroBoards.length === 0) {
      setError('No retro boards available for analysis');
      return;
    }

    setAnalyzingProgress(true);
    setError(null);

    try {
      // Sort boards by date to analyze trends
      const sortedBoards = [...retroBoards].sort((a, b) => {
        const dateA = new Date(a.createdDate || a.modifiedDate || 0);
        const dateB = new Date(b.createdDate || b.modifiedDate || 0);
        return dateA - dateB;
      });

      // Fetch AI classification data for each retrospective
      const classificationData = [];
      let totalGoodPoints = 0;
      let totalBadPoints = 0;
      let totalUnknownPoints = 0;

      for (const board of sortedBoards) {
        try {
          // Debug: Log board properties to understand available data
          console.log('Board object properties:', {
            id: board.id,
            title: board.title,
            name: board.name,
            description: board.description,
            createdDate: board.createdDate,
            modifiedDate: board.modifiedDate,
            activePhase: board.activePhase,
            status: board.status
          });
          
          // Debug: Log board.columns structure if available
          if (board.columns && Array.isArray(board.columns)) {
            console.log(`Board ${board.id} has ${board.columns.length} columns:`, board.columns.map(col => ({
              id: col.id,
              title: col.title,
              itemCount: col.items ? col.items.length : 0,
              items: col.items ? col.items.slice(0, 3).map(item => item.title) : [] // Show first 3 item titles
            })));
          } else {
            console.log(`Board ${board.id} has no columns or columns is not an array:`, board.columns);
          }
          
          // Debug: Log ALL board properties to see what's available
          console.log(`Board ${board.id} ALL properties:`, Object.keys(board));
          console.log(`Board ${board.id} full object:`, board);
          
          // Fetch retrospective items for AI classification
          const response = await axios.get(`/api/retroboards/${board.id}`);
          if (response.data.success && response.data.retrospectiveItems) {
            const items = response.data.retrospectiveItems;
            
            // Debug: Log what items were fetched with full details
            console.log(`Board ${board.id} fetched ${items.length} items:`, items.map(item => ({
              id: item.id,
              title: item.title,
              description: item.description,
              columnId: item.columnId,
              columnName: item.columnName
            })));
            
            // Also log the full response to see what's available
            console.log(`Board ${board.id} full API response:`, response.data);
            
            // Initialize itemsToProcess variable
            let itemsToProcess = items;
            
            // Check if we have items or if we need to use totalItems from response
            if (items.length === 0 && response.data.totalItems && response.data.totalItems > 0) {
              console.log(`Board ${board.id} has 0 items but server reports ${response.data.totalItems} total items`);
              // Create dummy items based on the total count for classification purposes
              const dummyItems = [];
              for (let i = 0; i < response.data.totalItems; i++) {
                dummyItems.push({
                  id: `dummy-${i}`,
                  title: `Item ${i + 1}`,
                  description: 'Item from total count',
                  columnId: null,
                  columnName: 'Unknown Column'
                });
              }
              // Use dummy items for classification
              itemsToProcess = dummyItems;
            }
            
            // Simulate AI classification (in real implementation, this would come from your AI service)
            const boardClassifications = itemsToProcess.map(item => {
              // Enhanced classification based on content analysis
              const title = (item.title || '').toLowerCase();
              const description = (item.description || '').toLowerCase();
              const content = `${title} ${description}`;
              
              // Get column name from the board columns if available
              let columnName = item.columnName;
              if (!columnName && item.columnId && board.columns) {
                const column = board.columns.find(col => col.id === item.columnId);
                if (column) {
                  columnName = column.title;
                }
              }
              
              // More comprehensive positive keywords
              const positiveKeywords = [
                'good', 'great', 'improved', 'success', 'working', 'helpful', 'excellent', 'awesome', 'smooth',
                'efficient', 'productive', 'collaboration', 'teamwork', 'communication', 'support', 'learning',
                'growth', 'innovation', 'quality', 'delivery', 'on-time', 'meeting', 'goal', 'achievement',
                'positive', 'benefit', 'advantage', 'strength', 'opportunity', 'improvement', 'solution',
                'resolve', 'fix', 'complete', 'finish', 'deliver', 'accomplish', 'succeed', 'win'
              ];
              
              // More comprehensive negative keywords
              const negativeKeywords = [
                'bad', 'issue', 'problem', 'failed', 'broken', 'difficult', 'slow', 'blocked', 'frustrating',
                'confusing', 'delay', 'bug', 'error', 'crash', 'down', 'stuck', 'blocking', 'impediment',
                'obstacle', 'challenge', 'risk', 'concern', 'worry', 'stress', 'pressure', 'deadline',
                'miss', 'overdue', 'late', 'poor', 'weak', 'lack', 'missing', 'incomplete', 'unfinished',
                'complicated', 'complex', 'hard', 'tough', 'struggle', 'difficulty', 'trouble', 'pain'
              ];
              
              // Check if content contains positive or negative keywords
              const isPositive = positiveKeywords.some(keyword => content.includes(keyword));
              const isNegative = negativeKeywords.some(keyword => content.includes(keyword));
              
              let classification = 'UNKNOWN';
              if (isPositive && !isNegative) {
                classification = 'GOOD';
              } else if (isNegative && !isPositive) {
                classification = 'BAD';
              } else if (isPositive && isNegative) {
                // If both positive and negative keywords found, classify based on majority
                const positiveCount = positiveKeywords.filter(keyword => content.includes(keyword)).length;
                const negativeCount = negativeKeywords.filter(keyword => content.includes(keyword)).length;
                classification = positiveCount >= negativeCount ? 'GOOD' : 'BAD';
              }
              
              // Fallback: Use column information to help classify if content analysis is insufficient
              if (classification === 'UNKNOWN' && columnName) {
                const columnNameLower = columnName.toLowerCase();
                if (columnNameLower.includes('went well') || columnNameLower.includes('good') || columnNameLower.includes('positive') || 
                    columnNameLower.includes('success') || columnNameLower.includes('strength') || columnNameLower.includes('keep')) {
                  classification = 'GOOD';
                } else if (columnNameLower.includes('didn\'t go well') || columnNameLower.includes('bad') || columnNameLower.includes('negative') || 
                          columnNameLower.includes('problem') || columnNameLower.includes('issue') || columnNameLower.includes('improve') ||
                          columnNameLower.includes('concern') || columnNameLower.includes('challenge')) {
                  classification = 'BAD';
                }
              }
              
              // Debug: Log item classification with more detail
              console.log(`Item "${item.title}" classified as ${classification}:`, {
                content: content.substring(0, 100),
                columnName: columnName,
                positiveKeywords: positiveKeywords.filter(keyword => content.includes(keyword)),
                negativeKeywords: negativeKeywords.filter(keyword => content.includes(keyword)),
                isPositive,
                isNegative,
                fallbackUsed: classification === 'UNKNOWN' ? 'No fallback' : 'Column-based fallback'
              });
              
              return {
                ...item,
                classification,
                reason: classification === 'GOOD' ? 'Positive sentiment detected' : 
                       classification === 'BAD' ? 'Negative sentiment detected' : 'Neutral sentiment'
              };
            });

            const goodCount = boardClassifications.filter(item => item.classification === 'GOOD').length;
            const badCount = boardClassifications.filter(item => item.classification === 'BAD').length;
            const unknownCount = boardClassifications.filter(item => item.classification === 'UNKNOWN').length;

            totalGoodPoints += goodCount;
            totalBadPoints += badCount;
            totalUnknownPoints += unknownCount;

            // Calculate ratios with better handling of edge cases
            let positiveRatio = 0;
            let negativeRatio = 0;
            
            if (goodCount + badCount > 0) {
              positiveRatio = (goodCount / (goodCount + badCount)) * 100;
              negativeRatio = (badCount / (goodCount + badCount)) * 100;
            }
            // When both are 0, ratios remain 0 (which is correct)

            // Debug: Log the calculation values
            console.log(`Board ${board.id} - Good: ${goodCount}, Bad: ${badCount}, Total: ${goodCount + badCount}, Positive Ratio: ${positiveRatio.toFixed(1)}%`);
            
            // Debug: Log final classification summary for this board
            console.log(`Board ${board.id} Classification Summary:`, {
              totalItems: itemsToProcess.length,
              goodItems: goodCount,
              badItems: badCount,
              unknownItems: unknownCount,
              positiveRatio: positiveRatio.toFixed(1) + '%',
              items: boardClassifications.map(item => ({
                title: item.title,
                classification: item.classification,
                columnName: item.columnName
              }))
            });
            
            // Additional debug: Show raw item data
            console.log(`Board ${board.id} Raw items data:`, itemsToProcess);
            console.log(`Board ${board.id} Board columns:`, board.columns);

            classificationData.push({
              boardId: board.id,
              boardName: generateRetroName(board),
              date: board.createdDate || board.modifiedDate,
              totalItems: itemsToProcess.length, // Use the actual processed items count
              goodPoints: goodCount,
              badPoints: badCount,
              unknownPoints: unknownCount,
              classification: boardClassifications,
              positiveRatio: positiveRatio,
              negativeRatio: negativeRatio
            });
          } else {
            // Fallback: If API call fails or returns no items, try to count from board.columns
            console.warn(`API call for board ${board.id} failed or returned no items. Response:`, response.data);
            
            let fallbackItems = [];
            
            // Enhanced fallback: Check multiple possible data structures
            if (board.columns && Array.isArray(board.columns)) {
              console.log(`Board ${board.id} columns structure:`, board.columns.map(col => ({
                id: col.id,
                title: col.title,
                hasItems: Boolean(col.items),
                itemsCount: col.items ? col.items.length : 0,
                itemTitles: col.items ? col.items.slice(0, 3).map(item => item.title) : []
              })));
              
              board.columns.forEach(column => {
                if (column.items && Array.isArray(column.items)) {
                  fallbackItems.push(...column.items.map(item => ({
                    ...item,
                    columnName: column.title || 'Unknown Column'
                  })));
                }
              });
            }
            
            // Additional fallback: Check if items are directly on the board
            if (fallbackItems.length === 0 && board.items && Array.isArray(board.items)) {
              console.log(`Board ${board.id} has direct items:`, board.items.length);
              fallbackItems.push(...board.items.map(item => ({
                ...item,
                columnName: 'Unknown Column'
              })));
            }
            
            // Additional fallback: Check if there's a different structure
            if (fallbackItems.length === 0 && board.workItems && Array.isArray(board.workItems)) {
              console.log(`Board ${board.id} has workItems:`, board.workItems.length);
              fallbackItems.push(...board.workItems.map(item => ({
                ...item,
                columnName: 'Unknown Column'
              })));
            }
            
            // Additional fallback: Check for metadata with item counts
            if (fallbackItems.length === 0) {
              const possibleCountProperties = ['itemCount', 'totalItems', 'workItemCount', 'retroItemCount', 'feedbackCount'];
              for (const prop of possibleCountProperties) {
                if (board[prop] && typeof board[prop] === 'number' && board[prop] > 0) {
                  console.log(`Board ${board.id} has ${prop}:`, board[prop]);
                  // Create dummy items based on count for classification purposes
                  for (let i = 0; i < board[prop]; i++) {
                    fallbackItems.push({
                      id: `dummy-${i}`,
                      title: `Item ${i + 1}`,
                      description: 'Item from metadata count',
                      columnName: 'Unknown Column'
                    });
                  }
                  break;
                }
              }
            }
            
            console.log(`Using fallback method for board ${board.id}. Found ${fallbackItems.length} items from board.columns and other sources`);
            
            if (fallbackItems.length > 0) {
              // Process fallback items with basic classification
              const boardClassifications = fallbackItems.map(item => {
                const title = (item.title || '').toLowerCase();
                const columnName = (item.columnName || '').toLowerCase();
                
                let classification = 'UNKNOWN';
                
                // Classify based on column name as fallback
                if (columnName.includes('went well') || columnName.includes('good') || columnName.includes('positive') || 
                    columnName.includes('success') || columnName.includes('strength') || columnName.includes('keep')) {
                  classification = 'GOOD';
                } else if (columnName.includes('didn\'t go well') || columnName.includes('bad') || columnName.includes('negative') || 
                          columnName.includes('problem') || columnName.includes('issue') || columnName.includes('improve') ||
                          columnName.includes('concern') || columnName.includes('challenge')) {
                  classification = 'BAD';
                }
                
                return {
                  ...item,
                  classification,
                  reason: classification === 'GOOD' ? 'Column-based classification' : 
                         classification === 'BAD' ? 'Column-based classification' : 'Unknown column'
                };
              });
              
              const goodCount = boardClassifications.filter(item => item.classification === 'GOOD').length;
              const badCount = boardClassifications.filter(item => item.classification === 'BAD').length;
              const unknownCount = boardClassifications.filter(item => item.classification === 'UNKNOWN').length;

              totalGoodPoints += goodCount;
              totalBadPoints += badCount;
              totalUnknownPoints += unknownCount;

              let positiveRatio = 0;
              let negativeRatio = 0;
              
              if (goodCount + badCount > 0) {
                positiveRatio = (goodCount / (goodCount + badCount)) * 100;
                negativeRatio = (badCount / (goodCount + badCount)) * 100;
              }

              console.log(`Fallback classification for board ${board.id} - Good: ${goodCount}, Bad: ${badCount}, Total: ${goodCount + badCount}, Positive Ratio: ${positiveRatio.toFixed(1)}%`);

              classificationData.push({
                boardId: board.id,
                boardName: generateRetroName(board),
                date: board.createdDate || board.modifiedDate,
                totalItems: goodCount + badCount,
                goodPoints: goodCount,
                badPoints: badCount,
                unknownPoints: unknownCount,
                classification: boardClassifications,
                positiveRatio: positiveRatio,
                negativeRatio: negativeRatio
              });
            } else {
              console.warn(`No items found for board ${board.id} using both API and fallback methods`);
              // Add board with 0 items
              classificationData.push({
                boardId: board.id,
                boardName: generateRetroName(board),
                date: board.createdDate || board.modifiedDate,
                totalItems: 0,
                goodPoints: 0,
                badPoints: 0,
                unknownPoints: 0,
                classification: [],
                positiveRatio: 0,
                negativeRatio: 0
              });
            }
          }
        } catch (err) {
          console.warn(`Could not fetch classification data for board ${board.id}:`, err);
          // Continue with other boards
        }
      }

      // Group boards by month for trend analysis
      const monthlyData = {};
      const currentDate = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(currentDate.getMonth() - 6);

      sortedBoards.forEach(board => {
        const boardDate = new Date(board.createdDate || board.modifiedDate);
        if (boardDate >= sixMonthsAgo) {
          const monthKey = boardDate.toISOString().slice(0, 7); // YYYY-MM format
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {
              count: 0,
              totalItems: 0,
              activeBoards: 0,
              completedBoards: 0,
              goodPoints: 0,
              badPoints: 0,
              unknownPoints: 0
            };
          }
          monthlyData[monthKey].count++;
          
          // Count items if available
          if (board.columns) {
            board.columns.forEach(column => {
              if (column.items && Array.isArray(column.items)) {
                monthlyData[monthKey].totalItems += column.items.length;
              }
            });
          }

          // Add classification data to monthly data
          const boardClassification = classificationData.find(c => c.boardId === board.id);
          if (boardClassification) {
            monthlyData[monthKey].goodPoints += boardClassification.goodPoints;
            monthlyData[monthKey].badPoints += boardClassification.badPoints;
            monthlyData[monthKey].unknownPoints += boardClassification.unknownPoints;
            // Fixed: use corrected total items (good + bad points)
            monthlyData[monthKey].totalItems = monthlyData[monthKey].goodPoints + monthlyData[monthKey].badPoints;
          }

          // Categorize board status
          const status = board.activePhase || board.status || 'draft';
          if (status === 'vote' || status === 'completed') {
            monthlyData[monthKey].completedBoards++;
          } else {
            monthlyData[monthKey].activeBoards++;
          }
        }
      });

      // Calculate trends
      const months = Object.keys(monthlyData).sort();
      const trends = {
        boardCreation: calculateTrend(months.map(m => monthlyData[m].count)),
        itemEngagement: calculateTrend(months.map(m => monthlyData[m].totalItems)),
        completionRate: calculateTrend(months.map(m => monthlyData[m].completedBoards)),
        overallActivity: calculateTrend(months.map(m => monthlyData[m].count + monthlyData[m].totalItems)),
        goodPoints: calculateTrend(months.map(m => monthlyData[m].goodPoints)),
        badPoints: calculateTrend(months.map(m => monthlyData[m].badPoints)),
        positiveRatio: calculateTrend(months.map(m => monthlyData[m].goodPoints + monthlyData[m].badPoints > 0 ? 
          (monthlyData[m].goodPoints / (monthlyData[m].goodPoints + monthlyData[m].badPoints)) * 100 : 0)) // Fixed: use good + bad points only
      };

      // Determine overall progress status
      const overallStatus = determineOverallStatus(trends, monthlyData);

      setProgressData({
        monthlyData,
        trends,
        overallStatus,
        totalBoards: sortedBoards.length,
        recentActivity: sortedBoards.filter(b => {
          const boardDate = new Date(b.createdDate || b.modifiedDate);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return boardDate > thirtyDaysAgo;
        }).length,
        averageItemsPerBoard: sortedBoards.reduce((sum, b) => {
          // Fixed: use classification data to get good + bad points instead of counting all column items
          const boardClassification = classificationData.find(c => c.boardId === b.id);
          if (boardClassification) {
            return sum + boardClassification.totalItems; // This is already good + bad points
          }
          return sum;
        }, 0) / sortedBoards.length,
        // AI Classification data
        classificationData,
        totalGoodPoints,
        totalBadPoints,
        totalUnknownPoints,
        overallPositiveRatio: (totalGoodPoints + totalBadPoints) > 0 ? 
          (totalGoodPoints / (totalGoodPoints + totalBadPoints)) * 100 : 0, // Fixed: exclude unknown points from ratio calculation
        overallNegativeRatio: (totalGoodPoints + totalBadPoints) > 0 ? 
          (totalBadPoints / (totalGoodPoints + totalBadPoints)) * 100 : 0
      });

      setShowProgress(true);
    } catch (err) {
      console.error('Error analyzing progress:', err);
      setError('Failed to analyze team progress');
    } finally {
      setAnalyzingProgress(false);
    }
  };

  // Calculate trend direction and strength
  const calculateTrend = (values) => {
    if (values.length < 2) return { direction: 'stable', strength: 0, change: 0 };
    
    const recent = values.slice(-3); // Last 3 months
    const previous = values.slice(-6, -3); // 3 months before that
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const previousAvg = previous.reduce((a, b) => a + b, 0) / previous.length;
    
    const change = recentAvg - previousAvg;
    const percentChange = previousAvg > 0 ? (change / previousAvg) * 100 : 0;
    
    let direction = 'stable';
    if (change > 0) direction = 'improving';
    else if (change < 0) direction = 'declining';
    
    let strength = 'weak';
    if (Math.abs(percentChange) > 20) strength = 'strong';
    else if (Math.abs(percentChange) > 10) strength = 'moderate';
    
    return { direction, strength, change: Math.round(percentChange) };
  };

  // Determine overall team progress status
  const determineOverallStatus = (trends, monthlyData) => {
    const improvingTrends = Object.values(trends).filter(t => t.direction === 'improving').length;
    const decliningTrends = Object.values(trends).filter(t => t.direction === 'declining').length;
    
    if (improvingTrends >= 3) return 'excellent';
    if (improvingTrends >= 2) return 'good';
    if (decliningTrends >= 2) return 'needs-improvement';
    return 'stable';
  };

  // Get trend icon and color
  const getTrendIcon = (trend) => {
    switch (trend.direction) {
      case 'improving':
        return <TrendingUp size={16} style={{ color: '#28a745' }} />;
      case 'declining':
        return <TrendingDown size={16} style={{ color: '#dc3545' }} />;
      default:
        return <Minus size={16} style={{ color: '#6c757d' }} />;
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    if (!status) return 'status-draft';
    
    switch (status.toString().toLowerCase()) {
      case 'collect':
        return 'status-active';
      case 'group':
        return 'status-draft';
      case 'vote':
        return 'status-completed';
      default:
        return 'status-draft';
    }
  };

  // Get status text
  const getStatusText = (status) => {
    if (!status) return 'Draft';
    
    switch (status.toString().toLowerCase()) {
      case 'collect':
        return 'Collecting';
      case 'group':
        return 'Grouping';
      case 'vote':
        return 'Voting';
      default:
        return 'Draft';
    }
  };

  // Get created by display name
  const getCreatedByDisplayName = (createdBy) => {
    if (!createdBy) return 'Unknown';
    
    // Handle both string and object formats
    if (typeof createdBy === 'string') {
      return createdBy;
    }
    
    if (typeof createdBy === 'object' && createdBy.displayName) {
      return createdBy.displayName;
    }
    
    return 'Unknown';
  };

  // Generate a meaningful retrospective name
  const generateRetroName = (board) => {
    // Try to get a meaningful name from various properties
    if (board.title && board.title.trim()) {
      return board.title.trim();
    }
    
    if (board.name && board.name.trim()) {
      return board.name.trim();
    }
    
    if (board.description && board.description.trim()) {
      // Truncate description if it's too long
      const desc = board.description.trim();
      return desc.length > 50 ? desc.substring(0, 50) + '...' : desc;
    }
    
    // Use date-based naming as fallback
    const date = board.createdDate || board.modifiedDate;
    if (date) {
      try {
        const dateObj = new Date(date);
        if (!isNaN(dateObj.getTime())) {
          const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
          const day = dateObj.getDate();
          const year = dateObj.getFullYear();
          
          // Add status information if available
          const status = board.activePhase || board.status;
          if (status && status !== 'draft') {
            return `Retro ${month} ${day}, ${year} (${status})`;
          }
          return `Retro ${month} ${day}, ${year}`;
        }
      } catch (err) {
        console.warn('Error parsing date for board:', board.id, err);
      }
    }
    
    // Last resort: use a shortened ID with status
    const shortId = board.id ? board.id.substring(0, 8) + '...' : 'Unknown';
    const status = board.activePhase || board.status;
    if (status && status !== 'draft') {
      return `Retro ${shortId} (${status})`;
    }
    return `Retro ${shortId}`;
  };

  const handleRetroClick = (retroBoard) => {
    console.log('Clicked retro board:', retroBoard);
    console.log('Board ID:', retroBoard.id);
    console.log('Board Title:', retroBoard.title);
    
    if (onRetroClick) {
      onRetroClick(retroBoard);
    }
  };

  useEffect(() => {
    if (teamId) {
      fetchRetroBoards();
    }
  }, [teamId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (err) {
      return 'Invalid Date';
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch (err) {
      return 'Invalid Date';
    }
  };

  // Calculate a performance score based on trends
  const calculatePerformanceScore = (data) => {
    if (!data || !data.trends) return 0;

    const improvingTrends = Object.values(data.trends).filter(t => t.direction === 'improving').length;
    const decliningTrends = Object.values(data.trends).filter(t => t.direction === 'declining').length;
    const stableTrends = Object.values(data.trends).filter(t => t.direction === 'stable').length;

    // Simple scoring: 1 point for improving, -1 for declining, 0 for stable
    let score = 0;
    if (improvingTrends > decliningTrends) {
      score = 1;
    } else if (decliningTrends > improvingTrends) {
      score = -1;
    }

    // Add points for strong trends
    if (Object.values(data.trends).some(t => t.strength === 'strong')) {
      score += 0.5;
    }
    if (Object.values(data.trends).some(t => t.strength === 'moderate')) {
      score += 0.25;
    }

    // Cap score at 1 or -1
    return Math.max(-1, Math.min(1, score));
  };

  // Get a message based on the performance score
  const getPerformanceMessage = (data) => {
    const score = calculatePerformanceScore(data);
    if (score === 1) return "Your team is performing exceptionally well! Keep up the great work!";
    if (score === -1) return "Your team's retrospective practices are showing signs of decline. Let's identify areas for improvement.";
    return "Your team's retrospective practices are stable. Continue to monitor trends.";
  };

  // Get recommendations based on the performance score
  const getPerformanceRecommendations = (data) => {
    const score = calculatePerformanceScore(data);
    if (score === 1) return "Maintain the momentum and continue to foster a culture of continuous improvement.";
    if (score === -1) return "Conduct a retrospective to identify specific areas where practices are declining and develop actionable plans to address them.";
    return "Regularly review and adjust your retrospective processes to ensure they remain effective.";
  };

  // Get a color for the trend dot based on the month's data
  const getMonthTrendColor = (monthData, index, allData) => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const currentMonthIndex = Object.keys(allData).findIndex(m => m === currentMonth);

    if (index < currentMonthIndex) { // Past months
      const prevMonth = Object.keys(allData)[index + 1];
      const prevMonthData = allData[prevMonth];
      const currentMonthData = allData[currentMonth];

      if (currentMonthData.count > prevMonthData.count) {
        return 'up';
      } else if (currentMonthData.count < prevMonthData.count) {
        return 'down';
      }
    } else if (index === currentMonthIndex) { // Current month
      return 'current';
    }
    return 'stable';
  };

  // Get strengths based on progress data
  const getTeamStrengths = (data) => {
    const score = calculatePerformanceScore(data);
    const strengths = [];

    if (score === 1) {
      strengths.push("Your team is highly effective at conducting retrospectives.");
      strengths.push("The overall trend is strongly improving.");
      strengths.push("Your team is demonstrating strong engagement and participation.");
    } else if (score === -1) {
      strengths.push("Your team's retrospective practices are showing signs of decline.");
      strengths.push("The overall trend is declining.");
      strengths.push("There might be areas where practices are not as effective as they were.");
    } else {
      strengths.push("Your team's retrospective practices are stable.");
      strengths.push("The overall trend is stable.");
      strengths.push("Your team is maintaining a consistent approach to retrospectives.");
    }

    return strengths;
  };

  // Get current status based on progress data
  const getCurrentStatus = (data) => {
    const score = calculatePerformanceScore(data);
    const status = [];

    if (score === 1) {
      status.push("Your team is currently performing at an excellent level.");
      status.push("The overall trend is strongly improving.");
      status.push("Your team is demonstrating strong engagement and participation.");
    } else if (score === -1) {
      status.push("Your team's retrospective practices are currently showing signs of decline.");
      status.push("The overall trend is declining.");
      status.push("There might be areas where practices are not as effective as they were.");
    } else {
      status.push("Your team's retrospective practices are currently stable.");
      status.push("The overall trend is stable.");
      status.push("Your team is maintaining a consistent approach to retrospectives.");
    }

    return status;
  };

  // Get areas for improvement based on progress data
  const getImprovementAreas = (data) => {
    const score = calculatePerformanceScore(data);
    const areas = [];

    if (score === -1) {
      areas.push("Identify specific areas where practices are declining and develop actionable plans to address them.");
      areas.push("Conduct a retrospective to understand the root causes of the decline.");
      areas.push("Re-evaluate and refine your retrospective process to ensure it remains relevant and effective.");
    } else if (score === 1) {
      areas.push("Continue to foster a culture of continuous improvement and encourage team members to share their perspectives.");
      areas.push("Regularly review and adjust your retrospective processes to ensure they remain effective.");
      areas.push("Identify new areas for improvement and incorporate them into your retrospective routine.");
    } else {
      areas.push("Regularly review and adjust your retrospective processes to ensure they remain effective.");
      areas.push("Identify new areas for improvement and incorporate them into your retrospective routine.");
    }

    return areas;
  };

  const toggleDetailedTable = () => {
    setIsDetailedTableCollapsed(!isDetailedTableCollapsed);
  };

  return (
    <div className="retro-boards-page">
      <div className="container">
        {/* Header */}
        <div className="header">
          <button 
            className="btn btn-secondary" 
            onClick={onBack}
            style={{ marginBottom: '20px' }}
          >
            <ArrowLeft size={20} style={{ marginRight: '8px' }} />
            Back to Teams
          </button>
          
          <h1>Retro Boards</h1>
          <p>Retrospective boards for team: <strong>{teamName || 'Unknown Team'}</strong></p>
        </div>

        {/* Control Buttons */}
        <div className="card">
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button 
            className="btn" 
            onClick={fetchRetroBoards} 
            disabled={loading}
          >
            {loading ? <Loader size={20} /> : <RefreshCw size={20} />}
            {loading ? 'Loading...' : 'Refresh Retro Boards'}
          </button>
            
            <button 
              className="btn btn-progress" 
              onClick={analyzeTeamProgress}
              disabled={analyzingProgress || retroBoards.length === 0}
            >
              {analyzingProgress ? <Loader size={20} /> : <BarChart3 size={20} />}
              {analyzingProgress ? 'Analyzing...' : 'Team Progress'}
            </button>
          </div>
        </div>

        {/* Team Progress Analysis */}
        {showProgress && progressData && (
          <div className="progress-analysis">
            <div className="progress-header">
              <Target size={24} />
              <h2>Team Progress Analysis</h2>
              <button 
                className="close-progress-btn"
                onClick={() => setShowProgress(false)}
              >
                ×
              </button>
            </div>
            
            <div className="progress-overview">
              <div className="progress-stat">
                <div className="stat-number">{progressData.totalBoards}</div>
                <div className="stat-label">Total Retro Boards</div>
              </div>
              <div className="progress-stat">
                <div className="stat-number">{progressData.recentActivity}</div>
                <div className="stat-label">Recent (30 days)</div>
              </div>
              <div className="progress-stat">
                <div className="stat-number">{Math.round(progressData.averageItemsPerBoard)}</div>
                <div className="stat-label">Avg Items/Board</div>
              </div>
              <div className="progress-stat">
                <div className={`stat-status ${progressData.overallStatus}`}>
                  {progressData.overallStatus.replace('-', ' ').toUpperCase()}
                </div>
                <div className="stat-label">Overall Status</div>
              </div>
            </div>

            {/* Performance Summary Chart */}
            <div className="performance-summary">
              <h3>📈 Team Performance Summary</h3>
              <div className="performance-indicator">
                <div className="performance-score">
                  <div className="score-circle">
                    <span className="score-number">{calculatePerformanceScore(progressData)}</span>
                    <span className="score-label">Score</span>
                  </div>
                </div>
                <div className="performance-details">
                  <div className="performance-message">
                    {getPerformanceMessage(progressData)}
                  </div>
                  <div className="performance-recommendations">
                    {getPerformanceRecommendations(progressData)}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Classification Comparison Analysis */}
            <div className="ai-classification-comparison">
              <h4>🤖 AI Classification Comparison Analysis</h4>
              
              {/* Collapsible Detailed Table */}
              <div className="collapsible-table">
                <div className="table-header-toggle" onClick={toggleDetailedTable}>
                  <div className="toggle-content">
                    <span className="toggle-icon">
                      {isDetailedTableCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                    </span>
                    <span className="toggle-title">📊 Detailed AI Classification Analysis</span>
                    <span className="toggle-subtitle">
                      {isDetailedTableCollapsed ? 'Click to expand detailed breakdown' : 'Click to collapse'}
                    </span>
                  </div>
                  <div className="toggle-status">
                    {isDetailedTableCollapsed ? 'Collapsed' : 'Expanded'}
                  </div>
                </div>
                
                <div className={`table-content ${isDetailedTableCollapsed ? 'collapsed' : 'expanded'}`}>
                  <div className="breakdown-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Retrospective</th>
                          <th>Date</th>
                          <th>Good Points</th>
                          <th>Bad Points</th>
                          <th>Unknown</th>
                          <th>Total Items</th>
                          <th>Positive Ratio</th>
                        </tr>
                      </thead>
                      <tbody>
                        {progressData.classificationData.map((retro, index) => (
                          <tr key={retro.boardId}>
                            <td>{retro.boardName}</td>
                            <td>{new Date(retro.date).toLocaleDateString()}</td>
                            <td className="good-points">{retro.goodPoints}</td>
                            <td className="bad-points">{retro.badPoints}</td>
                            <td className="unknown-points">{retro.unknownPoints}</td>
                            <td>{retro.totalItems}</td>
                            <td className={`ratio ${retro.positiveRatio > 60 ? 'positive' : retro.positiveRatio < 40 ? 'negative' : 'neutral'}`}>
                              {retro.positiveRatio.toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              {/* Performance Summary Table (Always Visible) */}
              <div className="breakdown-table">
                <table>
                  <thead>
                    <tr>
                      <th>Retrospective</th>
                      <th>Date</th>
                      <th>Total Items</th>
                      <th>Good Points</th>
                      <th>Bad Points</th>
                      <th>Positive Ratio</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {progressData.classificationData.map((retro, index) => (
                      <tr key={retro.boardId}>
                        <td>{retro.boardName}</td>
                        <td>{new Date(retro.date).toLocaleDateString()}</td>
                        <td>{retro.totalItems}</td>
                        <td className="good-points">{retro.goodPoints}</td>
                        <td className="bad-points">{retro.badPoints}</td>
                        <td className="ratio">
                          {retro.positiveRatio.toFixed(1)}%
                        </td>
                        <td>
                          <span className={`status-indicator ${retro.positiveRatio > 60 ? 'positive' : retro.positiveRatio < 40 ? 'negative' : 'neutral'}`}>
                            {retro.positiveRatio > 60 ? '✅ Positive' : 
                             retro.positiveRatio < 40 ? '⚠️ Needs Attention' : '⚖️ Balanced'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Classification Trends Line Chart */}
              <div className="line-chart-container">
                <h5>📈 Classification Trends Over Time</h5>
                <div className="chart-description">
                  <p>Track how good points, bad points, and unknown items change across retrospectives</p>
                </div>
                <div className="line-chart">
                  <svg width="100%" height="300" viewBox="0 0 800 300">
                    {(() => {
                      const sortedData = [...progressData.classificationData].sort((a, b) => 
                        new Date(a.date) - new Date(b.date)
                      );
                      
                      if (sortedData.length < 2) return (
                        <text x="400" y="150" textAnchor="middle" fill="#6c757d" fontSize="16">
                          Need at least 2 retrospectives to show trends
                        </text>
                      );
                      
                      const margin = { top: 30, right: 40, bottom: 50, left: 60 };
                      const width = 800 - margin.left - margin.right;
                      const height = 300 - margin.top - margin.bottom;
                      
                      // Find max values for scaling
                      const maxGood = Math.max(...sortedData.map(d => d.goodPoints));
                      const maxBad = Math.max(...sortedData.map(d => d.badPoints));
                      const maxUnknown = Math.max(...sortedData.map(d => d.unknownPoints));
                      const maxValue = Math.max(maxGood, maxBad, maxUnknown, 1);
                      
                      // Scale functions
                      const xScale = (index) => margin.left + (index / (sortedData.length - 1)) * width;
                      const yScale = (value) => margin.top + height - (value / maxValue) * height;
                      
                      // Generate path data for each line
                      const generatePath = (dataKey) => {
                        return sortedData.map((d, i) => {
                          const x = xScale(i);
                          const y = yScale(d[dataKey]);
                          return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
                        }).join(' ');
                      };
                      
                      // Generate points for each line
                      const generatePoints = (dataKey, color) => {
                        return sortedData.map((d, i) => {
                          const x = xScale(i);
                          const y = yScale(d[dataKey]);
                          return (
                            <circle
                              key={`${dataKey}-${i}`}
                              cx={x}
                              cy={y}
                              r="5"
                              fill={color}
                              stroke="white"
                              strokeWidth="2"
                              className="chart-point"
                              style={{ cursor: 'pointer' }}
                            />
                          );
                        });
                      };
                      
                      // Generate X-axis labels
                      const xAxisLabels = sortedData.map((d, i) => {
                        const x = xScale(i);
                        const date = new Date(d.date);
                        const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        
                        return (
                          <text
                            key={i}
                            x={x}
                            y={height + margin.top + 25}
                            textAnchor="middle"
                            fill="#6c757d"
                            fontSize="12"
                            className="axis-label"
                          >
                            {label}
                          </text>
                        );
                      });
                      
                      // Generate Y-axis labels
                      const yAxisLabels = [];
                      for (let i = 0; i <= 5; i++) {
                        const value = (maxValue / 5) * i;
                        const y = yScale(value);
                        yAxisLabels.push(
                          <text
                            key={i}
                            x={margin.left - 15}
                            y={y + 4}
                            textAnchor="end"
                            fill="#6c757d"
                            fontSize="12"
                            className="axis-label"
                          >
                            {Math.round(value)}
                          </text>
                        );
                      }
                      
                      return (
                        <>
                          {/* Grid lines */}
                          {yAxisLabels.map((_, i) => {
                            const y = yScale((maxValue / 5) * i);
                            return (
                              <line
                                key={`grid-${i}`}
                                x1={margin.left}
                                y1={y}
                                x2={width + margin.left}
                                y2={y}
                                stroke="rgba(108, 117, 125, 0.1)"
                                strokeWidth="1"
                                strokeDasharray="3,3"
                                className="chart-grid"
                              />
                            );
                          })}
                          
                          {/* Lines */}
                          <path
                            d={generatePath('goodPoints')}
                            stroke="#28a745"
                            strokeWidth="3"
                            fill="none"
                            className="chart-line good"
                          />
                          <path
                            d={generatePath('badPoints')}
                            stroke="#dc3545"
                            strokeWidth="3"
                            fill="none"
                            className="chart-line bad"
                          />
                          <path
                            d={generatePath('unknownPoints')}
                            stroke="#6c757d"
                            strokeWidth="3"
                            fill="none"
                            className="chart-line unknown"
                          />
                          
                          {/* Points */}
                          {generatePoints('goodPoints', '#28a745')}
                          {generatePoints('badPoints', '#dc3545')}
                          {generatePoints('unknownPoints', '#6c757d')}
                          
                          {/* Axes */}
                          <line
                            x1={margin.left}
                            y1={margin.top}
                            x2={margin.left}
                            y2={height + margin.top}
                            stroke="rgba(108, 117, 125, 0.3)"
                            strokeWidth="2"
                          />
                          <line
                            x1={margin.left}
                            y1={height + margin.top}
                            x2={width + margin.left}
                            y2={height + margin.top}
                            stroke="rgba(108, 117, 125, 0.3)"
                            strokeWidth="2"
                          />
                          
                          {/* Labels */}
                          {xAxisLabels}
                          {yAxisLabels}
                          
                          {/* Chart title */}
                          <text
                            x={400}
                            y={20}
                            textAnchor="middle"
                            fill="#495057"
                            fontSize="14"
                            fontWeight="600"
                            className="chart-title"
                          >
                            Classification Points Over Time
                          </text>
                          
                          {/* Y-axis label */}
                          <text
                            x={30}
                            y={150}
                            textAnchor="middle"
                            fill="#6c757d"
                            fontSize="12"
                            fontWeight="500"
                            className="y-axis-label"
                            transform="rotate(-90, 30, 150)"
                          >
                            Number of Points
                          </text>
                          
                          {/* X-axis label */}
                          <text
                            x={400}
                            y={height + margin.top + 45}
                            textAnchor="middle"
                            fill="#6c757d"
                            fontSize="12"
                            fontWeight="500"
                            className="x-axis-label"
                          >
                            Retrospective Dates
                          </text>
                        </>
                      );
                    })()}
                  </svg>
                </div>
                
                {/* Chart Legend */}
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="legend-color good"></div>
                    <span className="legend-label">Good Points</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color bad"></div>
                    <span className="legend-label">Bad Points</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color unknown"></div>
                    <span className="legend-label">Unknown Points</span>
                  </div>
                </div>
                
                {/* Chart Stats Summary */}
                <div className="chart-stats-summary">
                  <div className="chart-stat-item">
                    <span className="chart-stat-value">{progressData.totalGoodPoints}</span>
                    <span className="chart-stat-label">Total Good</span>
                  </div>
                  <div className="chart-stat-item">
                    <span className="chart-stat-value">{progressData.totalBadPoints}</span>
                    <span className="chart-stat-label">Total Bad</span>
                  </div>
                  <div className="chart-stat-item">
                    <span className="chart-stat-value">{progressData.totalUnknownPoints}</span>
                    <span className="chart-stat-label">Total Unknown</span>
                  </div>
                  <div className="chart-stat-item">
                    <span className="chart-stat-value">{progressData.overallPositiveRatio.toFixed(1)}%</span>
                    <span className="chart-stat-label">Positive Ratio</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Classification Trends */}
            <div className="classification-trends">
              <h4>📈 AI Classification Trends (Last 6 Months)</h4>
              <div className="trends-grid">
                <div className="trend-item">
                  <div className="trend-header">
                    <span>Good Points Trend</span>
                    {getTrendIcon(progressData.trends.goodPoints)}
                  </div>
                  <div className="trend-details">
                    <span className={`trend-direction ${progressData.trends.goodPoints.direction}`}>
                      {progressData.trends.goodPoints.direction}
                    </span>
                    <span className="trend-change">
                      {progressData.trends.goodPoints.change > 0 ? '+' : ''}{progressData.trends.goodPoints.change}%
                    </span>
                  </div>
                </div>

                <div className="trend-item">
                  <div className="trend-header">
                    <span>Bad Points Trend</span>
                    {getTrendIcon(progressData.trends.badPoints)}
                  </div>
                  <div className="trend-details">
                    <span className={`trend-direction ${progressData.trends.badPoints.direction}`}>
                      {progressData.trends.badPoints.direction}
                    </span>
                    <span className="trend-change">
                      {progressData.trends.badPoints.change > 0 ? '+' : ''}{progressData.trends.badPoints.change}%
                    </span>
                  </div>
                </div>

                <div className="trend-item">
                  <div className="trend-header">
                    <span>Positive Ratio Trend</span>
                    {getTrendIcon(progressData.trends.positiveRatio)}
                  </div>
                  <div className="trend-details">
                    <span className={`trend-direction ${progressData.trends.positiveRatio.direction}`}>
                      {progressData.trends.positiveRatio.direction}
                    </span>
                    <span className="trend-change">
                      {progressData.trends.positiveRatio.change > 0 ? '+' : ''}{progressData.trends.positiveRatio.change}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Classification Insights */}
            <div className="classification-insights">
              <h4>💡 AI Classification Insights</h4>
              <div className="insights-grid">
                {(() => {
                  const insights = [];
                  
                  // Overall team sentiment
                  if (progressData.overallPositiveRatio > 60) {
                    insights.push({
                      icon: '🎉',
                      title: 'Excellent Team Sentiment',
                      description: `Your team has a ${progressData.overallPositiveRatio.toFixed(1)}% positive sentiment ratio, indicating a very healthy and positive team culture.`
                    });
                  } else if (progressData.overallPositiveRatio < 40) {
                    insights.push({
                      icon: '🚨',
                      title: 'Team Sentiment Needs Attention',
                      description: `Your team has a ${progressData.overallPositiveRatio.toFixed(1)}% positive sentiment ratio. Consider addressing team concerns and improving processes.`
                    });
                  } else {
                    insights.push({
                      icon: '⚖️',
                      title: 'Balanced Team Sentiment',
                      description: `Your team has a balanced sentiment with ${progressData.overallPositiveRatio.toFixed(1)}% positive points.`
                    });
                  }

                  // Trend analysis
                  if (progressData.trends.positiveRatio.direction === 'up') {
                    insights.push({
                      icon: '📈',
                      title: 'Improving Team Sentiment',
                      description: `Your team's positive sentiment is trending upward by ${progressData.trends.positiveRatio.change}%, showing continuous improvement.`
                    });
                  } else if (progressData.trends.positiveRatio.direction === 'down') {
                    insights.push({
                      icon: '📉',
                      title: 'Declining Team Sentiment',
                      description: `Your team's positive sentiment is declining by ${Math.abs(progressData.trends.positiveRatio.change)}%. Investigate recent changes.`
                    });
                  }

                  // Best performing retrospective
                  const bestRetro = progressData.classificationData
                    .sort((a, b) => b.positiveRatio - a.positiveRatio)[0];
                  if (bestRetro && bestRetro.positiveRatio > 70) {
                    insights.push({
                      icon: '🏆',
                      title: 'Best Performing Retrospective',
                      description: `"${bestRetro.boardName}" had the highest positive ratio at ${bestRetro.positiveRatio.toFixed(1)}%.`
                    });
                  }

                  // Areas for improvement
                  const worstRetro = progressData.classificationData
                    .sort((a, b) => a.positiveRatio - b.positiveRatio)[0];
                  if (worstRetro && worstRetro.positiveRatio < 30) {
                    insights.push({
                      icon: '🎯',
                      title: 'Focus Area for Improvement',
                      description: `"${worstRetro.boardName}" had the lowest positive ratio at ${worstRetro.positiveRatio.toFixed(1)}%. Review this session.`
                    });
                  }

                  return insights.map((insight, index) => (
                    <div key={index} className="insight-card">
                      <div className="insight-icon">{insight.icon}</div>
                      <div className="insight-title">{insight.title}</div>
                      <div className="insight-description">{insight.description}</div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="error">
            <AlertCircle size={20} />
            <span style={{ marginLeft: '8px' }}>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading">
            <Loader size={24} />
            <span style={{ marginLeft: '12px' }}>Fetching retro boards...</span>
          </div>
        )}

        {/* Retro Boards Grid */}
        {!loading && retroBoards.length > 0 && (
          <div className="grid">
            {retroBoards.map((board, index) => {
              // Ensure we have a valid ID for the key
              const boardId = board.id || `board-${index}`;
              const boardTitle = board.title || 'Untitled Retro';
              const boardDescription = board.description || 'No description available';
              const boardStatus = board.activePhase || board.status || 'draft';
              const createdBy = getCreatedByDisplayName(board.createdBy);
              const isAnonymous = Boolean(board.isAnonymous);
              const isPublic = Boolean(board.isPublic);
              const maxVotes = parseInt(board.maxVotesPerUser) || 0;
              const columns = Array.isArray(board.columns) ? board.columns : [];

              return (
                <div 
                  key={boardId} 
                  className="card retro-board-card"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleRetroClick(board)}
                >
                  <div className="retro-board-header">
                    <div className="retro-board-title">{boardTitle}</div>
                    <div className="retro-board-status">
                      <span className={`status-badge ${getStatusColor(boardStatus)}`}>
                        {getStatusText(boardStatus)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="retro-board-description">
                    {boardDescription}
                  </div>
                  
                  <div className="retro-board-meta">
                    {board.createdDate && (
                      <span>
                        <Calendar size={14} style={{ marginRight: '4px' }} />
                        Created: {formatDate(board.createdDate)}
                      </span>
                    )}
                    {board.modifiedDate && (
                      <span>
                        <Clock size={14} style={{ marginRight: '4px' }} />
                        Modified: {formatDateTime(board.modifiedDate)}
                      </span>
                    )}
                  </div>

                  {/* Board Details */}
                  <div style={{ marginTop: '12px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {createdBy && createdBy !== 'Unknown' && (
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        fontSize: '0.8rem', 
                        color: '#495057',
                        padding: '4px 8px',
                        background: '#f8f9fa',
                        borderRadius: '6px'
                      }}>
                        <User size={12} style={{ marginRight: '4px' }} />
                        {createdBy}
                      </div>
                    )}
                    
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      fontSize: '0.8rem', 
                      color: isAnonymous ? '#dc3545' : '#28a745',
                      padding: '4px 8px',
                      background: '#f8f9fa',
                      borderRadius: '6px'
                    }}>
                      {isAnonymous ? <EyeOff size={12} /> : <Eye size={12} />}
                      <span style={{ marginLeft: '4px' }}>
                        {isAnonymous ? 'Anonymous' : 'Named'}
                      </span>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      fontSize: '0.8rem', 
                      color: isPublic ? '#28a745' : '#6c757d',
                      padding: '4px 8px',
                      background: '#f8f9fa',
                      borderRadius: '6px'
                    }}>
                      {isPublic ? <Eye size={12} /> : <EyeOff size={12} />}
                      <span style={{ marginLeft: '4px' }}>
                        {isPublic ? 'Public' : 'Private'}
                      </span>
                    </div>
                    
                    {maxVotes > 0 && (
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        fontSize: '0.8rem', 
                        color: '#007bff',
                        padding: '4px 8px',
                        background: '#f8f9fa',
                        borderRadius: '6px'
                      }}>
                        <Vote size={12} style={{ marginRight: '4px' }} />
                        Max {maxVotes} votes
                      </div>
                    )}
                  </div>

                  {/* Columns Information */}
                  {columns.length > 0 && (
                    <div style={{ marginTop: '16px' }}>
                      <div style={{ 
                        fontSize: '0.8rem', 
                        fontWeight: '600', 
                        color: '#495057', 
                        marginBottom: '8px' 
                      }}>
                        Board Columns ({columns.length}):
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {columns.map((column, colIndex) => {
                          const columnId = column.id || `col-${colIndex}`;
                          const columnTitle = column.title || 'Untitled Column';
                          const columnColor = column.accentColor || '#6c757d';
                          
                          return (
                            <div key={columnId} style={{
                              padding: '4px 8px',
                              background: columnColor,
                              color: 'white',
                              borderRadius: '4px',
                              fontSize: '0.7rem',
                              fontWeight: '500'
                            }}>
                              {columnTitle}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Click to view details */}
                  <div style={{ 
                    marginTop: '16px', 
                    padding: '8px', 
                    background: '#667eea', 
                    color: 'white', 
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    textAlign: 'center',
                    fontWeight: '600'
                  }}>
                    <ExternalLink size={14} style={{ marginRight: '6px' }} />
                    Click to view Details
                  </div>

                  {/* Additional Board Details */}
                  <div style={{ 
                    marginTop: '16px', 
                    padding: '8px', 
                    background: '#f8f9fa', 
                    borderRadius: '6px',
                    fontSize: '0.7rem', 
                    color: '#6c757d',
                    fontFamily: 'monospace'
                  }}>
                    <strong>Board ID:</strong> {boardId}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* No Retro Boards State */}
        {!loading && retroBoards.length === 0 && !error && (
          <div className="card">
            <div style={{ textAlign: 'center', color: '#6c757d' }}>
              <CheckCircle size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <p>No retro boards found for this team.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RetroBoards;
