# MeigaSabela_bot - created with AI (replit agent)
A project by Federico Marchiori and Sergio Moino Guevara


Chat with MeigaSabela_bot here: https://t.me/MeigaSabela_bot

Podcast Fogatas Recónditas: https://linktr.ee/fogatasreconditas



# Meiga Sabela Bot

A Telegram bot that embodies Meiga Sabela, a cranky but wise Galician storyteller from the "Fogatas Recónditas" folklore podcast.

## Features

- **Channel Membership Verification**: Only responds to members of @fogatasreconditas
- **AI-Powered Character Responses**: Uses Mistral AI to maintain authentic character
- **Bilingual Support**: Detects and responds in Spanish or Galician
- **RSS Integration**: Provides real-time podcast episode information
- **Hostile Non-Member Responses**: Characteristic cranky responses for non-members

## Deployment on Render

### 1. Service Type
Use a **Web Service** - the bot now includes a status webpage that displays "MeigaSabela_bot is running" while the Telegram bot operates in the background.

### 2. Environment Variables Setup

In your Render dashboard, add these environment variables:

```
TELEGRAM_TOKEN=XXXXXXXX
MISTRAL_API_KEY=XXXXXXXX
```

### 3. Build and Start Commands

- **Build Command**: `npm install`
- **Start Command**: `node index.js`

### 4. Runtime Settings

- **Service Type**: Web Service
- **Node Version**: 18+ (automatic detection)
- **Environment**: Node.js
- **Port**: Automatically detected (PORT environment variable)

### 5. Features

- **Status Page**: Visit your Render URL to see bot status
- **Telegram Bot**: Runs simultaneously in the background
- **Mystical Theme**: Status page matches the Galician folklore aesthetic

### 6. Important Notes

- Only run ONE instance of the bot at a time to avoid Telegram API conflicts
- If you see "409 Conflict" errors, another instance is running somewhere else
- The web interface shows the bot is active while Telegram functionality operates independently

## Project Structure

```
├── services/
│   ├── mistralService.js  # AI response generation
│   ├── rssService.js      # Podcast RSS integration
│   └── telegramService.js # Telegram operations
├── config.js              # Configuration management
├── galicianPhrases.js     # Authentic Galician expressions
├── characterPrompt.js     # AI character prompts
├── languageDetector.js    # Spanish/Galician detection
├── render.yaml            # Render deployment configuration
└── index.js               # Main application entry point
```

## Bot Behavior

1. **Membership Check**: First priority - verifies user is in @fogatasreconditas
2. **Language Detection**: Determines if user writes in Galician or Spanish
3. **Response Generation**: Creates character-appropriate responses using AI
4. **Content Integration**: Provides podcast information when requested

## Character Traits

- Cranky and mysterious elderly Galician wise woman
- Remembers Federico (Italian) and Sergio (Venezuelan) from the podcast
- Uses authentic Galician expressions mixed with Spanish
- Protective of ancient knowledge and stories
- Requires respect through channel membership

## Local Development

```bash
npm install
node index.js
```

Ensure all environment variables are set in your `.env` file.
