const config = require('../config');
const galicianPhrases = require('../galicianPhrases');

class TelegramService {
    constructor(bot) {
        this.bot = bot;
    }

    /**
     * Check if user is member of the Fogatas Recónditas channel
     */
    async checkChannelMembership(userId) {
        try {
            const chatMember = await this.bot.getChatMember(config.CHANNEL_CHAT_ID, userId);
            
            // Member status can be: 'creator', 'administrator', 'member', 'restricted', 'left', 'kicked'
            return ['creator', 'administrator', 'member'].includes(chatMember.status);
        } catch (error) {
            console.error('Error verificando membresía:', error);
            
            // If we can't verify (user privacy settings, etc.), assume they're not a member
            // This is safer than assuming they are a member
            return false;
        }
    }

    /**
     * Send hostile response to non-members with join button
     */
    async sendNonMemberResponse(chatId) {
        const hostileMessages = [
            "¿E ti quen es? Non te coñezo de nada. Se non estás no noso círculo, non me fagas perder o tempo con parvadas.",
            "¡Mal raio te parta! ¿Que fas aquí se non es do noso aquelarre? Únete primeiro antes de molestarme.",
            "¡Neno/a! Non me vengas con historias se non estás na nosa xente. Déixame en paz ou únete ao grupo.",
            "Seráche cousa de atrevidos... Non che vou contar nada se non formas parte do noso círculo. NO TE VOY A CONTAR NADA hasta que no te unes al viaje."
        ];

        const randomMessage = hostileMessages[Math.floor(Math.random() * hostileMessages.length)];
        const fullMessage = `${randomMessage}\n\nÚnete al canal de Fogatas Recónditas o DÉIXAME EN PAZ`;

        const keyboard = {
            inline_keyboard: [[
                {
                    text: "🔮 Quiero unirme al canal",
                    url: config.CHANNEL_INVITE_LINK
                }
            ]]
        };

        await this.bot.sendMessage(chatId, fullMessage, {
            reply_markup: keyboard
        });
    }

    /**
     * Send response with podcast promotion button
     */
    async sendResponseWithButton(chatId, text) {
        const keyboard = {
            inline_keyboard: [[
                {
                    text: "🎧 Escucha Fogatas Recónditas",
                    url: config.PODCAST_LINKTREE
                }
            ]]
        };

        await this.bot.sendMessage(chatId, text, {
            reply_markup: keyboard,
            parse_mode: 'Markdown'
        });
    }

    /**
     * Check if message is asking about the podcast
     */
    isPodcastQuery(messageText) {
        if (!messageText) return false;
        
        const podcastKeywords = [
            'podcast', 'episodio', 'fogatas', 'recónditas', 'federico', 'sergio',
            'anfitriones', 'conductores', 'programa', 'episodios'
        ];

        const text = messageText.toLowerCase();
        return podcastKeywords.some(keyword => text.includes(keyword));
    }

    /**
     * Check if message is asking about legends or where to listen
     */
    isLegendsQuery(messageText) {
        if (!messageText) return false;
        
        const legendsKeywords = [
            'leyenda', 'leyendas', 'historia', 'historias', 'mitos', 'galicia',
            'gallega', 'gallegas', 'escuchar', 'dónde', 'donde', 'plataforma'
        ];

        const text = messageText.toLowerCase();
        return legendsKeywords.some(keyword => text.includes(keyword));
    }
}

module.exports = TelegramService;
