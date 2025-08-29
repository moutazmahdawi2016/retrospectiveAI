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
  Settings,
  Shield,
  MessageSquare,
  TrendingUp,
  BarChart3,
  List,
  ThumbsUp,
  Brain,
  Sparkles
} from 'lucide-react';

function RetroDetail({ retrospectiveId, onBack }) {
  const [retroDetail, setRetroDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [classifying, setClassifying] = useState(false);
  const [classifiedItems, setClassifiedItems] = useState([]);
  const [showClassification, setShowClassification] = useState(false);

  const fetchRetroDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/retroboards/${retrospectiveId}`);
      console.log('Retro detail response:', response.data);
      
      if (response.data.success) {
        setRetroDetail(response.data.detailedBoard);
        // Also store the retrospective items separately for easier access
        if (response.data.retrospectiveItems) {
          setRetroDetail(prev => ({
            ...prev,
            retrospectiveItems: response.data.retrospectiveItems
          }));
        }
      } else {
        setError('Failed to fetch retrospective details');
      }
    } catch (err) {
      console.error('Error fetching retrospective details:', err);
      setError(err.response?.data?.error || 'Failed to fetch retrospective details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (retrospectiveId) {
      fetchRetroDetail();
    }
  }, [retrospectiveId]);

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

  // Function to get column title by column ID
  const getColumnTitle = (columnId) => {
    if (!retroDetail?.columns || !columnId) return 'Unknown Column';
    
    const column = retroDetail.columns.find(col => col.id === columnId);
    return column ? column.title : 'Unknown Column';
  };

  // Function to get column color by column ID
  const getColumnColor = (columnId) => {
    if (!retroDetail?.columns || !columnId) return '#6c757d';
    
    const column = retroDetail.columns.find(col => col.id === columnId);
    return column ? column.accentColor || '#6c757d' : '#6c757d';
  };

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

  const getCreatedByDisplayName = (createdBy) => {
    if (!createdBy) return 'Unknown';

    if (typeof createdBy === 'string') {
      return createdBy;
    }

    if (typeof createdBy === 'object' && createdBy.displayName) {
      return createdBy.displayName;
    }

    return 'Unknown';
  };

  const classifyItems = async () => {
    if (!retroDetail?.retrospectiveItems || retroDetail.retrospectiveItems.length === 0) {
      setError('No items to classify');
      return;
    }

    setClassifying(true);
    setError(null);

    try {
      const response = await axios.post(`/api/retroboards/${retrospectiveId}/classify`, {
        items: retroDetail.retrospectiveItems
      });

      if (response.data.success) {
        setClassifiedItems(response.data.classifiedItems);
        setShowClassification(true);
        console.log('Classification result:', response.data);
      } else {
        setError('Failed to classify items');
      }
    } catch (err) {
      console.error('Error classifying items:', err);
      setError(err.response?.data?.error || 'Failed to classify items');
    } finally {
      setClassifying(false);
    }
  };

  if (loading) {
    return (
      <div className="retro-detail-page">
        <div className="container">
          <div className="loading">
            <Loader size={24} />
            <span style={{ marginLeft: '12px' }}>Loading retrospective details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="retro-detail-page">
        <div className="container">
          <div className="error">
            <AlertCircle size={20} />
            <span style={{ marginLeft: '8px' }}>{error}</span>
          </div>
          <button className="btn btn-secondary" onClick={onBack}>
            <ArrowLeft size={20} style={{ marginRight: '8px' }} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!retroDetail) {
    return (
      <div className="retro-detail-page">
        <div className="container">
          <div className="error">
            <AlertCircle size={20} />
            <span style={{ marginLeft: '8px' }}>No retrospective data found</span>
          </div>
          <button className="btn btn-secondary" onClick={onBack}>
            <ArrowLeft size={20} style={{ marginRight: '8px' }} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="retro-detail-page">
      <div className="container">
        {/* Header */}
        <div className="header">
          <button
            className="btn btn-secondary"
            onClick={onBack}
            style={{ marginBottom: '20px' }}
          >
            <ArrowLeft size={20} style={{ marginRight: '8px' }} />
            Back to Retro Boards
          </button>

          <h1>Retrospective Details</h1>
          <p><strong>{retroDetail.title}</strong></p>
        </div>

        {/* Control Buttons */}
        <div className="card">
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              className="btn"
              onClick={fetchRetroDetail}
              disabled={loading}
            >
              {loading ? <Loader size={20} /> : <RefreshCw size={20} />}
              {loading ? 'Loading...' : 'Refresh Details'}
            </button>

            <button
              className="btn"
              onClick={classifyItems}
              disabled={classifying || !retroDetail?.retrospectiveItems || retroDetail.retrospectiveItems.length === 0}
              style={{ 
                background: '#667eea',
                color: 'white'
              }}
            >
              {classifying ? <Loader size={20} /> : <Brain size={20} />}
              {classifying ? 'Classifying...' : 'Classify with AI'}
            </button>

            {showClassification && (
              <button
                className="btn btn-secondary"
                onClick={() => setShowClassification(false)}
              >
                Hide Classification
              </button>
            )}
          </div>
        </div>

        {/* Main Retrospective Information */}
        <div className="grid">
          {/* Basic Information Card */}
          <div className="card retro-detail-card">
            <h3 style={{ marginBottom: '16px', color: '#2c3e50' }}>
              <FileText size={20} style={{ marginRight: '8px' }} />
              Basic Information
            </h3>

            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600' }}>Status:</span>
                <span className={`status-badge ${getStatusColor(retroDetail.activePhase)}`}>
                  {getStatusText(retroDetail.activePhase)}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600' }}>Created:</span>
                <span>{formatDate(retroDetail.createdDate)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600' }}>Modified:</span>
                <span>{formatDateTime(retroDetail.modifiedDate)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600' }}>Created By:</span>
                <span>{getCreatedByDisplayName(retroDetail.createdBy)}</span>
              </div>
            </div>
          </div>

          {/* Settings Card */}
          <div className="card retro-detail-card">
            <h3 style={{ marginBottom: '16px', color: '#2c3e50' }}>
              <Settings size={20} style={{ marginRight: '8px' }} />
              Board Settings
            </h3>

            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600' }}>Anonymous:</span>
                <span style={{ color: retroDetail.isAnonymous ? '#dc3545' : '#28a745' }}>
                  {retroDetail.isAnonymous ? 'Yes' : 'No'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600' }}>Public:</span>
                <span style={{ color: retroDetail.isPublic ? '#28a745' : '#6c757d' }}>
                  {retroDetail.isPublic ? 'Yes' : 'No'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600' }}>Max Votes:</span>
                <span>{retroDetail.maxVotesPerUser}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600' }}>Team Effectiveness:</span>
                <span>{retroDetail.isIncludeTeamEffectivenessMeasurement ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
          </div>

          {/* Columns Card */}
          {retroDetail.columns && retroDetail.columns.length > 0 && (
            <div className="card retro-detail-card">
              <h3 style={{ marginBottom: '16px', color: '#2c3e50' }}>
                <BarChart3 size={20} style={{ marginRight: '8px' }} />
                Board Columns ({retroDetail.columns.length})
              </h3>

              <div style={{ display: 'grid', gap: '8px' }}>
                {retroDetail.columns.map((column, index) => (
                  <div key={column.id || index} style={{
                    padding: '12px',
                    background: column.accentColor || '#6c757d',
                    color: 'white',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontWeight: '600' }}>{column.title}</span>
                    <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                      {column.iconClass ? column.iconClass.replace(/^fas? fa-/, '') : 'column'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Voting Information */}
          {retroDetail.boardVoteCollection && Object.keys(retroDetail.boardVoteCollection).length > 0 && (
            <div className="card retro-detail-card">
              <h3 style={{ marginBottom: '16px', color: '#2c3e50' }}>
                <Vote size={20} style={{ marginRight: '8px' }} />
                Voting Information
              </h3>

              <div style={{ display: 'grid', gap: '8px' }}>
                {Object.entries(retroDetail.boardVoteCollection).map(([itemId, voteCount]) => (
                  <div key={itemId} style={{
                    padding: '8px',
                    background: '#f8f9fa',
                    borderRadius: '6px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      {itemId.substring(0, 8)}...
                    </span>
                    <span style={{ fontWeight: '600', color: '#007bff' }}>
                      {voteCount} vote{voteCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Details */}
          <div className="card retro-detail-card">
            <h3 style={{ marginBottom: '16px', color: '#2c3e50' }}>
              <Shield size={20} style={{ marginRight: '8px' }} />
              Additional Details
            </h3>
            
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600' }}>Board ID:</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{retroDetail.id}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600' }}>Team ID:</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{retroDetail.teamId || 'N/A'}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600' }}>ETag:</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{retroDetail.__etag || 'N/A'}</span>
              </div>
              
              {retroDetail.description && (
                <div style={{ marginTop: '16px', padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ fontWeight: '600', marginBottom: '8px' }}>Description:</div>
                  <div>{retroDetail.description}</div>
                </div>
              )}
            </div>
          </div>

          {/* Retrospective Items Section */}
          {retroDetail.retrospectiveItems && retroDetail.retrospectiveItems.length > 0 && (
            <div className="card retro-detail-card" style={{ gridColumn: '1 / -1' }}>
              <h3 style={{ marginBottom: '16px', color: '#2c3e50' }}>
                <List size={20} style={{ marginRight: '8px' }} />
                Retrospective Items ({retroDetail.retrospectiveItems.length})
              </h3>
              
              {/* Debug info */}
              <div style={{ 
                marginBottom: '16px', 
                padding: '12px', 
                background: '#e3f2fd', 
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontFamily: 'monospace'
              }}>
                <strong>Debug Info:</strong> Found {retroDetail.retrospectiveItems.length} items
                <br />
                <strong>First item sample:</strong> {JSON.stringify(retroDetail.retrospectiveItems[0], null, 2)}
              </div>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse',
                  fontSize: '0.9rem'
                }}>
                  <thead>
                    <tr style={{ 
                      background: '#f8f9fa', 
                      borderBottom: '2px solid #dee2e6' 
                    }}>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>#</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Title</th>
                      <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>Upvotes</th>
                      <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>Votes Sum</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Created (Riyadh)</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Column</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Item ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {retroDetail.retrospectiveItems.map((item, index) => (
                      <tr key={item.id} style={{ 
                        borderBottom: '1px solid #f1f3f4',
                        background: index % 2 === 0 ? '#ffffff' : '#f8f9fa'
                      }}>
                        <td style={{ padding: '12px', fontWeight: '600' }}>{index + 1}</td>
                        <td style={{ padding: '12px', maxWidth: '300px' }}>
                          <div style={{ 
                            fontWeight: '500', 
                            color: '#2c3e50',
                            wordBreak: 'break-word'
                          }}>
                            {item.title || 'No Title'}
                          </div>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            gap: '4px'
                          }}>
                            <ThumbsUp size={16} color="#28a745" />
                            <span style={{ fontWeight: '600', color: '#28a745' }}>
                              {item.upvotes || 0}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            gap: '4px'
                          }}>
                            <Vote size={16} color="#007bff" />
                            <span style={{ fontWeight: '600', color: '#007bff' }}>
                              {item.votes_sum || 0}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '12px', fontSize: '0.85rem', color: '#6c757d' }}>
                          {item.created_riyadh ? formatDateTime(item.created_riyadh) : 'N/A'}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          {item.columnId ? (
                            <div style={{
                              padding: '6px 12px',
                              background: getColumnColor(item.columnId),
                              color: 'white',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              display: 'inline-block',
                              minWidth: '120px',
                              textAlign: 'center'
                            }}>
                              {getColumnTitle(item.columnId)}
                            </div>
                          ) : (
                            <span style={{ color: '#6c757d', fontStyle: 'italic' }}>N/A</span>
                          )}
                        </td>
                        <td style={{ padding: '12px', fontSize: '0.8rem', fontFamily: 'monospace', color: '#6c757d' }}>
                          {item.id ? item.id.substring(0, 8) + '...' : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Show message if no items found */}
          {(!retroDetail.retrospectiveItems || retroDetail.retrospectiveItems.length === 0) && (
            <div className="card retro-detail-card" style={{ gridColumn: '1 / -1' }}>
              <div style={{ textAlign: 'center', color: '#6c757d', padding: '20px' }}>
                <List size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <p>No retrospective items found.</p>
                <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>
                  Available data: {JSON.stringify(retroDetail, null, 2)}
                </p>
              </div>
            </div>
          )}

          {/* AI Classification Results */}
          {showClassification && classifiedItems.length > 0 && (
            <div className="card retro-detail-card" style={{ gridColumn: '1 / -1' }}>
              <h3 style={{ marginBottom: '16px', color: '#2c3e50' }}>
                <Sparkles size={20} style={{ marginRight: '8px' }} />
                AI Classification Results
              </h3>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse',
                  fontSize: '0.9rem'
                }}>
                  <thead>
                    <tr style={{ 
                      background: '#667eea', 
                      color: 'white'
                    }}>
                      <th style={{ padding: '12px', textAlign: 'left' }}>#</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Title</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>Classification</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>AI Reason</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>Column</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>Upvotes</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>Votes Sum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classifiedItems.map((item, index) => (
                      <tr key={item.id} style={{ 
                        borderBottom: '1px solid #f1f3f4',
                        background: index % 2 === 0 ? '#ffffff' : '#f8f9fa'
                      }}>
                        <td style={{ padding: '12px', fontWeight: '600' }}>{index + 1}</td>
                        <td style={{ padding: '12px', maxWidth: '300px' }}>
                          <div style={{ 
                            fontWeight: '500', 
                            color: '#2c3e50',
                            wordBreak: 'break-word'
                          }}>
                            {item.title || 'No Title'}
                          </div>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            color: 'white',
                            background: item.classification === 'GOOD' ? '#28a745' : 
                                       item.classification === 'BAD' ? '#dc3545' : '#6c757d'
                          }}>
                            {item.classification}
                          </span>
                        </td>
                        <td style={{ padding: '12px', maxWidth: '250px' }}>
                          <div style={{ 
                            fontSize: '0.85rem', 
                            color: '#495057',
                            wordBreak: 'break-word'
                          }}>
                            {item.reason}
                          </div>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          {item.columnId ? (
                            <div style={{
                              padding: '6px 12px',
                              background: getColumnColor(item.columnId),
                              color: 'white',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              display: 'inline-block',
                              minWidth: '120px',
                              textAlign: 'center'
                            }}>
                              {getColumnTitle(item.columnId)}
                            </div>
                          ) : (
                            <span style={{ color: '#6c757d', fontStyle: 'italic' }}>N/A</span>
                          )}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            gap: '4px'
                          }}>
                            <ThumbsUp size={16} color="#28a745" />
                            <span style={{ fontWeight: '600', color: '#28a745' }}>
                              {item.upvotes || 0}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            gap: '4px'
                          }}>
                            <Vote size={16} color="#007bff" />
                            <span style={{ fontWeight: '600', color: '#007bff' }}>
                              {item.votes_sum || 0}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Statistics */}
              <div style={{ 
                marginTop: '20px', 
                padding: '16px', 
                background: '#f8f9fa', 
                borderRadius: '8px',
                display: 'flex',
                gap: '20px',
                flexWrap: 'wrap'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#28a745' }}>
                    {classifiedItems.filter(item => item.classification === 'GOOD').length}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>Good Points</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#dc3545' }}>
                    {classifiedItems.filter(item => item.classification === 'BAD').length}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>Bad Points</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#6c757d' }}>
                    {classifiedItems.filter(item => item.classification === 'UNKNOWN').length}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>Unclassified</div>
                </div>
              </div>

              {/* AI Classification Comparison Analysis */}
              <div style={{ 
                marginTop: '20px', 
                padding: '20px', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                borderRadius: '12px',
                color: 'white'
              }}>
                <h4 style={{ 
                  margin: '0 0 20px 0', 
                  fontSize: '1.3rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px' 
                }}>
                  <BarChart3 size={20} />
                  AI Classification Comparison Analysis
                </h4>
                
                {/* Classification Distribution Chart */}
                <div style={{ marginBottom: '25px' }}>
                  <h5 style={{ margin: '0 0 15px 0', fontSize: '1.1rem' }}>📊 Classification Distribution</h5>
                  <div style={{ 
                    display: 'flex', 
                    gap: '15px', 
                    alignItems: 'end', 
                    height: '120px',
                    padding: '0 20px'
                  }}>
                    {['GOOD', 'BAD', 'UNKNOWN'].map(classification => {
                      const count = classifiedItems.filter(item => item.classification === classification).length;
                      const total = classifiedItems.length;
                      const percentage = total > 0 ? (count / total) * 100 : 0;
                      const height = percentage > 0 ? Math.max(20, percentage) : 20;
                      const color = classification === 'GOOD' ? '#28a745' : 
                                  classification === 'BAD' ? '#dc3545' : '#6c757d';
                      
                      return (
                        <div key={classification} style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center',
                          flex: 1
                        }}>
                          <div style={{
                            width: '100%',
                            height: `${height}%`,
                            background: color,
                            borderRadius: '8px 8px 0 0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            minHeight: '20px'
                          }}>
                            {count}
                          </div>
                          <div style={{ 
                            marginTop: '8px', 
                            fontSize: '0.8rem', 
                            textAlign: 'center',
                            fontWeight: '500'
                          }}>
                            {classification}
                          </div>
                          <div style={{ 
                            fontSize: '0.7rem', 
                            opacity: 0.8,
                            textAlign: 'center'
                          }}>
                            {percentage.toFixed(1)}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Column-wise Analysis */}
                <div style={{ marginBottom: '25px' }}>
                  <h5 style={{ margin: '0 0 15px 0', fontSize: '1.1rem' }}>🏷️ Column-wise Classification</h5>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                    gap: '15px' 
                  }}>
                    {(() => {
                      const columnAnalysis = {};
                      classifiedItems.forEach(item => {
                        const columnTitle = getColumnTitle(item.columnId) || 'Unknown';
                        if (!columnAnalysis[columnTitle]) {
                          columnAnalysis[columnTitle] = { GOOD: 0, BAD: 0, UNKNOWN: 0, total: 0 };
                        }
                        columnAnalysis[columnTitle][item.classification]++;
                        columnAnalysis[columnTitle].total++;
                      });

                      return Object.entries(columnAnalysis).map(([columnTitle, stats]) => (
                        <div key={columnTitle} style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          padding: '15px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          <div style={{ 
                            fontWeight: '600', 
                            marginBottom: '10px',
                            fontSize: '0.9rem'
                          }}>
                            {columnTitle}
                          </div>
                          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <span style={{
                              padding: '4px 8px',
                              background: '#28a745',
                              borderRadius: '12px',
                              fontSize: '0.7rem',
                              fontWeight: '600'
                            }}>
                              Good: {stats.GOOD}
                            </span>
                            <span style={{
                              padding: '4px 8px',
                              background: '#dc3545',
                              borderRadius: '12px',
                              fontSize: '0.7rem',
                              fontWeight: '600'
                            }}>
                              Bad: {stats.BAD}
                            </span>
                            <span style={{
                              padding: '4px 8px',
                              background: '#6c757d',
                              borderRadius: '12px',
                              fontSize: '0.7rem',
                              fontWeight: '600'
                            }}>
                              Unknown: {stats.UNKNOWN}
                            </span>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                {/* Engagement Analysis */}
                <div style={{ marginBottom: '25px' }}>
                  <h5 style={{ margin: '0 0 15px 0', fontSize: '1.1rem' }}>👍 Engagement vs Classification</h5>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '15px' 
                  }}>
                    {(() => {
                      const goodItems = classifiedItems.filter(item => item.classification === 'GOOD');
                      const badItems = classifiedItems.filter(item => item.classification === 'BAD');
                      
                      const avgGoodUpvotes = goodItems.length > 0 ? 
                        goodItems.reduce((sum, item) => sum + (item.upvotes || 0), 0) / goodItems.length : 0;
                      const avgBadUpvotes = badItems.length > 0 ? 
                        badItems.reduce((sum, item) => sum + (item.upvotes || 0), 0) / badItems.length : 0;
                      
                      return (
                        <>
                          <div style={{
                            background: 'rgba(40, 167, 69, 0.2)',
                            padding: '15px',
                            borderRadius: '8px',
                            border: '1px solid rgba(40, 167, 69, 0.4)',
                            textAlign: 'center'
                          }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#28a745' }}>
                              {avgGoodUpvotes.toFixed(1)}
                            </div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                              Avg Upvotes (Good)
                            </div>
                          </div>
                          <div style={{
                            background: 'rgba(220, 53, 69, 0.2)',
                            padding: '15px',
                            borderRadius: '8px',
                            border: '1px solid rgba(220, 53, 69, 0.4)',
                            textAlign: 'center'
                          }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#dc3545' }}>
                              {avgBadUpvotes.toFixed(1)}
                            </div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                              Avg Upvotes (Bad)
                            </div>
                          </div>
                          <div style={{
                            background: 'rgba(255, 193, 7, 0.2)',
                            padding: '15px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 193, 7, 0.4)',
                            textAlign: 'center'
                          }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#ffc107' }}>
                              {avgGoodUpvotes > avgBadUpvotes ? 'Higher' : avgGoodUpvotes < avgBadUpvotes ? 'Lower' : 'Equal'}
                            </div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                              Good vs Bad Engagement
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Key Insights */}
                <div>
                  <h5 style={{ margin: '0 0 15px 0', fontSize: '1.1rem' }}>💡 Key Insights</h5>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                    gap: '15px' 
                  }}>
                    {(() => {
                      const insights = [];
                      const goodCount = classifiedItems.filter(item => item.classification === 'GOOD').length;
                      const badCount = classifiedItems.filter(item => item.classification === 'BAD').length;
                      const total = classifiedItems.length;
                      
                      if (goodCount > badCount) {
                        insights.push({
                          icon: '✅',
                          title: 'Positive Team Culture',
                          description: `Your team has ${goodCount} positive points vs ${badCount} negative points, indicating a healthy retrospective culture.`
                        });
                      } else if (badCount > goodCount) {
                        insights.push({
                          icon: '⚠️',
                          title: 'Areas for Improvement',
                          description: `Your team has ${badCount} negative points vs ${goodCount} positive points. Focus on addressing these concerns.`
                        });
                      } else {
                        insights.push({
                          icon: '⚖️',
                          title: 'Balanced Feedback',
                          description: `Your team has equal positive and negative points, showing balanced retrospective discussions.`
                        });
                      }

                      const topGoodItem = classifiedItems
                        .filter(item => item.classification === 'GOOD')
                        .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))[0];
                      
                      if (topGoodItem) {
                        insights.push({
                          icon: '🏆',
                          title: 'Most Valued Positive Point',
                          description: `"${topGoodItem.title}" received ${topGoodItem.upvotes || 0} upvotes - team strongly agrees with this positive observation.`
                        });
                      }

                      const topBadItem = classifiedItems
                        .filter(item => item.classification === 'BAD')
                        .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))[0];
                      
                      if (topBadItem) {
                        insights.push({
                          icon: '🎯',
                          title: 'Priority Improvement Area',
                          description: `"${topBadItem.title}" received ${topBadItem.upvotes || 0} upvotes - team strongly agrees this needs attention.`
                        });
                      }

                      return insights.map((insight, index) => (
                        <div key={index} style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          padding: '15px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          <div style={{ 
                            fontSize: '1.5rem', 
                            marginBottom: '8px' 
                          }}>
                            {insight.icon}
                          </div>
                          <div style={{ 
                            fontWeight: '600', 
                            marginBottom: '8px',
                            fontSize: '0.9rem'
                          }}>
                            {insight.title}
                          </div>
                          <div style={{ 
                            fontSize: '0.8rem', 
                            opacity: 0.9,
                            lineHeight: '1.4'
                          }}>
                            {insight.description}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RetroDetail;
