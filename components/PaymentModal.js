'use client'

import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function PaymentModal({ isOpen, onClose, onSuccess, amount = 9.99 }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user, updateProfile } = useAuth()

  const handlePayment = async () => {
    if (!user) {
      setError('You must be logged in to make a payment')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Create payment record
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          amount: amount,
          status: 'completed', // For demo purposes, we'll mark as completed
          payment_method: 'demo_payment'
        })
        .select()
        .single()

      if (paymentError) throw paymentError

      // Update user profile to premium
      const { error: profileError } = await updateProfile({
        is_premium: true,
        payment_status: 'completed'
      })

      if (profileError) throw profileError

      onSuccess()
      onClose()
    } catch (err) {
      console.error('Payment error:', err)
      setError('Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <button className="payment-modal-close" onClick={onClose}>×</button>
        <h2>Complete Your Purchase</h2>
        
        {error && <div className="payment-error">{error}</div>}
        
        <div className="payment-details">
          <div className="payment-item">
            <span>Premium Access</span>
            <span>${amount}</span>
          </div>
          <div className="payment-total">
            <span>Total</span>
            <span>${amount}</span>
          </div>
        </div>
        
        <div className="payment-benefits">
          <h3>What you'll get:</h3>
          <ul>
            <li>✓ Full access to retreat booking links</li>
            <li>✓ Chat history saved</li>
            <li>✓ Priority support</li>
            <li>✓ Exclusive retreat recommendations</li>
          </ul>
        </div>
        
        <button 
          onClick={handlePayment} 
          disabled={loading} 
          className="payment-submit"
        >
          {loading ? 'Processing...' : `Pay $${amount}`}
        </button>
        
        <p className="payment-note">
          This is a demo payment. No actual charges will be made.
        </p>
      </div>
      
      <style jsx>{`
        .payment-modal-overlay {
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
        
        .payment-modal {
          background: #1a1a1a;
          border-radius: 12px;
          padding: 30px;
          width: 90%;
          max-width: 450px;
          position: relative;
          border: 1px solid #333;
        }
        
        .payment-modal-close {
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
        
        .payment-modal h2 {
          margin: 0 0 20px 0;
          color: #fff;
          text-align: center;
        }
        
        .payment-error {
          background: #ff4444;
          color: white;
          padding: 10px;
          border-radius: 6px;
          margin-bottom: 20px;
          font-size: 14px;
        }
        
        .payment-details {
          background: #2a2a2a;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }
        
        .payment-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          color: #fff;
        }
        
        .payment-total {
          display: flex;
          justify-content: space-between;
          border-top: 1px solid #444;
          padding-top: 10px;
          font-weight: bold;
          color: #BAD234;
          font-size: 18px;
        }
        
        .payment-benefits {
          margin-bottom: 20px;
        }
        
        .payment-benefits h3 {
          color: #fff;
          margin-bottom: 10px;
          font-size: 16px;
        }
        
        .payment-benefits ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .payment-benefits li {
          color: #ccc;
          margin-bottom: 8px;
          font-size: 14px;
        }
        
        .payment-submit {
          width: 100%;
          padding: 15px;
          background: #BAD234;
          color: #000;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          margin-bottom: 15px;
        }
        
        .payment-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .payment-note {
          color: #888;
          font-size: 12px;
          text-align: center;
          margin: 0;
        }
      `}</style>
    </div>
  )
} 