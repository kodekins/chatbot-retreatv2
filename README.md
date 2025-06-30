# Retreat Finder AI Chatbot

A Next.js chatbot application that helps users find retreats, with user authentication, chat history, and payment integration using Supabase.

## Features

- 🤖 AI-powered retreat search using Google Custom Search API
- 👤 User authentication and profiles
- 💬 Persistent chat history with sessions
- 💳 Payment integration for premium access
- 📱 Responsive design
- 🔒 Row Level Security (RLS) for data protection

## Tech Stack

- **Frontend**: Next.js 14, React
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: CSS-in-JS with styled-jsx
- **Search API**: Google Custom Search API

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd chatbot-retreatv2
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once your project is created, go to Settings > API
3. Copy your project URL and anon key

### 3. Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Database Setup

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `database-schema.sql` into the editor
4. Run the SQL script

This will create:
- `profiles` table (extends auth.users)
- `chat_sessions` table
- `chat_messages` table
- `payments` table
- `user_retreats` table
- Row Level Security policies
- Triggers and functions

### 5. Google Custom Search API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Custom Search API
4. Create credentials (API Key)
5. Go to [Google Programmable Search Engine](https://programmablesearchengine.google.com/)
6. Create a new search engine
7. Get your Search Engine ID (cx)

Update the API keys in `app/page.jsx`:
```javascript
const API_KEY = 'your_google_api_key';
const CX = 'your_search_engine_id';
```

### 6. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Tables

1. **profiles** - User profiles extending Supabase auth
2. **chat_sessions** - Chat conversation sessions
3. **chat_messages** - Individual messages in sessions
4. **payments** - Payment records
5. **user_retreats** - Retreat search results per session

### Key Features

- **Row Level Security**: Users can only access their own data
- **Automatic Profile Creation**: Profiles are created when users sign up
- **Session Management**: Users can have multiple chat sessions
- **Payment Tracking**: All payments are recorded with status tracking

## User Flow

1. **Guest User**: Can search for retreats but results are blurred
2. **Sign Up/Login**: Required to access full features
3. **Chat Sessions**: Each conversation is saved as a session
4. **Payment**: Users pay to unlock booking links
5. **Premium Access**: Full access to retreat booking information

## API Endpoints

The application uses Supabase's auto-generated REST API:

- `POST /rest/v1/chat_sessions` - Create new session
- `GET /rest/v1/chat_sessions` - Get user sessions
- `POST /rest/v1/chat_messages` - Save message
- `GET /rest/v1/chat_messages` - Get session messages
- `POST /rest/v1/payments` - Record payment
- `PATCH /rest/v1/profiles` - Update user profile

## Security Features

- **Row Level Security (RLS)**: Database-level security
- **JWT Authentication**: Secure user sessions
- **Input Validation**: Client and server-side validation
- **SQL Injection Protection**: Supabase handles this automatically

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | Yes |

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check your Supabase URL and keys
   - Ensure your database is running

2. **Authentication Not Working**
   - Verify RLS policies are set up correctly
   - Check if the `handle_new_user` trigger is created

3. **Chat History Not Saving**
   - Ensure user is authenticated
   - Check if session is created properly

4. **Payment Not Working**
   - Verify payment table exists
   - Check user profile update permissions

### Support

For issues related to:
- **Supabase**: Check [Supabase Documentation](https://supabase.com/docs)
- **Next.js**: Check [Next.js Documentation](https://nextjs.org/docs)
- **Google Custom Search**: Check [Google Custom Search API Documentation](https://developers.google.com/custom-search)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE). 