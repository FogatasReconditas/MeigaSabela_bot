const Parser = require('rss-parser');
const config = require('../config');

class RSSService {
    constructor() {
        this.parser = new Parser();
    }

    /**
     * Get latest episodes from RSS feed
     */
    async getLatestEpisodes(limit = 5) {
        try {
            const feed = await this.parser.parseURL(config.RSS_FEED_URL);
            
            const episodes = feed.items.slice(0, limit).map(item => ({
                title: item.title,
                description: item.contentSnippet || item.description,
                link: item.link,
                pubDate: item.pubDate,
                duration: item.itunes?.duration
            }));

            return {
                podcastTitle: feed.title,
                description: feed.description,
                totalEpisodes: feed.items.length,
                latestEpisodes: episodes
            };

        } catch (error) {
            console.error('Error obteniendo información del RSS:', error);
            
            // Return fallback information
            return {
                podcastTitle: "Fogatas Recónditas",
                description: "Podcast de leyendas gallegas conducido por Federico y Sergio",
                totalEpisodes: 0,
                latestEpisodes: [],
                error: "No se pudo obtener información actualizada del feed RSS"
            };
        }
    }

    /**
     * Search episodes by keyword
     */
    async searchEpisodes(keyword, limit = 3) {
        try {
            const feed = await this.parser.parseURL(config.RSS_FEED_URL);
            
            const matchingEpisodes = feed.items
                .filter(item => 
                    item.title.toLowerCase().includes(keyword.toLowerCase()) ||
                    (item.contentSnippet && item.contentSnippet.toLowerCase().includes(keyword.toLowerCase()))
                )
                .slice(0, limit)
                .map(item => ({
                    title: item.title,
                    description: item.contentSnippet || item.description,
                    link: item.link,
                    pubDate: item.pubDate
                }));

            return matchingEpisodes;

        } catch (error) {
            console.error('Error buscando episodios:', error);
            return [];
        }
    }
}

module.exports = RSSService;
