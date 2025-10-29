import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Zap,
  Shield,
  BarChart3,
  Users,
  Star,
  Play,
  Github,
  ExternalLink,
  ChevronDown,
  Menu,
  X,
  Lock,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';

function LandingPage({ onGetStarted }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(true);
  const [securityKey, setSecurityKey] = useState('');
  const [keyError, setKeyError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleKeySubmit = async (e) => {
    e.preventDefault();
    setKeyError('');
    setIsVerifying(true);

    try {
      const response = await axios.post('/api/auth/verify-key', { key: securityKey });
      
      if (response.data.success && response.data.token) {
        // Store the security token in sessionStorage
        sessionStorage.setItem('security_token', response.data.token);
        sessionStorage.setItem('security_verified', 'true');
        setShowKeyModal(false);
      }
    } catch (error) {
      setKeyError(error.response?.data?.error || 'Invalid security key. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const features = [
    {
      icon: <Zap size={32} />,
      title: "Lightning Fast",
      description: "Retrieve Azure DevOps projects and teams in milliseconds with our optimized API integration."
    },
    {
      icon: <Shield size={32} />,
      title: "Enterprise Security",
      description: "Secure authentication and data handling with Azure DevOps enterprise-grade security."
    },
    {
      icon: <BarChart3 size={32} />,
      title: "Advanced Analytics",
      description: "AI-powered retrospective analysis and team effectiveness insights."
    },
    {
      icon: <Users size={32} />,
      title: "Team Collaboration",
      description: "Enhanced team retrospectives with voting, classification, and progress tracking."
    }
  ];

  // Check if already verified and has valid token
  useEffect(() => {
    const securityToken = sessionStorage.getItem('security_token');
    const isVerified = sessionStorage.getItem('security_verified') === 'true';
    
    // If no token exists, show modal even if verified flag is set
    if (securityToken && isVerified) {
      setShowKeyModal(false);
    } else {
      // Clear invalid state
      sessionStorage.removeItem('security_token');
      sessionStorage.removeItem('security_verified');
      setShowKeyModal(true);
    }
  }, []);

  return (
    <div className="landing-page">
      {/* Security Key Modal */}
      {showKeyModal && (
        <div className="key-modal-overlay">
          <div className="key-modal">
            <div className="key-modal-header">
              <div className="key-modal-icon">
                <Lock size={32} />
              </div>
              <h2 className="key-modal-title">Security Access Required</h2>
              <p className="key-modal-subtitle">Please enter the security key to access the system</p>
            </div>

            {keyError && (
              <div className="key-error-message">
                <AlertCircle size={16} />
                <span>{keyError}</span>
              </div>
            )}

            <form onSubmit={handleKeySubmit} className="key-modal-form">
              <div className="key-input-group">
                <label htmlFor="securityKey">
                  <Lock size={18} />
                  Security Key
                </label>
                <input
                  type="password"
                  id="securityKey"
                  value={securityKey}
                  onChange={(e) => setSecurityKey(e.target.value)}
                  placeholder="Enter access key"
                  required
                  autoFocus
                />
              </div>

              <button 
                type="submit" 
                className="key-submit-button"
                disabled={isVerifying}
              >
                {isVerifying ? 'Verifying...' : 'Access System'}
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <div className="logo-icon">
              <BarChart3 size={24} />
            </div>
                          <span className="logo-text">Retrospective Insight with AI</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#contact" className="nav-link">Contact</a>
            <button onClick={onGetStarted} className="nav-cta">
              <span>Get Started</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="mobile-menu-btn"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="mobile-nav">
            <a href="#features" className="mobile-nav-link">Features</a>
            <a href="#about" className="mobile-nav-link">About</a>
            <a href="#contact" className="mobile-nav-link">Contact</a>
            <button onClick={onGetStarted} className="mobile-nav-cta">
              <span>Get Started</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <h1 className="hero-title">
            Retrospective
            <span className="hero-title-accent">Insight with AI</span>
          </h1>
          
          <p className="hero-description">
            Transform your team retrospectives with AI-powered insights, advanced analytics, 
            and intelligent classification. Get real-time retrospective analysis and team effectiveness metrics in seconds.
          </p>
          
          <div className="hero-buttons">
            <button onClick={onGetStarted} className="hero-btn-primary">
              <Play size={20} />
              <span>Get Started</span>
            </button>
          </div>
          
          <div className="hero-scroll">
            <ChevronDown size={24} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="features-container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Retrospective Insight with AI?</h2>
            <p className="section-subtitle">
              Built for modern teams who need intelligent retrospectives and actionable insights
            </p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="how-it-works-container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Get started in three simple steps</p>
          </div>
          
          <div className="steps-grid">
            <div className="step-item">
              <div className="step-number">1</div>
              <h3 className="step-title">Connect</h3>
              <p className="step-description">Connect your Azure DevOps organization with secure authentication</p>
            </div>
            
            <div className="step-item">
              <div className="step-number">2</div>
              <h3 className="step-title">Retrieve</h3>
              <p className="step-description">Instantly access projects, teams, and retrospective data</p>
            </div>
            
            <div className="step-item">
              <div className="step-number">3</div>
              <h3 className="step-title">Analyze</h3>
              <p className="step-description">Get AI-powered insights and team effectiveness metrics</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Transform Your Team Retrospectives?</h2>
          <p className="cta-description">
            Join thousands of teams who have already improved their productivity with Retrospective Insight with AI
          </p>
          <button onClick={onGetStarted} className="cta-button">
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <BarChart3 size={24} />
                <span>Retrospective Insight with AI</span>
              </div>
              <p className="footer-description">
                Transform your team retrospectives with AI-powered insights and intelligent analytics.
              </p>
            </div>
            
            <div className="footer-links">
              <div className="footer-column">
                <h3 className="footer-column-title">Product</h3>
                <ul className="footer-link-list">
                  <li><a href="#" className="footer-link">Features</a></li>
                  <li><a href="#" className="footer-link">Pricing</a></li>
                  <li><a href="#" className="footer-link">API</a></li>
                  <li><a href="#" className="footer-link">Documentation</a></li>
                </ul>
              </div>
              
              <div className="footer-column">
                <h3 className="footer-column-title">Company</h3>
                <ul className="footer-link-list">
                  <li><a href="#" className="footer-link">About</a></li>
                  <li><a href="#" className="footer-link">Blog</a></li>
                  <li><a href="#" className="footer-link">Careers</a></li>
                  <li><a href="#" className="footer-link">Contact</a></li>
                </ul>
              </div>
              
              <div className="footer-column">
                <h3 className="footer-column-title">Connect</h3>
                <div className="social-links">
                  <a href="#" className="social-link">
                    <Github size={20} />
                  </a>
                  <a href="#" className="social-link">
                    <ExternalLink size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2025 Retrospective Insight with AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
