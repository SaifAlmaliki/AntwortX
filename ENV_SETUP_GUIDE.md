# Environment Variables Setup Guide

This guide explains how to set up the environment variables required for the AI Customer Support Agent application.

## Required Environment Variables

### 1. n8n Webhook URL
```
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/customer-support-ai
```
- **What to fill in**: The URL of your n8n webhook that will process messages and document uploads
- **How to get it**: 
  1. Set up an n8n instance (self-hosted or cloud)
  2. Create a webhook node in your n8n workflow
  3. Copy the webhook URL provided by n8n

### 2. Google OAuth Credentials
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=[YOUR_CLIENT_ID]
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=[YOUR_CLIENT_SECRET]
```
- **What to fill in**: Your Google OAuth credentials for accessing Google Docs
- **How to get them**:
  1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
  2. Create a new project or select an existing one
  3. Navigate to "APIs & Services" > "Credentials"
  4. Click "Create Credentials" > "OAuth client ID"
  5. Set the application type to "Web application"
  6. Add authorized JavaScript origins (e.g., http://localhost:3000 for development)
  7. Add authorized redirect URIs (e.g., http://localhost:3000/api/auth/callback/google)
  8. Copy the Client ID and Client Secret

### 3. OpenAI API Key (if using OpenAI in your n8n workflow)
```
NEXT_PUBLIC_OPENAI_API_KEY=your-openai-api-key
```
- **What to fill in**: Your OpenAI API key
- **How to get it**:
  1. Go to [OpenAI API](https://platform.openai.com/signup)
  2. Create an account or log in
  3. Navigate to the API section
  4. Generate an API key

### 4. WebSocket URL (for real-time updates)
```
NEXT_PUBLIC_WEBSOCKET_URL=wss://your-websocket-server.com
```
- **What to fill in**: The WebSocket server URL for real-time chat updates
- **How to set it up**:
  1. You can use n8n's webhook functionality with a WebSocket server
  2. Or set up a separate WebSocket server using Socket.io or similar technology

### 5. Security Settings
```
NEXT_PUBLIC_API_BASE_URL=https://your-api-base-url.com
NEXT_PUBLIC_ALLOWED_ORIGINS=https://yourdomain.com,https://anotherdomain.com
```
- **What to fill in**: Your API base URL and allowed origins for CORS
- **How to configure**:
  1. Set the API base URL to your backend API endpoint
  2. List all domains that should be allowed to make requests to your API

## Important Notes

1. All environment variables prefixed with `NEXT_PUBLIC_` will be exposed to the browser. Be careful not to include sensitive secrets in these variables if they should not be exposed to the client.

2. For production, make sure to set these environment variables in your hosting platform (e.g., Vercel).

3. For local development, these variables are loaded from the `.env.local` file.

4. Never commit the `.env.local` file to your repository. It's already added to `.gitignore`.

## Testing Your Configuration

After setting up your environment variables, you can test if they're properly loaded by:

1. Restarting your development server:
```bash
npm run dev
```

2. Checking if the application can connect to your n8n webhook and other services.

If you encounter any issues, check the browser console for error messages related to API calls or authentication.
