# Google Calendar OAuth Setup

Set the following environment variables in a local `.env` file (not committed):

- GOOGLE_CLIENT_ID=
- GOOGLE_CLIENT_SECRET=
- GOOGLE_REDIRECT_URI=http://localhost:3000/api/google/auth/callback

Steps:
1. Go to Google Cloud Console → Credentials → Create Credentials → OAuth client ID.
2. Application type: Web application.
3. Authorized redirect URI: `http://localhost:3000/api/google/auth/callback`.
4. Copy the Client ID and Client Secret to your `.env`.

Scopes used:
- https://www.googleapis.com/auth/calendar.events
- https://www.googleapis.com/auth/calendar.readonly

After configuring, run the app and open Calendar Agent section. Click Connect Google to authenticate.
