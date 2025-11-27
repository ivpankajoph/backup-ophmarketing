# WhatsApp + Facebook Lead Ads + AI Agents System

A complete full-stack system integrating WhatsApp Business API, Facebook Lead Ads, and AI Agents with OpenAI.

## Features

- **WhatsApp Business API Integration**: Webhook for receiving/sending messages with automated AI responses
- **Facebook Lead Ads**: Sync forms and leads from Facebook Lead Ads
- **AI Agents**: Create and manage AI agents with custom prompts using OpenAI
- **Agent-Form Mapping**: Assign AI agents to Facebook forms for automated lead handling
- **Storage Abstraction Layer**: Plugin-based storage (JSON now, easily switch to MongoDB/PostgreSQL later)
- **React Dashboard**: Complete frontend for managing all features

## Architecture

```
project/
├── server/              # Express backend (integrated)
│   ├── routes.ts        # API endpoints
│   ├── storage.ts       # Storage abstraction layer
│   └── index.ts         # Server entry point
├── client/              # React frontend
│   ├── src/
│   │   ├── pages/       # Dashboard pages
│   │   ├── components/  # UI components
│   │   └── services/    # API client
│   └── ...
├── backend/             # Standalone backend (alternative)
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── storage/     # Storage adapters
│   │   └── utils/       # OpenAI, WhatsApp, Facebook utilities
│   └── data/            # JSON storage
└── data/                # JSON file storage
```

## API Endpoints

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

### WhatsApp
- `GET /api/webhook/whatsapp` - Webhook verification (hub.challenge)
- `POST /api/webhook/whatsapp` - Receive WhatsApp messages
- `GET /api/conversations` - Get WhatsApp conversations
- `POST /api/messages/send` - Send WhatsApp message

### Facebook Lead Ads
- `POST /api/facebook/syncForms` - Sync forms from Facebook
- `GET /api/facebook/forms` - List synced forms
- `POST /api/facebook/syncLeads` - Sync leads from Facebook
- `GET /api/facebook/leads` - List synced leads

### AI Agents
- `GET /api/agents` - List all agents
- `POST /api/agents` - Create new agent
- `GET /api/agents/:id` - Get agent by ID
- `PUT /api/agents/:id` - Update agent
- `DELETE /api/agents/:id` - Delete agent
- `POST /api/agents/:id/test` - Test agent with message
- `POST /api/agents/chat` - Chat with default agent

### Agent-Form Mapping
- `GET /api/map-agent` - List all mappings
- `POST /api/map-agent` - Create mapping (formId + agentId)
- `DELETE /api/map-agent/:id` - Delete mapping

## Environment Variables

Create a `.env` file with the following:

```env
# WhatsApp Business API
WHATSAPP_TOKEN=your_whatsapp_access_token
PHONE_NUMBER_ID=your_phone_number_id
VERIFY_TOKEN=your_webhook_verify_token

# Facebook Lead Ads
FB_ACCESS_TOKEN=your_facebook_access_token
FB_PAGE_ID=your_facebook_page_id
FB_APP_ID=your_facebook_app_id
FB_APP_SECRET=your_facebook_app_secret

# OpenAI
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4.1

# Storage (optional - defaults to json)
STORAGE_TYPE=json
```

## Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application runs on port 5000.

## Setting Up Webhooks with ngrok

1. Install ngrok: `npm install -g ngrok`
2. Start ngrok: `ngrok http 5000`
3. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
4. Configure in Meta Developer Portal:
   - WhatsApp > Configuration > Webhook URL: `https://abc123.ngrok.io/api/webhook/whatsapp`
   - Verify Token: Same as your `VERIFY_TOKEN` env variable

## Adding Database Support Later

The storage layer uses an abstraction pattern. To switch to a database:

1. **MongoDB**: Implement methods in `backend/src/storage/mongoAdapter.js`
2. **PostgreSQL/MySQL**: Implement methods in `backend/src/storage/sqlAdapter.js`
3. Set `STORAGE_TYPE=mongodb` or `STORAGE_TYPE=postgres` in `.env`

The storage interface methods are:
- `findAll()`, `findById(id)`, `findOne(query)`, `find(query)`
- `create(item)`, `update(id, updates)`, `delete(id)`
- `insertMany(items)`, `deleteMany(query)`, `count(query)`

## Deployment

1. Build the frontend: `npm run build`
2. Set production environment variables
3. Start with: `npm start`

For Replit deployment, use the built-in publish feature.

## CURL Examples

```bash
# Create an AI Agent
curl -X POST http://localhost:5000/api/agents \
  -H "Content-Type: application/json" \
  -d '{"name": "Sales Bot", "model": "gpt-4.1", "prompt": "You are a helpful sales assistant.", "isDefault": true}'

# Test Agent Chat
curl -X POST http://localhost:5000/api/agents/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, I need help with pricing"}'

# Get Dashboard Stats
curl http://localhost:5000/api/dashboard

# List Agents
curl http://localhost:5000/api/agents

# Sync Facebook Forms
curl -X POST http://localhost:5000/api/facebook/syncForms

# Create Agent-Form Mapping
curl -X POST http://localhost:5000/api/map-agent \
  -H "Content-Type: application/json" \
  -d '{"formId": "form_123", "agentId": "agent_id"}'
```

## Technology Stack

- **Backend**: Node.js, Express
- **Frontend**: React, TailwindCSS, React Query
- **Storage**: JSON files (database-ready abstraction)
- **APIs**: WhatsApp Business API, Facebook Graph API, OpenAI API
