import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  RefreshCw, 
  Download, 
  Filter, 
  Search, 
  TrendingUp, 
  TrendingDown,
  Users,
  Award,
  CheckCircle,
  AlertTriangle,
  XCircle,
  BarChart3,
  Info,
  Calculator,
  Target,
  Clock,
  Users as UsersIcon
} from 'lucide-react';

function TeamComparison({ onBack }) {
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    project: 'all',
    timeframe: 'all',
    performance: 'all'
  });
  const [metrics, setMetrics] = useState([]);
  const [overallStats, setOverallStats] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(5); // Process only 5 projects at a time
  const [processedProjects, setProcessedProjects] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showScoringGuide, setShowScoringGuide] = useState(false);

  // Fetch projects first
  const fetchProjects = async () => {
    setLoadingProjects(true);
    setError(null);
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      if (data.success && data.projects) {
        setProjects(data.projects);
        console.log(`Found ${data.projects.length} projects`);
      } else {
        setError('Failed to fetch projects');
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to fetch projects');
    } finally {
      setLoadingProjects(false);
    }
  };

  // Process projects in batches
  const processProjectsBatch = async (projectBatch) => {
    const batchResults = [];
    
    for (const project of projectBatch) {
      try {
        console.log(`Processing project: ${project.name}`);
        
        // Fetch teams for this project
        const teamsResponse = await fetch(`/api/projects/${project.name}/teams`, {
          method: 'POST'
        });
        const teamsData = await teamsResponse.json();
        
        if (teamsData.success && teamsData.teams) {
          console.log(`Found ${teamsData.teams.length} teams in ${project.name}`);
          
          // Process each team
          for (const team of teamsData.teams) {
            try {
              // Try to fetch retrospective data (but don't wait too long)
              const retroResponse = await fetch(`/api/teams/${team.id}/retroboards`);
              const retroData = await retroResponse.json();
              
              let retroBoards = [];
              if (retroData.success && retroData.retroBoards) {
                retroBoards = retroData.retroBoards;
              }
              
              const teamMetrics = analyzeTeamPerformance(team, retroBoards, project);
              batchResults.push(teamMetrics);
              
            } catch (error) {
              console.error(`Error processing team ${team.id}:`, error);
              // Still create team metrics even if retrospective data fails
              const teamMetrics = analyzeTeamPerformance(team, [], project);
              batchResults.push(teamMetrics);
            }
          }
        }
        
        setProcessedProjects(prev => prev + 1);
        
      } catch (error) {
        console.error(`Error processing project ${project.name}:`, error);
        // Continue with next project
      }
    }
    
    return batchResults;
  };

  // Main function to fetch all teams data with pagination
  const fetchAllTeamsData = async () => {
    if (projects.length === 0) {
      console.log('No projects available');
      return;
    }
    
    setIsProcessing(true);
    setLoading(true);
    setError(null);
    setTeams([]);
    setMetrics([]);
    setProcessedProjects(0);
    
    try {
      console.log(`Starting to process ${projects.length} projects in batches of ${projectsPerPage}`);
      
      const allTeamMetrics = [];
      const allTeams = [];
      
      // Process projects in batches
      for (let i = 0; i < projects.length; i += projectsPerPage) {
        const batch = projects.slice(i, i + projectsPerPage);
        console.log(`Processing batch ${Math.floor(i / projectsPerPage) + 1}: ${batch.map(p => p.name).join(', ')}`);
        
        const batchResults = await processProjectsBatch(batch);
        allTeamMetrics.push(...batchResults);
        
        // Update teams list as we go
        const batchTeams = batchResults.map(metric => metric.team);
        allTeams.push(...batchTeams);
        
        // Update state incrementally
        setTeams(prev => [...prev, ...batchTeams]);
        setMetrics(prev => [...prev, ...batchResults]);
        
        // Small delay to prevent overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      console.log(`Completed processing. Total teams: ${allTeamMetrics.length}`);
      
      // Calculate overall stats
      const stats = calculateOverallStats(allTeamMetrics);
      setOverallStats(stats);
      
    } catch (error) {
      console.error('Error in batch processing:', error);
      setError('Error processing projects. Please try again.');
    } finally {
      setIsProcessing(false);
      setLoading(false);
    }
  };

  // Calculate performance score
  const calculatePerformanceScore = (data) => {
    let score = 0;

    // Base score from number of retrospectives
    score += Math.min(data.totalBoards * 10, 50);

    // Recent activity bonus
    score += Math.min(data.recentActivity * 15, 30);

    // Team size adjustment
    const teamSizeFactor = Math.min(data.teamSize / 5, 1);
    score *= teamSizeFactor;

    // Ensure minimum score for teams with no retrospective data
    if (score === 0) {
      score = 20; // Base score for teams without retrospectives
    }

    return Math.round(score);
  };

  // Analyze team performance
  const analyzeTeamPerformance = (team, retroBoards, project) => {
    const totalBoards = retroBoards.length;
    const recentActivity = retroBoards.filter(board => {
      const boardDate = new Date(board.createdDate || board.lastUpdateTime);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return boardDate > thirtyDaysAgo;
    }).length;

    const score = calculatePerformanceScore({
      totalBoards,
      recentActivity,
      teamSize: team.memberCount || 1
    });

    let status = 'Needs Improvement';
    if (score >= 80) status = 'Excellent';
    else if (score >= 60) status = 'Good';
    else if (score >= 40) status = 'Average';

    return {
      team,
      project,
      totalBoards,
      recentActivity,
      score,
      status,
      teamSize: team.memberCount || 1
    };
  };

  // Calculate overall statistics
  const calculateOverallStats = (teamMetrics) => {
    if (teamMetrics.length === 0) return {};

    const totalTeams = teamMetrics.length;
    const avgScore = teamMetrics.reduce((sum, metric) => sum + metric.score, 0) / totalTeams;
    const excellentTeams = teamMetrics.filter(m => m.status === 'Excellent').length;
    const goodTeams = teamMetrics.filter(m => m.status === 'Good').length;
    const averageTeams = teamMetrics.filter(m => m.status === 'Average').length;
    const needsImprovementTeams = teamMetrics.filter(m => m.status === 'Needs Improvement').length;

    return {
      totalTeams,
      avgScore: Math.round(avgScore),
      excellentTeams,
      goodTeams,
      averageTeams,
      needsImprovementTeams
    };
  };

  // Filter teams based on current filters
  const getFilteredTeams = () => {
    let filtered = metrics;

    if (filters.project !== 'all') {
      filtered = filtered.filter(m => m.project.name === filters.project);
    }

    if (filters.performance !== 'all') {
      filtered = filtered.filter(m => m.status === filters.performance);
    }

    if (searchTerm) {
      filtered = filtered.filter(m => 
        m.team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.project.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  // Export to CSV
  const exportToCSV = () => {
    const filtered = getFilteredTeams();
    const csvContent = [
      ['Team Name', 'Project', 'Performance Score', 'Status', 'Total Retro Boards', 'Recent Activity', 'Team Size'],
      ...filtered.map(m => [
        m.team.name,
        m.project.name,
        m.score,
        m.status,
        m.totalBoards,
        m.recentActivity,
        m.teamSize
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'team-performance-comparison.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Excellent': return <Award size={16} style={{ color: '#ffd700' }} />;
      case 'Good': return <CheckCircle size={16} style={{ color: '#28a745' }} />;
      case 'Average': return <AlertTriangle size={16} style={{ color: '#ffc107' }} />;
      case 'Needs Improvement': return <XCircle size={16} style={{ color: '#dc3545' }} />;
      default: return <Users size={16} />;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredTeams = getFilteredTeams();

  return (
    <div className="team-comparison">
      <div className="header">
        <button onClick={onBack} className="back-button">
          <ArrowLeft size={20} />
          Back to Projects
        </button>
        <h1>Team Performance Comparison</h1>
        <button onClick={fetchAllTeamsData} className="refresh-button" disabled={isProcessing}>
          <RefreshCw size={20} className={isProcessing ? 'spinning' : ''} />
          {isProcessing ? 'Processing...' : 'Analyze Teams'}
        </button>
      </div>

      {/* Scoring Guide Toggle */}
      <div className="scoring-guide-toggle">
        <button 
          onClick={() => setShowScoringGuide(!showScoringGuide)} 
          className="guide-toggle-button"
        >
          <Info size={18} />
          {showScoringGuide ? 'Hide' : 'Show'} Scoring & Analysis Guide
        </button>
      </div>

      {/* Scoring Guide Section */}
      {showScoringGuide && (
        <div className="scoring-guide">
          <div className="guide-header">
            <Calculator size={24} />
            <h2>How Scores Are Calculated</h2>
            <p>Understanding the Team Performance Scoring System</p>
          </div>

          <div className="guide-content">
            <div className="guide-section">
              <h3><Target size={18} /> Scoring Criteria</h3>
              <div className="criteria-grid">
                <div className="criteria-item">
                  <div className="criteria-header">
                    <span className="criteria-icon">📊</span>
                    <strong>Retrospective Boards</strong>
                  </div>
                  <p>Base score from the number of retrospective boards</p>
                  <div className="criteria-details">
                    <span>• 1 Board = 10 points</span>
                    <span>• Maximum: 50 points</span>
                    <span>• Shows team engagement in retrospectives</span>
                  </div>
                </div>

                <div className="criteria-item">
                  <div className="criteria-header">
                    <span className="criteria-icon">⏰</span>
                    <strong>Recent Activity</strong>
                  </div>
                  <p>Bonus points for recent retrospective activity</p>
                  <div className="criteria-details">
                    <span>• 1 Recent Board = 15 points</span>
                    <span>• Maximum: 30 points</span>
                    <span>• Recent = Last 30 days</span>
                  </div>
                </div>

                <div className="criteria-item">
                  <div className="criteria-header">
                    <span className="criteria-icon">👥</span>
                    <strong>Team Size Factor</strong>
                  </div>
                  <p>Adjustment based on team member count</p>
                  <div className="criteria-details">
                    <span>• 5+ members = 100% score</span>
                    <span>• Smaller teams = proportional adjustment</span>
                    <span>• Encourages team collaboration</span>
                  </div>
                </div>

                <div className="criteria-item">
                  <div className="criteria-header">
                    <span className="criteria-icon">🛡️</span>
                    <strong>Base Score Protection</strong>
                  </div>
                  <p>Minimum score for teams without retrospectives</p>
                  <div className="criteria-details">
                    <span>• Minimum: 20 points</span>
                    <span>• Prevents 0 scores</span>
                    <span>• Fair assessment for new teams</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="guide-section">
              <h3><BarChart3 size={18} /> Analysis Guide</h3>
              <div className="analysis-grid">
                <div className="analysis-item excellent">
                  <div className="analysis-header">
                    <Award size={20} />
                    <strong>Excellent (80-100 points)</strong>
                  </div>
                  <p>High-performing teams with strong retrospective practices</p>
                  <ul>
                    <li>Multiple retrospective boards</li>
                    <li>Recent activity within 30 days</li>
                    <li>Good team size and collaboration</li>
                    <li>Consistent improvement focus</li>
                  </ul>
                </div>

                <div className="analysis-item good">
                  <div className="analysis-header">
                    <CheckCircle size={20} />
                    <strong>Good (60-79 points)</strong>
                  </div>
                  <p>Teams with solid retrospective foundations</p>
                  <ul>
                    <li>Regular retrospective meetings</li>
                    <li>Some recent activity</li>
                    <li>Room for improvement</li>
                    <li>Good team dynamics</li>
                  </ul>
                </div>

                <div className="analysis-item average">
                  <div className="analysis-header">
                    <AlertTriangle size={20} />
                    <strong>Average (40-59 points)</strong>
                  </div>
                  <p>Teams with basic retrospective practices</p>
                  <ul>
                    <li>Few retrospective boards</li>
                    <li>Limited recent activity</li>
                    <li>Need more engagement</li>
                    <li>Potential for growth</li>
                  </ul>
                </div>

                <div className="analysis-item needs-improvement">
                  <div className="analysis-header">
                    <XCircle size={20} />
                    <strong>Needs Improvement (20-39 points)</strong>
                  </div>
                  <p>Teams requiring retrospective implementation</p>
                  <ul>
                    <li>No or very few retrospectives</li>
                    <li>No recent activity</li>
                    <li>Need process improvement</li>
                    <li>Opportunity for coaching</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="guide-section">
              <h3><Info size={18} /> About This Score</h3>
              <div className="about-score">
                <div className="score-explanation">
                  <h4>What This Score Measures</h4>
                  <p>The Team Performance Score is a comprehensive metric that evaluates how effectively teams engage in retrospective practices and continuous improvement processes.</p>
                  
                  <h4>Key Benefits</h4>
                  <ul>
                    <li><strong>Continuous Improvement:</strong> Encourages regular reflection and learning</li>
                    <li><strong>Team Collaboration:</strong> Promotes team-based problem solving</li>
                    <li><strong>Process Visibility:</strong> Provides insights into team practices</li>
                    <li><strong>Performance Tracking:</strong> Enables progress monitoring over time</li>
                  </ul>

                  <h4>Important Notes</h4>
                  <ul>
                    <li>Scores are relative and should be used for improvement, not comparison</li>
                    <li>New teams may have lower scores initially</li>
                    <li>Focus on trends and improvement over absolute scores</li>
                    <li>Use scores to identify coaching and support opportunities</li>
                  </ul>

                  <h4>Formula Breakdown</h4>
                  <div className="formula">
                    <code>
                      Score = min(Retro Boards × 10, 50) + min(Recent Activity × 15, 30) × Team Size Factor
                    </code>
                    <p>Where Team Size Factor = min(Team Size ÷ 5, 1)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      {isProcessing && (
        <div className="progress-section">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(processedProjects / projects.length) * 100}%` }}
            ></div>
          </div>
          <p>Processing {processedProjects} of {projects.length} projects...</p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            This may take a few minutes. Processing in batches to avoid overwhelming the API.
          </p>
        </div>
      )}

      {/* Initial State */}
      {!loading && !isProcessing && teams.length === 0 && (
        <div className="initial-state">
          <BarChart3 size={64} style={{ opacity: 0.5, marginBottom: '20px' }} />
          <h2>Ready to Analyze Team Performance</h2>
          <p>Click "Analyze Teams" to start comparing team performance across all projects.</p>
          <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '10px' }}>
            This will analyze teams from {projects.length} projects and may take a few minutes.
          </p>
        </div>
      )}

      {/* Overall Statistics */}
      {Object.keys(overallStats).length > 0 && (
        <div className="overall-stats">
          <h2>Overall Performance Summary</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{overallStats.totalTeams}</div>
              <div className="stat-label">Total Teams</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{overallStats.avgScore}</div>
              <div className="stat-label">Average Score</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{overallStats.excellentTeams}</div>
              <div className="stat-label">Excellent</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{overallStats.goodTeams}</div>
              <div className="stat-label">Good</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{overallStats.averageTeams}</div>
              <div className="stat-label">Average</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{overallStats.needsImprovementTeams}</div>
              <div className="stat-label">Needs Improvement</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      {teams.length > 0 && (
        <div className="filters-section">
          <div className="filters-row">
            <div className="filter-group">
              <label>Project:</label>
              <select 
                value={filters.project} 
                onChange={(e) => setFilters(prev => ({ ...prev, project: e.target.value }))}
              >
                <option value="all">All Projects</option>
                {projects.map(project => (
                  <option key={project.id} value={project.name}>{project.name}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Performance:</label>
              <select 
                value={filters.performance} 
                onChange={(e) => setFilters(prev => ({ ...prev, performance: e.target.value }))}
              >
                <option value="all">All Levels</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Average">Average</option>
                <option value="Needs Improvement">Needs Improvement</option>
              </select>
            </div>
            <div className="search-group">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search teams or projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <button onClick={exportToCSV} className="export-button">
            <Download size={16} />
            Export to CSV
          </button>
        </div>
      )}

      {/* Teams Table */}
      {teams.length > 0 && (
        <div className="teams-table-container">
          <h2>Team Performance Details</h2>
          <div className="table-wrapper">
            <table className="teams-table">
              <thead>
                <tr>
                  <th>Team Name</th>
                  <th>Project</th>
                  <th>Performance Score</th>
                  <th>Status</th>
                  <th>Retro Boards</th>
                  <th>Recent Activity</th>
                  <th>Team Size</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeams.map((metric, index) => (
                  <tr key={`${metric.team.id}-${index}`}>
                    <td>
                      <div className="team-name">
                        <Users size={16} />
                        {metric.team.name}
                      </div>
                    </td>
                    <td>{metric.project.name}</td>
                    <td>
                      <div className="score-cell">
                        <span className={`score ${metric.score >= 80 ? 'excellent' : metric.score >= 60 ? 'good' : metric.score >= 40 ? 'average' : 'poor'}`}>
                          {metric.score}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="status-cell">
                        {getStatusIcon(metric.status)}
                        <span className={`status ${metric.status.toLowerCase().replace(' ', '-')}`}>
                          {metric.status}
                        </span>
                      </div>
                    </td>
                    <td>{metric.totalBoards}</td>
                    <td>{metric.recentActivity}</td>
                    <td>{metric.teamSize}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Results */}
      {teams.length > 0 && filteredTeams.length === 0 && (
        <div className="no-results">
          <p>No teams match your current filters.</p>
          <p>Try adjusting your search criteria or filters.</p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="error-message">
          <AlertTriangle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading && !isProcessing && (
        <div className="loading">
          <RefreshCw size={24} className="spinning" />
          <span>Loading team data...</span>
        </div>
      )}
    </div>
  );
}

export default TeamComparison;
