# Intelligent Proxy: Comprehensive AI Solutions Platform

A comprehensive platform for AI solutions from strategy to execution and implementation. Intelligent Proxy provides end-to-end services for creating and deploying custom AI agents for various use cases. Built with Next.js and integrating with an n8n backend via webhooks, Intelligent Proxy enables companies to implement tailored AI solutions for their specific business needs.

## Features

- **Modern UI**: Built with Next.js, Tailwind CSS, and ShadCN UI components
- **Versatile AI Agents**: Create custom agents for different business needs
- **Document Integration**: Support for Google Docs and other document formats
- **Knowledge Base Management**: Extract and manage information from uploaded documents
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- n8n instance for backend processing

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/intelligentproxy.git
cd intelligentproxy
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:
```
NEXT_PUBLIC_N8N_WEBHOOK_URL=your-n8n-webhook-url
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your-google-client-secret
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

The following environment variables are required:

- `NEXT_PUBLIC_N8N_WEBHOOK_URL`: URL of your n8n webhook for processing AI agent requests and document uploads
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Google OAuth client ID for document access
- `NEXT_PUBLIC_GOOGLE_CLIENT_SECRET`: Google OAuth client secret for document access

## Deployment

This application can be easily deployed on Vercel:

1. Push your code to a GitHub repository
2. Import the repository in Vercel
3. Set the required environment variables
4. Deploy

## Backend Setup

This frontend application requires an n8n backend with workflows configured for:

1. Processing AI agent requests and generating responses
2. Handling document uploads and extracting information
3. Managing the knowledge base

## Security Considerations

- All API requests use HTTPS
- User inputs are sanitized to prevent security vulnerabilities
- CORS policies are implemented to allow only trusted domains
- API keys and secrets are stored in environment variables
