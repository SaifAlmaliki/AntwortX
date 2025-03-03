# Technical Requirements for AI Customer Service UI

## 1. Overview
This project involves building an AI-powered customer service UI using Next.js, which integrates with an n8n backend through a webhook. The system allows users to enter messages to ask questions and receive responses from the n8n workflow. The landing page should be modern, sleek, and modular, showcasing the smart features of the application.

## 2. Tech Stack

### Frontend
- **Framework**: Next.js (latest version)
- **Styling**: Tailwind CSS, ShadCN UI (for sleek UI components)
- **State Management**: React Context API or Zustand (for lightweight state management)
- **UI Library**: Lucide React (for icons), Framer Motion (for animations)
- **File Upload**: React Dropzone (for handling Google Docs upload)
- **Environment Variables**: Read secrets from `.env.local`

### Backend (n8n Integration)
- **Workflow Automation**: n8n (self-hosted or cloud)
- **Webhook**: n8n Webhook Node (to receive messages from the UI)
- **Storage**: Google Drive API (to process uploaded Google Docs)
- **AI Processing**: OpenAI API or a custom LLM endpoint (configured in n8n)

## 3. Features
### **Landing Page**
- Modern, stylish, and modular design
- Showcases the smart features of the AI-powered customer service
- Animated elements for a sleek user experience
- Button to upload a Google Doc containing expected user questions

### **Customer Service UI**
- Input field for users to ask questions
- Chat-style interface with instant responses
- WebSocket or polling mechanism for real-time updates
- Integration with n8n webhook for backend communication
- User-friendly error handling and loading states

### **Google Doc Upload Feature**
- Secure file upload functionality
- Google OAuth authentication for document access
- Automatic processing and extraction of FAQs from the uploaded document
- Display extracted questions for review before adding them to the knowledge base

## 4. Environment Variables
Create a `.env.local` file to store sensitive information:
```
NEXT_PUBLIC_N8N_WEBHOOK_URL=[YOUR_N8N_WEBHOOK_URL]
NEXT_PUBLIC_GOOGLE_CLIENT_ID=[YOUR_GOOGLE_CLIENT_ID]
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=[YOUR_GOOGLE_CLIENT_SECRET]
NEXT_PUBLIC_OPENAI_API_KEY=[YOUR_OPENAI_API_KEY]
```

## 5. Deployment
- **Frontend**: Vercel (recommended) or any Next.js-compatible hosting
- **Backend**: Self-hosted n8n instance or n8n Cloud
- **Database (if needed)**: Firebase, Supabase, or PostgreSQL for additional data storage

## 6. Security & Best Practices
- Use HTTPS for all API requests
- Store all secrets in environment variables
- Implement rate limiting to prevent abuse
- Sanitize user inputs to avoid XSS attacks
- Enable CORS policies to allow only trusted domains

## 7. Next Steps
1. **Set up the Next.js project with Tailwind and ShadCN UI**
2. **Create the landing page with a sleek design and animations**
3. **Develop the customer service chat interface**
4. **Integrate n8n webhook for AI-powered responses**
5. **Implement Google Docs upload and processing**
6. **Test and deploy the application**
