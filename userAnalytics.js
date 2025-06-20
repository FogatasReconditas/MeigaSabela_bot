class UserAnalytics {
    constructor() {
        this.userInteractions = new Map(); // userId -> array of timestamps
    }

    /**
     * Record a user interaction
     */
    recordUserInteraction(userId) {
        const timestamp = Date.now();
        
        if (!this.userInteractions.has(userId)) {
            this.userInteractions.set(userId, []);
        }
        
        this.userInteractions.get(userId).push(timestamp);
        
        // Clean old interactions (older than 30 days)
        this.cleanOldInteractions();
    }

    /**
     * Clean interactions older than 30 days
     */
    cleanOldInteractions() {
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        
        for (const [userId, timestamps] of this.userInteractions.entries()) {
            const recentTimestamps = timestamps.filter(ts => ts > thirtyDaysAgo);
            
            if (recentTimestamps.length === 0) {
                this.userInteractions.delete(userId);
            } else {
                this.userInteractions.set(userId, recentTimestamps);
            }
        }
    }

    /**
     * Get unique users in the last X milliseconds
     */
    getUsersInTimeRange(milliseconds) {
        const cutoffTime = Date.now() - milliseconds;
        const uniqueUsers = new Set();
        
        for (const [userId, timestamps] of this.userInteractions.entries()) {
            const hasRecentInteraction = timestamps.some(ts => ts > cutoffTime);
            if (hasRecentInteraction) {
                uniqueUsers.add(userId);
            }
        }
        
        return uniqueUsers.size;
    }

    /**
     * Get analytics for different time periods
     */
    getAnalytics() {
        const oneHour = 60 * 60 * 1000;
        const oneDay = 24 * oneHour;
        const sevenDays = 7 * oneDay;
        const thirtyDays = 30 * oneDay;

        return {
            lastHour: this.getUsersInTimeRange(oneHour),
            lastDay: this.getUsersInTimeRange(oneDay),
            last7Days: this.getUsersInTimeRange(sevenDays),
            last30Days: this.getUsersInTimeRange(thirtyDays),
            totalUniqueUsers: this.userInteractions.size
        };
    }
}

module.exports = new UserAnalytics();