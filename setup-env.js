const fs = require('fs');
const path = require('path');

const envContent = `NEXT_PUBLIC_SUPABASE_URL=https://gtzfetpitbvprxavlrih.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0emZldHBpdGJ2cHJ4YXZscmloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNDM4MTEsImV4cCI6MjA2NjgxOTgxMX0.85zPkyls8T5hUBcTSCIzgJPmRfJVs4qyZvrqscO3DLw
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0emZldHBpdGJ2cHJ4YXZscmloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTI0MzgxMSwiZXhwIjoyMDY2ODE5ODExfQ.aHh7nM8nEJxwYCv2J6fHNZU4wdIyAHiMRJ7Xpp6rdaQ`;

const envPath = path.join(__dirname, '.env.local');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local file created successfully!');
  console.log('📝 Please update SUPABASE_SERVICE_ROLE_KEY with your service role key from Supabase dashboard');
  console.log('🔗 Get it from: https://gtzfetpitbvprxavlrih.supabase.co/project/settings/api');
} catch (error) {
  console.error('❌ Error creating .env.local file:', error.message);
  console.log('📝 Please manually create .env.local file with the following content:');
  console.log('\n' + envContent);
} 