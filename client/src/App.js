import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Calendar, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  AlertCircle,
  CheckCircle,
  Loader,
  Users,
  Crown,
  ExternalLink,
  Info,
  BarChart3
} from 'lucide-react';
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
  const [currentView, setCurrentView] = useState('projects'); // 'projects', 'retroboards', 'retrodetail', 'info', or 'teamcomparison'
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedRetro, setSelectedRetro] = useState(null);

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
        <div className="header">
          <div className="header-content">
            <div>
              <h1>Azure DevOps Project Retriever</h1>
              <p>Manage and view your Azure DevOps projects and teams from ThiqahDev organization</p>
            </div>
            <div className="header-buttons">
              <button onClick={handleShowTeamComparison} className="comparison-button">
                <BarChart3 size={20} />
                Team Comparison
              </button>
              <button onClick={handleShowInfo} className="info-button">
                <Info size={20} />
                About App
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats">
          <div className="stat-card">
            <div className="stat-number">{stats.totalProjects}</div>
            <div className="stat-label">Total Projects</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.publicProjects}</div>
            <div className="stat-label">Public Projects</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.privateProjects}</div>
            <div className="stat-label">Private Projects</div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="card">
          <button 
            className="btn" 
            onClick={fetchProjects} 
            disabled={loading}
          >
            {loading ? <Loader size={20} /> : <RefreshCw size={20} />}
            {loading ? 'Loading...' : 'Refresh Projects'}
          </button>
        </div>

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
            <span style={{ marginLeft: '12px' }}>Fetching projects from Azure DevOps...</span>
          </div>
        )}



        {/* Projects Grid */}
        {!loading && projects.length > 0 && (
          <div className="grid">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className={`card project-card ${selectedProject?.id === project.id ? 'selected' : ''}`}
                style={{ cursor: 'pointer', border: '3px solid #28a745' }}
                onClick={() => handleProjectClick(project)}
              >
                                 <div className="project-name" style={{ 
                   fontSize: '1.3rem', 
                   fontWeight: 'bold', 
                   color: '#28a745',
                   textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                   borderBottom: '2px solid #28a745',
                   paddingBottom: '8px',
                   marginBottom: '12px'
                 }}>
                   🚀 {project.name}
                 </div>
                <div className="project-description" style={{ 
                  fontSize: '1.1rem',
                  color: '#495057',
                  backgroundColor: '#f8f9fa',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #dee2e6'
                }}>
                  {project.description || 'No description available'}
                </div>
                
                <div className="project-meta">
                  <span className="project-visibility">
                    {project.visibility === 'public' ? (
                      <Eye size={14} style={{ marginRight: '4px' }} />
                    ) : (
                      <EyeOff size={14} style={{ marginRight: '4px' }} />
                    )}
                    {project.visibility}
                  </span>
                  <span>
                    <Calendar size={14} style={{ marginRight: '4px' }} />
                    {formatDate(project.lastUpdateTime)}
                  </span>
                </div>

                {/* Project Details */}
                {selectedProject?.id === project.id && (
                  <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e9ecef' }}>
                    <h4 style={{ marginBottom: '12px', color: '#2c3e50' }}>Project Details</h4>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>ID:</strong> {project.id}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>State:</strong> {project.state}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Revision:</strong> {project.revision}
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <strong>URL:</strong> 
                      <a 
                        href={project.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: '#667eea', marginLeft: '8px' }}
                      >
                        View in Azure DevOps
                      </a>
                    </div>

                    {/* Teams Section */}
                    <div style={{ marginTop: '20px' }}>
                      <h5 style={{ marginBottom: '16px', color: '#2c3e50' }}>
                        <Users size={18} style={{ marginRight: '8px' }} />
                        Teams ({teams.length})
                      </h5>
                      
                      {loadingTeams ? (
                        <div className="loading">
                          <Loader size={16} />
                          <span style={{ marginLeft: '8px' }}>Loading teams...</span>
                        </div>
                      ) : teams.length > 0 ? (
                        <div style={{ display: 'grid', gap: '16px' }}>
                          {teams.map((team, index) => (
                            <div 
                              key={team.id} 
                              style={{ 
                                padding: '16px', 
                                background: team.isDefaultTeam ? '#e8f5e8' : '#f8f9fa', 
                                borderRadius: '12px',
                                border: team.isDefaultTeam ? '2px solid #28a745' : '1px solid #e9ecef',
                                position: 'relative',
                                cursor: 'pointer'
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTeamClick(team);
                              }}
                            >
                              {team.isDefaultTeam && (
                                <div style={{ 
                                  position: 'absolute', 
                                  top: '-8px', 
                                  right: '12px',
                                  background: '#28a745',
                                  color: 'white',
                                  padding: '4px 8px',
                                  borderRadius: '12px',
                                  fontSize: '0.7rem',
                                  fontWeight: '600'
                                }}>
                                  <Crown size={12} style={{ marginRight: '4px' }} />
                                  Default Team
                                </div>
                              )}
                              <div style={{ fontWeight: '700', marginBottom: '8px', color: '#2c3e50', fontSize: '1.1rem' }}>
                                {team.name}
                              </div>
                              <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '8px', lineHeight: '1.4' }}>
                                {team.description || 'No description available'}
                              </div>
                              <div style={{ fontSize: '0.8rem', color: '#495057', fontFamily: 'monospace' }}>
                                {team.principalName}
                              </div>
                              <div style={{ fontSize: '0.8rem', color: '#6c757d', marginTop: '8px' }}>
                                <strong>Scope:</strong> {team.scope} | <strong>Domain:</strong> {team.domain}
                              </div>
                              
                              {/* Click to view retro boards */}
                              <div style={{ 
                                marginTop: '12px', 
                                padding: '8px', 
                                background: '#667eea', 
                                color: 'white', 
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                textAlign: 'center',
                                fontWeight: '600'
                              }}>
                                <ExternalLink size={14} style={{ marginRight: '6px' }} />
                                Click to view Retro Boards
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ color: '#6c757d', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>
                          <Users size={32} style={{ opacity: 0.5, marginBottom: '8px' }} />
                          <p>No teams found for this project</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* No Projects State */}
        {!loading && projects.length === 0 && !error && (
          <div className="card" style={{ background: '#fff3cd', border: '2px solid #ffc107' }}>
            <div style={{ textAlign: 'center', color: '#856404' }}>
              <AlertCircle size={48} style={{ opacity: 0.7, marginBottom: '16px' }} />
              <h3 style={{ marginBottom: '10px' }}>⚠️ No Projects Found</h3>
              <p>No projects were returned from the Azure DevOps API.</p>
              <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>
                This might be due to API permissions or the organization not having any projects.
              </p>
              <button 
                onClick={fetchProjects} 
                className="btn" 
                style={{ marginTop: '15px' }}
              >
                <RefreshCw size={16} />
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="card" style={{ background: '#f8d7da', border: '2px solid #dc3545' }}>
            <div style={{ textAlign: 'center', color: '#721c24' }}>
              <AlertCircle size={48} style={{ opacity: 0.7, marginBottom: '16px' }} />
              <h3 style={{ marginBottom: '10px' }}>❌ Error Loading Projects</h3>
              <p>{error}</p>
              <button 
                onClick={fetchProjects} 
                className="btn" 
                style={{ marginTop: '15px' }}
              >
                <RefreshCw size={16} />
                Retry
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
