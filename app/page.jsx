'use client';

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { ChatService } from '../lib/chatService'
import AuthModal from '../components/AuthModal'
import PaymentModal from '../components/PaymentModal'
import ChatSessions from '../components/ChatSessions'

const ChatBot = () => {
  const { user, profile, loading: authLoading } = useAuth()
  const [chat, setChat] = useState([])
  const [userInput, setUserInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [retreats, setRetreats] = useState([])
  const [isPaywallUnlocked, setIsPaywallUnlocked] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState(null)
  const [showSidebar, setShowSidebar] = useState(false)

  // Check if user is premium
  useEffect(() => {
    if (profile?.is_premium) {
      setIsPaywallUnlocked(true)
    }
  }, [profile])

  const fetchRetreats = async (query) => {
    setLoading(true)
    try {
      const API_KEY = 'AIzaSyCV74DHPufTnvP-T5Ib1JoRyhQtad2HXrQ';
      const CX = 'a58554fd534044beb';
      const enhancedQuery = `${query} retreat yoga OR meditation OR wellness site:retreat.guru OR site:bookretreats.com OR site:tripaneer.com`;
      const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(enhancedQuery)}`;
      const response = await fetch(url);
      const data = await response.json();

      const results = (data.items || [])
        .filter((item) => /retreat|yoga|meditation|wellness/i.test(item.title + item.snippet))
        .slice(0, 5)
        .map((item) => ({
          title: item.title,
          location: item.displayLink,
          date: item.snippet.match(/\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)(?:\s+\d{1,2})?,?\s+\d{4}\b/)?.[0] || 'Date not available',
          link: item.link,
          image: item.pagemap?.cse_image?.[0]?.src || 'https://source.unsplash.com/featured/?retreat'
        }));

      setRetreats(results);

      // Save retreats to database if user is logged in
      if (user && currentSessionId) {
        await ChatService.saveRetreats(user.id, currentSessionId, results);
      }
    } catch (error) {
      console.error('Retreat fetch error:', error);
      setChat((prev) => [...prev, { from: 'bot', text: 'Could not find retreats. Try again.' }]);
    }
    setLoading(false);
  };

  const createNewSession = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const { data: session } = await ChatService.createSession(user.id);
    if (session) {
      setCurrentSessionId(session.id);
      setChat([]);
      setRetreats([]);
      setIsPaywallUnlocked(false);
    }
  };

  const loadSession = async (sessionId) => {
    setCurrentSessionId(sessionId);
    
    // Load messages
    const { data: messages } = await ChatService.getMessages(sessionId);
    if (messages) {
      const formattedMessages = messages.map(msg => ({
        from: msg.message_type,
        text: msg.content
      }));
      setChat(formattedMessages);
    }

    // Load retreats
    const { data: sessionRetreats } = await ChatService.getRetreats(sessionId);
    if (sessionRetreats) {
      setRetreats(sessionRetreats);
    }

    // Check if user is premium for this session
    if (profile?.is_premium) {
      setIsPaywallUnlocked(true);
    }
  };

  const saveMessage = async (messageType, content) => {
    if (user && currentSessionId) {
      await ChatService.saveMessage(currentSessionId, user.id, messageType, content);
    }
  };

  const handleSend = async () => {
    if (!userInput.trim()) return;

    // Check if user is logged in
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Create session if none exists
    if (!currentSessionId) {
      const { data: session } = await ChatService.createSession(user.id);
      if (session) {
        setCurrentSessionId(session.id);
      }
    }

    const userMessage = { from: 'user', text: userInput };
    setChat((prev) => [...prev, userMessage]);
    
    // Save user message
    await saveMessage('user', userInput);

    const botMessage = { from: 'bot', text: 'Searching for retreats...' };
    setChat((prev) => [...prev, botMessage]);
    
    // Save bot message
    await saveMessage('bot', 'Searching for retreats...');

    await fetchRetreats(userInput);
    
    const finalBotMessage = { from: 'bot', text: 'I found some retreats. Please pay to unlock booking info.' };
    setChat((prev) => [...prev, finalBotMessage]);
    
    // Save final bot message
    await saveMessage('bot', 'I found some retreats. Please pay to unlock booking info.');

    setUserInput('');
  };

  const handlePaymentClick = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = () => {
    setIsPaywallUnlocked(true);
    setChat((prev) => [...prev, { from: 'bot', text: 'Access granted! Enjoy your retreats.' }]);
  };

  const handleAuthSuccess = () => {
    createNewSession();
  };

  if (authLoading) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{scss}</style>
      
      {/* Sidebar */}
      <ChatSessions
        currentSessionId={currentSessionId}
        onSessionSelect={loadSession}
        onNewSession={createNewSession}
      />
      
      {/* Main Chat Area */}
      <div className="main-chat-area">
        {/* Header */}
        <div className="chat-header">
          <button 
            className="sidebar-toggle"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            ☰
          </button>
          <h1>Retreat Finder AI</h1>
          <div className="user-section">
            {user ? (
              <div className="user-info">
                <span>{profile?.full_name || user.email}</span>
                {profile?.is_premium && <span className="premium-badge">Premium</span>}
              </div>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="auth-btn">
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Chat Content */}
        <div className="chatbox">
          <div className="chat-log">
            {chat.map((msg, idx) => (
              <div key={idx} className={`message ${msg.from}`}>
                {msg.text}
              </div>
            ))}
            {loading && <div className="message bot">Loading...</div>}
            {retreats.length > 0 && (
              <div className={`retreat-results ${!isPaywallUnlocked ? 'blurred' : ''}`}>
                {retreats.map((r, i) => (
                  <div className="retreat-card" key={i}>
                    <img src={r.image_url || r.image} alt={r.title} className="retreat-img" />
                    <h4>{r.title}</h4>
                    <p>{r.location}</p>
                    <p>{r.date}</p>
                    {isPaywallUnlocked && (
                      <a href={r.link} target="_blank" rel="noreferrer" className="booking-link">
                        Book Now
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Chat Input */}
          <div className="chat-input">
            <input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about retreats..."
            />
            <button onClick={handleSend}>Send</button>
          </div>
          
          {/* Paywall */}
          {!isPaywallUnlocked && retreats.length > 0 && (
            <div className="paywall">
              <p>Please pay $9.99 to unlock full access.</p>
              <button onClick={handlePaymentClick}>Pay Now</button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
      
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#0f0f0f',
    color: '#fff',
    height: '100vh',
    display: 'flex',
  },
};

const scss = `
.main-chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-header {
  background: #1a1a1a;
  padding: 15px 20px;
  border-bottom: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar-toggle {
  background: none;
  border: none;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  display: none;
}

.chat-header h1 {
  margin: 0;
  font-size: 20px;
  color: #BAD234;
}

.user-section {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.premium-badge {
  background: #BAD234;
  color: #000;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.auth-btn {
  background: #BAD234;
  color: #000;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.chatbox {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.chat-log {
  flex: 1;
  overflow-y: auto;
  max-height: 60vh;
  margin-bottom: 20px;
}

.message {
  margin: 10px 0;
  padding: 10px 14px;
  border-radius: 12px;
  max-width: 80%;
}

.message.bot {
  background: #333;
  align-self: flex-start;
}

.message.user {
  background: #09723A;
  align-self: flex-end;
  color: white;
  margin-left: auto;
}

.chat-input {
  display: flex;
  margin-top: 10px;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border-radius: 6px;
  border: none;
  background-color: #2a2a2a;
  color: white;
}

.chat-input button {
  padding: 10px 16px;
  background: #BAD234;
  border: none;
  margin-left: 6px;
  border-radius: 6px;
  cursor: pointer;
}

.retreat-results {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.retreat-card {
  background: #222;
  border-left: 4px solid #BAD234;
  padding: 10px;
  border-radius: 8px;
}

.retreat-img {
  width: 100%;
  height: auto;
  border-radius: 6px;
  margin-bottom: 8px;
}

.booking-link {
  color: #BAD234;
  text-decoration: underline;
  margin-top: 5px;
  display: inline-block;
}

.blurred {
  filter: blur(6px);
  pointer-events: none;
  user-select: none;
}

.paywall {
  margin-top: 20px;
  padding: 15px;
  background: #333;
  border-radius: 10px;
  text-align: center;
}

.paywall button {
  margin-top: 10px;
  background: #BAD234;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .sidebar-toggle {
    display: block;
  }
  
  .chat-sessions {
    display: none;
  }
}
`;

export default ChatBot;
