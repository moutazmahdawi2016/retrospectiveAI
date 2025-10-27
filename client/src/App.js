import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Calendar, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  AlertCircle,
  Loader,
  Users,
  Crown,
  ExternalLink,
  Info,
  BarChart3,
  TrendingUp,
  Filter
} from 'lucide-react';
import LandingPage from './components/LandingPage';
import RetroBoards from './components/RetroBoards';
import RetroDetail from './components/RetroDetail';
import InfoPage from './components/InfoPage';
import TeamComparison from './components/TeamComparison';

function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'projects', 'retroboards', 'retrodetail', 'info', or 'teamcomparison'
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedRetro, setSelectedRetro] = useState(null);
  const [selectedPortfolio, setSelectedPortfolio] = useState('all'); // Portfolio filter

  // Portfolio mapping based on project name
  const getPortfolioId = (projectName) => {
    const portfolioMap = {
      'Notification Gate': 1, 'SASO Acceptance Gate': 1, 'Reach': 1, 'SFDA Faseh': 1, 'SFDA.Faseh': 1, 'SFDA_Drugs_Registration_portal': 1, 'SFDA Ghad': 1, 'SFDA SDR': 1, 
      'Saber Commercial': 1, 'Saber Non-Commercial': 1, 'Tic Capsule': 1, 'Halal': 1, 'Maneh': 1,
      'Ehkaam': 2, 'Mwathiq': 2, 'MOJ_eAuction': 2, 'SBA Arbitration & Settlement': 2, 'Order Publish': 2, 'Thara': 2,
      'Alula Licenses & Permits': 3, 'CDF Portal': 3, 'Dayyaf': 3, 'MOC Abdea': 3, 
      'Makanak': 3, 'Maroof': 3, 'Bayyin': 4, 'Commercial Registration': 4, 'Etikal': 4,
      'Franchise': 4, 'NCFB': 4, 'ROSHN Marketplace': 4, 'SILZ': 4, 'Sijillaty': 4,
      'Sales': 4, 'Trade Mark & IPN': 4, 'Trade Names Mazadat': 4, 'نظام تقييم الامتثال': 4,
      'Brazil COO': 5, 'Certificate of Origin (COO)': 5, 'CertificateOfOrigen': 5, 'Clean Leeds': 5, 'Data Quality': 5,
      'Driving School': 5, 'Global COO SA': 5, 'MAAS - Makkah': 5, 'MAAS - Riyadh': 5,
      'MCC': 5, 'Oil Measurement': 5, 'Salvage & Spare Parts': 5, 'Taqyees platform': 5,
      'Vehicle Inspection': 5,
      'E-Delegation': 12, 'Tahaqaq': 12, 'Wathq': 12
    };
    
    // Check exact match first
    if (portfolioMap[projectName]) {
      return portfolioMap[projectName];
    }
    
    // Check partial matches
    for (const [key, value] of Object.entries(portfolioMap)) {
      if (projectName.includes(key) || key.includes(projectName)) {
        return value;
      }
    }
    
    return null; // No portfolio found
  };

  const getPortfolioName = (portfolioId) => {
    const portfolioNames = {
      1: 'Products Safety & Logistics',
      2: 'Justice and Urban Development',
      3: 'QoL & PIF',
      4: 'Enterprise Solutions',
      5: 'Mobility & Industrial Tech',
      12: 'Digital Venture'
    };
    return portfolioNames[portfolioId] || 'Uncategorized';
  };

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching projects...');
      const response = await axios.get('/api/projects');
      console.log('API Response:', response.data);
      console.log('Response structure:', {
        success: response.data.success,
        projects: response.data.projects,
        count: response.data.count,
        data: response.data.data
      });
      
      if (response.data.success) {
        // Try multiple possible locations for projects data
        let projectsData = response.data.projects || response.data.data?.value || [];
        
        // If we still don't have projects, try to extract from the raw response
        if (!projectsData || projectsData.length === 0) {
          console.log('No projects found in expected locations, checking raw response...');
          if (response.data.data && response.data.data.value) {
            projectsData = response.data.data.value;
            console.log('Found projects in data.value:', projectsData);
          }
        }
        
        console.log('Final projects data to set:', projectsData);
        setProjects(projectsData);
      } else {
        console.error('API returned success: false');
        setError('Failed to fetch projects');
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err.response?.data?.error || 'Failed to fetch projects from Azure DevOps');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async (projectName) => {
    setLoadingTeams(true);
    try {
      const response = await axios.post(`/api/projects/${projectName}/teams`);
      if (response.data.success) {
        setTeams(response.data.teams || []);
      }
    } catch (err) {
      console.error('Error fetching teams:', err);
      setTeams([]);
    } finally {
      setLoadingTeams(false);
    }
  };

  const handleProjectClick = (project) => {
    if (selectedProject?.id === project.id) {
      setSelectedProject(null);
      setTeams([]);
    } else {
      setSelectedProject(project);
      fetchTeams(project.name);
    }
  };

  const handleGetStarted = () => {
    setCurrentView('projects');
  };

  const handleTeamClick = (team) => {
    setSelectedTeam(team);
    setCurrentView('retroboards');
  };

  const handleRetroClick = (retroBoard) => {
    setSelectedRetro(retroBoard);
    setCurrentView('retrodetail');
  };

  const handleBackToTeams = () => {
    setCurrentView('projects');
    setSelectedTeam(null);
    setSelectedRetro(null);
  };

  const handleBackToRetroBoards = () => {
    setCurrentView('retroboards');
    setSelectedRetro(null);
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setTeams([]);
    setCurrentView('projects');
    setSelectedTeam(null);
    setSelectedRetro(null);
  };

  const handleShowInfo = () => {
    setCurrentView('info');
  };

  const handleBackFromInfo = () => {
    setCurrentView('projects');
  };

  const handleShowTeamComparison = () => {
    setCurrentView('teamcomparison');
  };

  const handleBackFromTeamComparison = () => {
    setCurrentView('projects');
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getProjectStats = () => {
    const totalProjects = projects.length;
    const publicProjects = projects.filter(p => p.visibility === 'public').length;
    const privateProjects = totalProjects - publicProjects;
    
    return { totalProjects, publicProjects, privateProjects };
  };

  const stats = getProjectStats();
  
  // Debug logging
  console.log('Current projects state:', projects);
  console.log('Projects length:', projects.length);
  console.log('Loading state:', loading);
  console.log('Error state:', error);

  // If we're viewing landing page, show that component
  if (currentView === 'landing') {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  // If we're viewing info page, show that component
  if (currentView === 'info') {
    return (
      <InfoPage onBack={handleBackFromInfo} />
    );
  }

  // If we're viewing team comparison, show that component
  if (currentView === 'teamcomparison') {
    return (
      <TeamComparison onBack={handleBackFromTeamComparison} />
    );
  }

  // If we're viewing retro detail, show that component
  if (currentView === 'retrodetail' && selectedRetro) {
    return (
      <RetroDetail 
        retrospectiveId={selectedRetro.id}
        onBack={handleBackToRetroBoards}
      />
    );
  }

  // If we're viewing retro boards, show that component
  if (currentView === 'retroboards' && selectedTeam) {
    return (
      <RetroBoards 
        teamId={selectedTeam.id} 
        teamName={selectedTeam.name}
        onBack={handleBackToTeams}
        onRetroClick={handleRetroClick}
      />
    );
  }

    return (
    <div className="App">
      <div className="container">




        {/* Page Title */}
        <div className="page-title-section">
          <div className="page-title-container">
            <h1 className="page-title">Azure DevOps Project Retriever</h1>
            <p className="page-subtitle">Professional project and team management platform</p>
          </div>
        </div>

        {/* Key Metrics Section */}
        <div className="metrics-section">
          <div className="metrics-grid">
            <div className="metric-card total-projects">
              <div className="metric-icon">
                <BarChart3 size={20} />
              </div>
              <div className="metric-content">
                <div className="metric-number">{stats.totalProjects}</div>
                <div className="metric-label">TOTAL PROJECTS</div>
                <div className="metric-description">Comprehensive project plans</div>
              </div>
            </div>
            
            <div className="metric-card public-projects">
              <div className="metric-icon">
                <Eye size={20} />
              </div>
              <div className="metric-content">
                <div className="metric-number">{stats.publicProjects}</div>
                <div className="metric-label">PUBLIC PROJECTS</div>
                <div className="metric-description">Currently accessible</div>
              </div>
            </div>
            
            <div className="metric-card private-projects">
              <div className="metric-icon">
                <EyeOff size={20} />
              </div>
              <div className="metric-content">
                <div className="metric-number">{stats.privateProjects}</div>
                <div className="metric-label">PRIVATE PROJECTS</div>
                <div className="metric-description">Restricted access</div>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Operations and Recent Activity */}
        <div className="operations-section">
          <div className="operations-grid">
            {/* Platform Operations Card */}
            <div className="operation-card">
              <div className="operation-header">
                <h3 className="operation-title">Platform Operations</h3>
                <p className="operation-subtitle">Essential project management functions</p>
              </div>
              <div className="operation-items">
                <button 
                  className="operation-item"
                  onClick={fetchProjects}
                  disabled={loading}
                >
                  <BarChart3 size={20} />
                  <span>{loading ? 'Syncing...' : 'Sync Projects'}</span>
                </button>
                <button 
                  className="operation-item"
                  onClick={handleShowTeamComparison}
                >
                  <Users size={20} />
                  <span>Team Comparison</span>
                </button>
                <button 
                  className="operation-item"
                  onClick={handleShowInfo}
                >
                  <Info size={20} />
                  <span>About App</span>
                </button>
              </div>
            </div>

            {/* Recent Activity Card */}
            <div className="activity-card">
              <div className="activity-header">
                <h3 className="activity-title">Recent Activity</h3>
                <p className="activity-subtitle">Latest project updates and team activities</p>
              </div>
              <div className="activity-items">
                {projects.slice(0, 3).map((project, index) => (
                  <div key={project.id} className="activity-item">
                    <div className="activity-info">
                      <div className="activity-name">Project {index + 1}</div>
                      <div className="activity-detail">{project.name}</div>
                    </div>
                    <button className="activity-view-btn">
                      <Eye size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="activity-footer">
                <button 
                  onClick={() => setCurrentView('landing')}
                  className="view-all-btn"
                >
                  Back to Home →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Status Messages */}
        {error && (
          <div className="status-message error-message">
            <div className="status-icon">
              <AlertCircle size={20} />
            </div>
            <div className="status-content">
              <h4 className="status-title">Connection Error</h4>
              <p className="status-description">{error}</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="status-message loading-message">
            <div className="status-icon">
              <Loader size={24} className="spinning" />
            </div>
            <div className="status-content">
              <h4 className="status-title">Syncing with Azure DevOps</h4>
              <p className="status-description">Retrieving latest project information...</p>
            </div>
          </div>
        )}



        {/* Projects Grid */}
        {!loading && projects.length > 0 && (
          <div className="projects-section">
            <div className="section-header">
              <h2 className="section-title">Project Management</h2>
              <p className="section-subtitle">Click on any project to view teams and retrospective boards</p>
              {/* Portfolio Filter Dropdown */}
              <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                <label htmlFor="portfolio-filter" style={{ marginRight: '10px', fontWeight: 'bold' }}>Filter by Portfolio:</label>
                <select 
                  id="portfolio-filter"
                  value={selectedPortfolio} 
                  onChange={(e) => setSelectedPortfolio(e.target.value)}
                  style={{ 
                    padding: '8px 12px', 
                    fontSize: '14px', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px',
                    minWidth: '250px'
                  }}
                >
                  <option value="all">All Portfolios</option>
                  <option value="1">Products Safety & Logistics (1)</option>
                  <option value="2">Justice and Urban Development (2)</option>
                  <option value="3">QoL & PIF (3)</option>
                  <option value="4">Enterprise Solutions (4)</option>
                  <option value="5">Mobility & Industrial Tech (5)</option>
                  <option value="12">Digital Venture (12)</option>
                  <option value="null">Uncategorized</option>
                </select>
              </div>
            </div>
            
            <div className="projects-grid">
              {projects
                .filter(project => {
                  if (selectedPortfolio === 'all') return true;
                  const portfolioId = getPortfolioId(project.name);
                  if (selectedPortfolio === 'null') return portfolioId === null;
                  return portfolioId === parseInt(selectedPortfolio);
                })
                .map((project) => (
                <div 
                  key={project.id} 
                  className={`project-card ${selectedProject?.id === project.id ? 'expanded' : ''}`}
                  onClick={() => handleProjectClick(project)}
                >
                  <div className="project-header">
                    <div className="project-icon">
                      <BarChart3 size={24} />
                    </div>
                    <div className="project-title-section">
                      <h3 className="project-name">{project.name}</h3>
                      <div className="project-badges">
                        {(() => {
                          const portfolioId = getPortfolioId(project.name);
                          return portfolioId && (
                            <span className="portfolio-badge" style={{
                              backgroundColor: '#3b82f6',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 'bold',
                              marginRight: '8px'
                            }}>
                              <Filter size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                              {getPortfolioName(portfolioId)}
                            </span>
                          );
                        })()}
                        <span className={`visibility-badge ${project.visibility}`}>
                          {project.visibility === 'public' ? (
                            <Eye size={14} />
                          ) : (
                            <EyeOff size={14} />
                          )}
                          {project.visibility}
                        </span>
                        <span className="update-badge">
                          <Calendar size={14} />
                          {formatDate(project.lastUpdateTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="project-description">
                    {project.description || 'No description available'}
                  </div>

                  {/* Project Details */}
                  {selectedProject?.id === project.id && (
                    <div className="project-details">
                      <div className="details-header">
                        <h4 className="details-title">Project Details</h4>
                      </div>
                      <div className="details-grid">
                        <div className="detail-item">
                          <span className="detail-label">ID</span>
                          <span className="detail-value">{project.id}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">State</span>
                          <span className="detail-value">{project.state}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Revision</span>
                          <span className="detail-value">{project.revision}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">URL</span>
                          <a 
                            href={project.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="project-link"
                          >
                            <ExternalLink size={14} />
                            View in Azure DevOps
                          </a>
                        </div>
                      </div>

                      {/* Teams Section */}
                      <div className="teams-section">
                        <div className="teams-header">
                          <h5 className="teams-title">
                            <Users size={18} />
                            Teams ({teams.length})
                          </h5>
                        </div>
                        
                        {loadingTeams ? (
                          <div className="teams-loading">
                            <Loader size={16} />
                            <span>Loading teams...</span>
                          </div>
                        ) : teams.length > 0 ? (
                          <div className="teams-grid">
                            {teams.map((team, index) => (
                              <div 
                                key={team.id} 
                                className={`team-card ${team.isDefaultTeam ? 'default-team' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTeamClick(team);
                                }}
                              >
                                {team.isDefaultTeam && (
                                  <div className="default-team-badge">
                                    <Crown size={12} />
                                    Default Team
                                  </div>
                                )}
                                <div className="team-header">
                                  <h6 className="team-name">{team.name}</h6>
                                  <p className="team-description">
                                    {team.description || 'No description available'}
                                  </p>
                                </div>
                                <div className="team-meta">
                                  <span className="team-principal">{team.principalName}</span>
                                  <div className="team-scope">
                                    <span className="scope-item">
                                      <strong>Scope:</strong> {team.scope}
                                    </span>
                                    <span className="scope-item">
                                      <strong>Domain:</strong> {team.domain}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="team-action">
                                  <span>Click to view Retro Boards</span>
                                  <ExternalLink size={14} />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="no-teams">
                            <Users size={32} />
                            <p>No teams found for this project</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Professional Empty State */}
        {!loading && projects.length === 0 && !error && (
          <div className="empty-state">
            <div className="empty-state-content">
              <div className="empty-state-icon">
                <AlertCircle size={64} />
              </div>
              <h3 className="empty-state-title">No Projects Found</h3>
              <p className="empty-state-description">
                No projects were returned from the Azure DevOps API. This might be due to API permissions 
                or the organization not having any projects.
              </p>
              <button 
                onClick={fetchProjects} 
                className="empty-state-btn"
              >
                <RefreshCw size={16} />
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
