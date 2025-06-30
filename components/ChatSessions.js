'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { ChatService } from '../lib/chatService'

export default function ChatSessions({ currentSessionId, onSessionSelect, onNewSession }) {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadSessions()
    }
  }, [user])

  const loadSessions = async () => {
    if (!user) return
    
    setLoading(true)
    const { data, error } = await ChatService.getSessions(user.id)
    
    if (!error && data) {
      setSessions(data)
    }
    setLoading(false)
  }

  const handleDeleteSession = async (sessionId) => {
    if (!confirm('Are you sure you want to delete this chat session?')) return
    
    const { error } = await ChatService.deleteSession(sessionId)
    if (!error) {
      setSessions(sessions.filter(s => s.id !== sessionId))
      if (currentSessionId === sessionId) {
        onNewSession()
      }
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    
    return date.toLocaleDateString()
  }

  if (!user) {
    return (
      <div className="chat-sessions">
        <div className="sessions-header">
          <h3>Chat History</h3>
        </div>
        <div className="sessions-empty">
          <p>Please sign in to view your chat history</p>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-sessions">
      <div className="sessions-header">
        <h3>Chat History</h3>
        <button onClick={onNewSession} className="new-session-btn">
          + New Chat
        </button>
      </div>
      
      {loading ? (
        <div className="sessions-loading">
          <p>Loading...</p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="sessions-empty">
          <p>No chat sessions yet</p>
          <p>Start a new conversation!</p>
        </div>
      ) : (
        <div className="sessions-list">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`session-item ${currentSessionId === session.id ? 'active' : ''}`}
              onClick={() => onSessionSelect(session.id)}
            >
              <div className="session-info">
                <h4>{session.session_name}</h4>
                <p>{formatDate(session.updated_at)}</p>
              </div>
              <button
                className="delete-session-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteSession(session.id)
                }}
                title="Delete session"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      
      <style jsx>{`
        .chat-sessions {
          width: 250px;
          background: #1a1a1a;
          border-right: 1px solid #333;
          display: flex;
          flex-direction: column;
          height: 100vh;
        }
        
        .sessions-header {
          padding: 20px;
          border-bottom: 1px solid #333;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .sessions-header h3 {
          margin: 0;
          color: #fff;
          font-size: 16px;
        }
        
        .new-session-btn {
          background: #BAD234;
          color: #000;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          font-weight: bold;
        }
        
        .sessions-loading,
        .sessions-empty {
          padding: 20px;
          text-align: center;
          color: #888;
        }
        
        .sessions-list {
          flex: 1;
          overflow-y: auto;
        }
        
        .session-item {
          padding: 15px 20px;
          border-bottom: 1px solid #333;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background-color 0.2s;
        }
        
        .session-item:hover {
          background: #2a2a2a;
        }
        
        .session-item.active {
          background: #333;
          border-left: 3px solid #BAD234;
        }
        
        .session-info {
          flex: 1;
        }
        
        .session-info h4 {
          margin: 0 0 5px 0;
          color: #fff;
          font-size: 14px;
          font-weight: normal;
        }
        
        .session-info p {
          margin: 0;
          color: #888;
          font-size: 12px;
        }
        
        .delete-session-btn {
          background: none;
          border: none;
          color: #666;
          font-size: 18px;
          cursor: pointer;
          padding: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s;
        }
        
        .delete-session-btn:hover {
          background: #ff4444;
          color: white;
        }
      `}</style>
    </div>
  )
} 