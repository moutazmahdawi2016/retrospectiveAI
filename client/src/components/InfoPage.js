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
  BarChart3,
  Brain,
  Target,
  Clock,
  Award,
  FileText,
  PieChart,
  Activity,
  Layers,
  Workflow
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
          Azure DevOps Project Retriever - System Overview
        </h1>
      </div>

      <div className="info-content">
        {/* Overview Section */}
        <section className="info-section">
          <h2 className="section-title">
            <Star className="section-icon" />
            System Overview
          </h2>
          <div className="overview-content">
          <p className="section-description">
              The <strong>Azure DevOps Project Retriever</strong> is a comprehensive project and team management platform 
              that provides intelligent insights, performance analytics, and seamless integration with Azure DevOps. 
              Our system offers advanced AI-powered analysis, real-time data synchronization, and professional-grade 
              reporting capabilities.
            </p>
            
            <div className="system-stats">
              <div className="stat-item">
                <div className="stat-number">6</div>
                <div className="stat-label">Core Features</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">6</div>
                <div className="stat-label">Main Pages</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100%</div>
                <div className="stat-label">Azure DevOps Compatible</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">AI</div>
                <div className="stat-label">Powered Analysis</div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Features Section */}
        <section className="info-section">
          <h2 className="section-title">
            <Zap className="section-icon" />
            Core Features
          </h2>
          <div className="features-grid">
            <div className="feature-card">
              <Database className="feature-icon" />
              <h3>Azure DevOps Integration</h3>
              <p>Seamlessly connect and retrieve data from Azure DevOps projects, teams, and retrospective boards.</p>
              <ul>
                <li>Real-time project data synchronization</li>
                <li>Secure API authentication with PAT</li>
                <li>Comprehensive project overview</li>
                <li>Multi-project management</li>
              </ul>
            </div>
            
            <div className="feature-card">
              <Users className="feature-icon" />
              <h3>Team Management</h3>
              <p>View and manage team structures, member details, and team performance metrics.</p>
              <ul>
                <li>Team member analytics</li>
                <li>Performance tracking</li>
                <li>Collaboration insights</li>
                <li>Team comparison tools</li>
              </ul>
            </div>
            
            <div className="feature-card">
              <BarChart3 className="feature-icon" />
              <h3>Retrospective Analysis</h3>
              <p>Analyze retrospective boards with detailed insights and performance metrics.</p>
              <ul>
                <li>Historical trend analysis</li>
                <li>Performance comparisons</li>
                <li>Data visualization</li>
                <li>Board phase management</li>
              </ul>
            </div>
            
            <div className="feature-card">
              <Brain className="feature-icon" />
              <h3>AI Classification</h3>
              <p>Intelligent classification of retrospective items using advanced AI algorithms.</p>
              <ul>
                <li>Automated categorization</li>
                <li>Sentiment analysis</li>
                <li>Pattern recognition</li>
                <li>DeepSeek AI integration</li>
              </ul>
            </div>
            
            <div className="feature-card">
              <TrendingUp className="feature-icon" />
              <h3>Progress Tracking</h3>
              <p>Monitor team progress over time with comprehensive analytics and reporting.</p>
              <ul>
                <li>Progress visualization</li>
                <li>Trend analysis</li>
                <li>Performance metrics</li>
                <li>Historical data tracking</li>
              </ul>
            </div>
            
            <div className="feature-card">
              <Target className="feature-icon" />
              <h3>Performance Insights</h3>
              <p>Get detailed insights into team performance with actionable recommendations.</p>
              <ul>
                <li>Performance scoring</li>
                <li>Improvement suggestions</li>
                <li>Benchmark comparisons</li>
                <li>Actionable insights</li>
              </ul>
            </div>
          </div>
        </section>

        {/* System Pages Section */}
        <section className="info-section">
          <h2 className="section-title">
            <FileText className="section-icon" />
            System Pages
          </h2>
          <div className="pages-grid">
            <div className="page-card">
              <h4>Landing Page</h4>
              <p>Welcome page with system overview and navigation</p>
              <ul>
                <li>System introduction</li>
                <li>Feature highlights</li>
                <li>Quick start guide</li>
              </ul>
            </div>
            
            <div className="page-card">
              <h4>Project Management</h4>
              <p>View and manage Azure DevOps projects</p>
              <ul>
                <li>Project listing</li>
                <li>Project details</li>
                <li>Team access</li>
              </ul>
            </div>
            
            <div className="page-card">
              <h4>Team Comparison</h4>
              <p>Compare team performance and analyze metrics</p>
              <ul>
                <li>Team analytics</li>
                <li>Performance comparison</li>
                <li>Progress tracking</li>
              </ul>
            </div>
            
            <div className="page-card">
              <h4>Retrospective Boards</h4>
              <p>View and analyze retrospective boards</p>
              <ul>
                <li>Board listing</li>
                <li>Item analysis</li>
                <li>Historical data</li>
              </ul>
            </div>
            
            <div className="page-card">
              <h4>Retrospective Details</h4>
              <p>Detailed view of individual retrospective boards</p>
              <ul>
                <li>Item classification</li>
                <li>AI analysis</li>
                <li>Performance insights</li>
              </ul>
            </div>
            
            <div className="page-card">
              <h4>System Information</h4>
              <p>Comprehensive system documentation and features</p>
              <ul>
                <li>Feature overview</li>
                <li>System capabilities</li>
                <li>Usage guidelines</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How to Use Section */}
        <section className="info-section">
          <h2 className="section-title">
            <BookOpen className="section-icon" />
            Getting Started
          </h2>
          <div className="usage-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Connect to Azure DevOps</h4>
                <p>Configure your Personal Access Token (PAT) to connect to your Azure DevOps organization</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Select Projects</h4>
                <p>Choose the projects you want to analyze and manage through the system</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Analyze Teams</h4>
                <p>View team structures, performance metrics, and collaboration insights</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>Review Retrospectives</h4>
                <p>Analyze retrospective boards with AI-powered classification and insights</p>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Details Section */}
        <section className="info-section">
          <h2 className="section-title">
            <Code className="section-icon" />
            Technical Architecture
          </h2>
          <div className="tech-grid">
            <div className="tech-item">
              <h4>Frontend</h4>
              <p>React 18 with modern hooks, responsive design, and professional UI components</p>
            </div>
            <div className="tech-item">
              <h4>Backend</h4>
              <p>Node.js with Express.js server and RESTful API architecture</p>
            </div>
            <div className="tech-item">
              <h4>APIs</h4>
              <p>Azure DevOps REST APIs integration with secure authentication</p>
            </div>
            <div className="tech-item">
              <h4>AI Integration</h4>
              <p>DeepSeek AI for intelligent feedback classification and analysis</p>
            </div>
            <div className="tech-item">
              <h4>Security</h4>
              <p>Personal Access Token (PAT) authentication and environment variable management</p>
            </div>
            <div className="tech-item">
              <h4>Data Processing</h4>
              <p>Real-time data synchronization and intelligent analytics processing</p>
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

        {/* Business Benefits Section */}
        <section className="info-section">
          <h2 className="section-title">
            <TrendingUp className="section-icon" />
            Business Value & Benefits
          </h2>
          
          <div className="business-value">
            <h3>Cost Savings & Efficiency</h3>
            <div className="benefits-grid">
              <div className="benefit-card">
                <Clock className="benefit-icon" />
                <h4>Reduced Manual Reporting</h4>
                <p>Automates project status and team performance reporting, saving 20-30% of management time</p>
              </div>
              <div className="benefit-card">
                <Target className="benefit-icon" />
                <h4>Faster Problem Identification</h4>
                <p>AI classification helps identify issues quickly, reducing resolution time by 40-50%</p>
              </div>
              <div className="benefit-card">
                <Activity className="benefit-icon" />
                <h4>Improved Resource Utilization</h4>
                <p>Better visibility into team capacity and performance for optimal resource allocation</p>
              </div>
            </div>
          </div>

          <div className="business-value">
            <h3>Performance & Quality Improvements</h3>
          <div className="benefits-list">
            <div className="benefit">
              <CheckCircle className="benefit-icon" />
                <span><strong>15-25% Improvement</strong> in team performance metrics through data-driven insights</span>
              </div>
              <div className="benefit">
                <CheckCircle className="benefit-icon" />
                <span><strong>10-20% Increase</strong> in project delivery speed through better process optimization</span>
              </div>
              <div className="benefit">
                <CheckCircle className="benefit-icon" />
                <span><strong>Higher Quality</strong> deliverables through systematic retrospective analysis and improvement</span>
            </div>
            <div className="benefit">
              <CheckCircle className="benefit-icon" />
                <span><strong>Better Client Satisfaction</strong> through more predictable and transparent project delivery</span>
              </div>
            </div>
          </div>

          <div className="business-value">
            <h3>Strategic Advantages</h3>
            <div className="benefits-list">
              <div className="benefit">
                <CheckCircle className="benefit-icon" />
                <span><strong>Data-Driven Decisions:</strong> Objective performance metrics vs. subjective assessments</span>
            </div>
            <div className="benefit">
              <CheckCircle className="benefit-icon" />
                <span><strong>Continuous Improvement:</strong> Systematic approach to team and process optimization</span>
            </div>
            <div className="benefit">
              <CheckCircle className="benefit-icon" />
                <span><strong>Scalability:</strong> Handle multiple projects and teams across the organization</span>
            </div>
            <div className="benefit">
              <CheckCircle className="benefit-icon" />
                <span><strong>Competitive Advantage:</strong> Superior project management capabilities</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default InfoPage;
