@echo off
echo Switching to Simple Clerk authentication...

echo Copying App.simple.tsx to App.tsx
copy /Y src\App.simple.tsx src\App.tsx

echo Copying SimpleHeader.tsx to components\layout\Header.tsx
copy /Y src\components\layout\SimpleHeader.tsx src\components\layout\Header.tsx

echo Creating .env file with Clerk configuration
echo VITE_CLERK_PUBLISHABLE_KEY=pk_test_cG9zaXRpdmUtYmxvd2Zpc2gtNjAuY2xlcmsuYWNjb3VudHMuZGV2JA > .env
echo VITE_CLERK_SECRET_KEY=sk_test_eTuYgiEWHj3015fm8r1SVXvnXL3Y6MRo1yIDAaDX0g >> .env
echo VITE_SUPABASE_URL=https://twttyqbqhlgyzntcblbz.supabase.co >> .env
echo VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3dHR5cWJxaGxneXpudGNibGJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2NTc5MDQsImV4cCI6MjA0OTIzMzkwNH0.u8veRmBirnompCeo3Bzgn9TzNqm6VD7NGAiOmwWcP_4 >> .env

echo Done! Now run 'npm run dev' to start the application with Clerk authentication.
pause
