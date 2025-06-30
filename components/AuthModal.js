'use client'

import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { signUp, signIn } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let result
      if (isSignUp) {
        result = await signUp(email, password, fullName)
      } else {
        result = await signIn(email, password)
      }

      if (result.error) {
        setError(result.error.message)
      } else {
        onSuccess()
        onClose()
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <button className="auth-modal-close" onClick={onClose}>×</button>
        <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Enter your full name"
              />
            </div>
          )}
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              minLength={6}
            />
          </div>
          
          <button type="submit" disabled={loading} className="auth-submit">
            {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>
        
        <div className="auth-switch">
          <p>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="auth-switch-btn"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
      
      <style jsx>{`
        .auth-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .auth-modal {
          background: #1a1a1a;
          border-radius: 12px;
          padding: 30px;
          width: 90%;
          max-width: 400px;
          position: relative;
          border: 1px solid #333;
        }
        
        .auth-modal-close {
          position: absolute;
          top: 15px;
          right: 20px;
          background: none;
          border: none;
          color: #fff;
          font-size: 24px;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .auth-modal h2 {
          margin: 0 0 20px 0;
          color: #fff;
          text-align: center;
        }
        
        .auth-error {
          background: #ff4444;
          color: white;
          padding: 10px;
          border-radius: 6px;
          margin-bottom: 20px;
          font-size: 14px;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 5px;
          color: #fff;
          font-size: 14px;
        }
        
        .form-group input {
          width: 100%;
          padding: 12px;
          border: 1px solid #333;
          border-radius: 6px;
          background: #2a2a2a;
          color: #fff;
          font-size: 16px;
          box-sizing: border-box;
        }
        
        .form-group input:focus {
          outline: none;
          border-color: #BAD234;
        }
        
        .auth-submit {
          width: 100%;
          padding: 12px;
          background: #BAD234;
          color: #000;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          margin-top: 10px;
        }
        
        .auth-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .auth-switch {
          margin-top: 20px;
          text-align: center;
        }
        
        .auth-switch p {
          color: #ccc;
          margin: 0;
        }
        
        .auth-switch-btn {
          background: none;
          border: none;
          color: #BAD234;
          text-decoration: underline;
          cursor: pointer;
          margin-left: 5px;
          font-size: 14px;
        }
      `}</style>
    </div>
  )
} 