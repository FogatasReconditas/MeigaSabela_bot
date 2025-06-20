# Meiga Sabela Bot - Replit Configuration

## Overview

Meiga Sabela Bot is a Telegram bot that embodies the character of an elderly Galician wise woman (meiga) from the podcast "Fogatas Recónditas". The bot uses AI to maintain character authenticity while providing interactive experiences for podcast listeners. It enforces channel membership requirements and responds dynamically based on user language preferences.

## System Architecture

### Core Architecture Pattern
- **Microservices-style modular design** with clear separation of concerns
- **Event-driven architecture** using Telegram webhook/polling system
- **Service layer pattern** for business logic encapsulation
- **Configuration-driven approach** for easy environment management

### Technology Stack
- **Runtime**: Node.js 20
- **Bot Framework**: node-telegram-bot-api
- **AI Integration**: Mistral AI API (@mistralai/mistralai)
- **RSS Processing**: rss-parser
- **Language Detection**: franc
- **Environment Management**: dotenv

## Key Components

### 1. Main Application (`index.js`)
- **Entry point** that orchestrates all services
- **Message handling pipeline** with priority-based processing
- **Error handling and logging** for debugging

### 2. Service Layer
- **TelegramService**: Handles Telegram-specific operations including membership verification and message formatting
- **MistralService**: Manages AI response generation with character-specific prompts
- **RSSService**: Fetches and processes podcast episode data from RSS feeds

### 3. Utility Layer
- **LanguageDetector**: Determines if user input is in Galician vs Spanish using keyword matching
- **CharacterPrompt**: Maintains consistent AI prompts for both languages
- **GalicianPhrases**: Provides authentic Galician expressions for character enhancement

### 4. Data Layer
- **Configuration Management**: Centralized config with environment variable support
- **Static Data**: Galician phrases and character responses stored in JavaScript modules

## Data Flow

### 1. Message Processing Pipeline
```
User Message → Membership Check → Language Detection → AI Processing → Response Generation → Delivery
```

### 2. Membership Verification Flow
- **Priority enforcement**: All interactions require channel membership verification
- **Telegram API integration**: Uses getChatMember API for real-time verification
- **Hostile response system**: Non-members receive character-appropriate rejection messages

### 3. AI Response Generation
- **Dual-language support**: Different prompts for Spanish vs Galician responses
- **Character consistency**: System prompts maintain Meiga Sabela personality
- **Context-aware responses**: RSS data integration for podcast-specific queries

### 4. RSS Integration
- **Real-time data**: Fetches latest episode information on demand
- **Fallback mechanisms**: Graceful degradation when RSS is unavailable
- **Search functionality**: Episode search by keyword capability

## External Dependencies

### Required Services
- **Telegram Bot API**: Core messaging functionality
- **Mistral AI API**: Character-consistent response generation
- **RSS Feed**: Podcast episode data from Anchor.fm

### Third-party Libraries
- **node-telegram-bot-api**: Telegram integration
- **@mistralai/mistralai**: AI service client
- **rss-parser**: RSS feed processing
- **franc**: Language detection
- **dotenv**: Environment configuration

## Deployment Strategy

### Platform Configuration
- **Replit-optimized**: Uses Replit-specific workflow configuration
- **Auto-dependency management**: Installs required packages on deployment
- **Environment-based configuration**: Uses .env files for sensitive data

### Runtime Requirements
- **Node.js 20**: Specified in .replit configuration
- **Continuous polling**: Bot runs continuously monitoring for messages
- **Memory efficiency**: Modular design minimizes resource usage

### Security Considerations
- **Token management**: API keys stored in environment variables
- **Membership verification**: Prevents unauthorized access to bot features
- **Error handling**: Graceful degradation prevents information leakage

## Changelog

```
Changelog:
- June 20, 2025. Initial setup and Node.js implementation complete
- June 20, 2025. Fixed ESM module compatibility for franc library
- June 20, 2025. Bot successfully deployed and tested with all functionality working
- June 20, 2025. Restructured project for Render deployment compatibility
- June 20, 2025. Fixed deployment issues: changed to Background Worker service type
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```

### Development Notes
- The bot maintains a hostile but character-appropriate tone for non-members
- Language detection uses keyword matching rather than complex NLP
- AI prompts are carefully crafted to maintain character consistency
- RSS integration provides dynamic content without requiring database storage
- The architecture supports easy addition of new features through the service layer pattern

### Architectural Decisions

**Event-Driven Message Processing**: Chosen to handle Telegram's asynchronous nature while maintaining responsive user experience. Alternative polling approaches were considered but rejected due to resource constraints.

**Service Layer Pattern**: Provides clear separation between Telegram operations, AI processing, and RSS handling. This enables independent testing and maintenance of each component.

**Static Configuration Approach**: Uses JavaScript modules for character data instead of database storage to minimize deployment complexity while maintaining flexibility for content updates.

**Priority-Based Membership Verification**: Implements security-first approach where channel membership is verified before any bot functionality is accessible, ensuring exclusive access for podcast community members.