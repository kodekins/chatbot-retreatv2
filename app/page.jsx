'use client';

import React, { useState } from 'react';

const ChatBot = () => {
  const [userInput, setUserInput] = useState('');
  const [chat, setChat] = useState([{ from: 'bot', text: 'Hi! Search for upcoming retreats by typing something like "Yoga in Bali".' }]);
  const [retreats, setRetreats] = useState([]);
  const [isPaywallUnlocked, setIsPaywallUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchRetreats = async (query) => {
    setLoading(true);
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
    } catch (error) {
      console.error('Retreat fetch error:', error);
      setChat((prev) => [...prev, { from: 'bot', text: 'Could not find retreats. Try again.' }]);
    }
    setLoading(false);
  };

  const handleSend = async () => {
    if (!userInput.trim()) return;
    setChat((prev) => [...prev, { from: 'user', text: userInput }, { from: 'bot', text: 'Searching for retreats...' }]);
    await fetchRetreats(userInput);
    setChat((prev) => [...prev, { from: 'bot', text: 'I found some retreats. Please pay to unlock booking info.' }]);
    setUserInput('');
  };

  const unlockAccess = () => {
    setIsPaywallUnlocked(true);
    setChat((prev) => [...prev, { from: 'bot', text: 'Access granted! Enjoy your retreats.' }]);
  };

  return (
    <div style={styles.container}>
      <style>{scss}</style>
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
                  <img src={r.image} alt={r.title} className="retreat-img" />
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
        <div className="chat-input">
          <input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about retreats..."
          />
          <button onClick={handleSend}>Send</button>
        </div>
        {!isPaywallUnlocked && retreats.length > 0 && (
          <div className="paywall">
            <p>Please pay $9.99 to unlock full access.</p>
            <button onClick={unlockAccess}>Simulate Payment</button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#0f0f0f',
    color: '#fff',
    height: '100vh',
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

const scss = `
.chatbox {
  width: 100%;
  max-width: 600px;
  background: #1a1a1a;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 0 10px #000;
  display: flex;
  flex-direction: column;
}
.chat-log {
  flex: 1;
  overflow-y: auto;
  max-height: 60vh;
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
`;

export default ChatBot;
