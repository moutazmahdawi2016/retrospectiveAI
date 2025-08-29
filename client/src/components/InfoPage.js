import React from 'react';
import { 
  Info, 
  Code, 
  Database, 
  Users, 
  TrendingUp, 
  Settings, 
  Globe, 
  Shield,
  Zap,
  BookOpen,
  ArrowRight,
  CheckCircle,
  Star,
  GitBranch,
  MessageSquare,
  BarChart3
} from 'lucide-react';

function InfoPage({ onBack }) {
  return (
    <div className="info-page">
      <div className="info-header">
        <button onClick={onBack} className="back-button">
          <ArrowRight className="icon" />
          Back to App
        </button>
        <h1 className="info-title">
          <Info className="title-icon" />
          Application Information
        </h1>
      </div>

      <div className="info-content">
        {/* Overview Section */}
        <section className="info-section">
          <h2 className="section-title">
            <Star className="section-icon" />
            What This Application Does
          </h2>
          <p className="section-description">
            This is a comprehensive Azure DevOps management dashboard that provides centralized access to projects, 
            teams, and retrospective boards. It transforms complex Azure DevOps data into actionable insights 
            with AI-powered analysis capabilities.
          </p>
        </section>

        {/* Features Section */}
        <section className="info-section">
          <h2 className="section-title">
            <Zap className="section-icon" />
            Key Features
          </h2>
          <div className="features-grid">
            <div className="feature-card">
              <Database className="feature-icon" />
              <h3>Project Management</h3>
              <ul>
                <li>View all Azure DevOps projects</li>
                <li>Project statistics and details</li>
                <li>Real-time data from Azure DevOps API</li>
              </ul>
            </div>
            
            <div className="feature-card">
              <Users className="feature-icon" />
              <h3>Team Management</h3>
              <ul>
                <li>Browse teams under projects</li>
                <li>Team information and details</li>
                <li>Special highlighting for default teams</li>
              </ul>
            </div>
            
            <div className="feature-card">
              <MessageSquare className="feature-icon" />
              <h3>Retrospective Boards</h3>
              <ul>
                <li>Access team retrospectives</li>
                <li>Board phases and settings</li>
                <li>Column management and voting</li>
              </ul>
            </div>
            
            <div className="feature-card">
              <BarChart3 className="feature-icon" />
              <h3>AI Analysis</h3>
              <ul>
                <li>ChatGPT-powered classification</li>
                <li>Sentiment analysis of feedback</li>
                <li>Good vs. Bad feedback insights</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How to Use Section */}
        <section className="info-section">
          <h2 className="section-title">
            <BookOpen className="section-icon" />
            How to Use
          </h2>
          <div className="usage-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>View Projects</h4>
                <p>Start at the main dashboard to see all your Azure DevOps projects with statistics.</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Explore Teams</h4>
                <p>Click on any project to view teams within that project and their details.</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Access Retrospectives</h4>
                <p>Click on any team to navigate to their retrospective boards and feedback items.</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>AI Analysis</h4>
                <p>Use the "Classify with AI" feature to get intelligent insights into team feedback.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Details Section */}
        <section className="info-section">
          <h2 className="section-title">
            <Code className="section-icon" />
            Technical Details
          </h2>
          <div className="tech-grid">
            <div className="tech-item">
              <h4>Frontend</h4>
              <p>React 18 with modern hooks and responsive design</p>
            </div>
            <div className="tech-item">
              <h4>Backend</h4>
              <p>Node.js with Express.js server</p>
            </div>
            <div className="tech-item">
              <h4>APIs</h4>
              <p>Azure DevOps REST APIs integration</p>
            </div>
            <div className="tech-item">
              <h4>AI</h4>
              <p>OpenAI ChatGPT for feedback classification</p>
            </div>
          </div>
        </section>

        {/* API Endpoints Section */}
        <section className="info-section">
          <h2 className="section-title">
            <Globe className="section-icon" />
            API Endpoints
          </h2>
          <div className="api-endpoints">
            <div className="endpoint">
              <span className="method get">GET</span>
              <span className="path">/api/health</span>
              <span className="description">Server health check</span>
            </div>
            <div className="endpoint">
              <span className="method get">GET</span>
              <span className="path">/api/projects</span>
              <span className="description">Get all Azure DevOps projects</span>
            </div>
            <div className="endpoint">
              <span className="method post">POST</span>
              <span className="path">/api/projects/:projectName/teams</span>
              <span className="description">Get teams for a specific project</span>
            </div>
            <div className="endpoint">
              <span className="method get">GET</span>
              <span className="path">/api/teams/:teamId/retroboards</span>
              <span className="description">Get retro boards for a team</span>
            </div>
            <div className="endpoint">
              <span className="method post">POST</span>
              <span className="path">/api/retroboards/:retrospectiveId/classify</span>
              <span className="description">AI classification of feedback</span>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="info-section">
          <h2 className="section-title">
            <TrendingUp className="section-icon" />
            Business Benefits
          </h2>
          <div className="benefits-list">
            <div className="benefit">
              <CheckCircle className="benefit-icon" />
              <span>Centralized management of all Azure DevOps resources</span>
            </div>
            <div className="benefit">
              <CheckCircle className="benefit-icon" />
              <span>AI-powered insights into team feedback and sentiment</span>
            </div>
            <div className="benefit">
              <CheckCircle className="benefit-icon" />
              <span>Process improvement through pattern identification</span>
            </div>
            <div className="benefit">
              <CheckCircle className="benefit-icon" />
              <span>Time savings with unified dashboard interface</span>
            </div>
            <div className="benefit">
              <CheckCircle className="benefit-icon" />
              <span>Better team collaboration and communication insights</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default InfoPage;
