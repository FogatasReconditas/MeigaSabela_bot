const TelegramBot = require('node-telegram-bot-api');
const http = require('http');
const config = require('./config');
const TelegramService = require('./services/telegramService');
const MistralService = require('./services/mistralService');
const RSSService = require('./services/rssService');
const LanguageDetector = require('./languageDetector');
const userAnalytics = require('./userAnalytics');

// Initialize bot
const bot = new TelegramBot(config.TELEGRAM_TOKEN, { polling: true });

// Create simple HTTP server for Render
const server = http.createServer((req, res) => {
    const analytics = userAnalytics.getAnalytics();
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>MeigaSabela Bot Status</title>
            <meta http-equiv="refresh" content="30">
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    max-width: 800px; 
                    margin: 50px auto; 
                    text-align: center;
                    background-color: #1a1a2e;
                    color: #eee;
                    padding: 20px;
                }
                .status { 
                    color: #4ade80; 
                    font-size: 24px; 
                    margin: 20px 0;
                }
                .info {
                    background-color: #16213e;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 20px 0;
                }
                .analytics {
                    background-color: #0f172a;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 20px 0;
                    border: 1px solid #334155;
                }
                .analytics h3 {
                    color: #fbbf24;
                    margin-bottom: 15px;
                }
                .stat-row {
                    display: flex;
                    justify-content: space-between;
                    margin: 10px 0;
                    padding: 8px 15px;
                    background-color: #1e293b;
                    border-radius: 5px;
                }
                .stat-label {
                    color: #cbd5e1;
                }
                .stat-value {
                    color: #22d3ee;
                    font-weight: bold;
                }
                .mystical {
                    font-style: italic;
                    color: #c084fc;
                    margin: 15px 0;
                }
                .timestamp {
                    color: #94a3b8;
                    font-size: 12px;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <h1>Meiga Sabela</h1>
            <div class="status">MeigaSabela_bot is running</div>
            
            <div class="info">
                <p><strong>Bot Status:</strong> Active and listening for messages</p>
                <p><strong>Channel:</strong> @fogatasreconditas</p>
                <p><strong>Podcast:</strong> Fogatas Reconditas</p>
            </div>
            
            <div class="analytics">
                <h3>User Analytics</h3>
                <div class="stat-row">
                    <span class="stat-label">Users in the last 60 minutes:</span>
                    <span class="stat-value">${analytics.lastHour}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Users in the last day:</span>
                    <span class="stat-value">${analytics.lastDay}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Users in the last 7 days:</span>
                    <span class="stat-value">${analytics.last7Days}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Users in the last 30 days:</span>
                    <span class="stat-value">${analytics.last30Days}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Total unique users:</span>
                    <span class="stat-value">${analytics.totalUniqueUsers}</span>
                </div>
            </div>
            
            <div class="mystical">
                "Eu non creo nas meigas, pero habelas, hainas..."
            </div>
            <p>The wise Galician storyteller is ready to share ancient tales with members of the Fogatas Reconditas community.</p>
            
            <div class="timestamp">
                Last updated: ${new Date().toLocaleString()} | Auto-refresh every 30 seconds
            </div>
        </body>
        </html>
    `);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🌐 Status server running on port ${PORT}`);
});

// Initialize services
const telegramService = new TelegramService(bot);
const mistralService = new MistralService(config.MISTRAL_API_KEY);
const rssService = new RSSService();
const languageDetector = new LanguageDetector();

// Initialize bot after language detector is ready
async function initializeBot() {
    console.log('🧙‍♀️ Meiga Sabela Bot iniciando...');
    
    // Wait for language detector to initialize franc
    await languageDetector.initializeFranc();
    
    console.log('🧙‍♀️ Meiga Sabela Bot iniciado...');
}

initializeBot();

// Handle all messages
bot.on('message', async (msg) => {
    try {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const messageText = msg.text;

        console.log(`Mensaje recibido de ${msg.from.first_name} (${userId}): ${messageText}`);

        // Record user interaction for analytics
        userAnalytics.recordUserInteraction(userId);

        // Send temporary thinking message
        const thinkingMsg = await bot.sendMessage(chatId, '💬');

        // Check channel membership first (PRIORITY)
        const isMember = await telegramService.checkChannelMembership(userId);
        
        if (!isMember) {
            // Delete thinking message
            await bot.deleteMessage(chatId, thinkingMsg.message_id);
            
            // Send hostile response with join button
            await telegramService.sendNonMemberResponse(chatId);
            return;
        }

        // User is a member, proceed with normal functionality
        let response = '';
        let isGalician = false;

        // Detect language
        if (messageText) {
            isGalician = languageDetector.isGalician(messageText);
        }

        // Check if asking about podcast specifically
        if (telegramService.isPodcastQuery(messageText)) {
            const podcastInfo = await rssService.getLatestEpisodes();
            response = await mistralService.generatePodcastResponse(messageText, podcastInfo, isGalician);
        } 
        // Check if asking about legends or where to listen
        else if (telegramService.isLegendsQuery(messageText)) {
            response = await mistralService.generateLegendsResponse(messageText, isGalician);
        }
        // General response
        else {
            response = await mistralService.generateGeneralResponse(messageText, isGalician);
        }

        // Delete thinking message
        await bot.deleteMessage(chatId, thinkingMsg.message_id);

        // Send response with podcast button
        await telegramService.sendResponseWithButton(chatId, response);

    } catch (error) {
        console.error('Error procesando mensaje:', error);
        
        try {
            await bot.sendMessage(msg.chat.id, '🌙 Algo escuro pasou... Téntao de novo máis tarde.');
        } catch (sendError) {
            console.error('Error enviando mensaje de error:', sendError);
        }
    }
});

// Handle callback queries (button presses)
bot.on('callback_query', async (callbackQuery) => {
    try {
        await bot.answerCallbackQuery(callbackQuery.id);
    } catch (error) {
        console.error('Error manejando callback query:', error);
    }
});

// Error handling
bot.on('error', (error) => {
    console.error('Bot error:', error);
});

process.on('SIGINT', () => {
    console.log('🌙 Meiga Sabela descansa...');
    bot.stopPolling();
    process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
