class LanguageDetector {
    constructor() {
        this.franc = null;
        this.initializeFranc();
        
        // Common Galician words and phrases for detection
        this.galicianIndicators = [
            // Common Galician words
            'que', 'como', 'onde', 'cando', 'quen', 'porque', 'para', 'con',
            'non', 'mais', 'tamén', 'agora', 'despois', 'antes', 'sempre',
            'nunca', 'aquí', 'alí', 'todo', 'nada', 'algo', 'algún',
            
            // Galician specific words that don't exist in Spanish
            'galiza', 'neno', 'nena', 'meiga', 'meigas', 'aquelarre',
            'raio', 'cousa', 'cousas', 'rapaz', 'rapaza', 'xente',
            'facer', 'falar', 'contar', 'escoitar', 'saber', 'coñecer',
            
            // Galician conjugations and expressions
            'téntao', 'déixame', 'únete', 'hainas', 'habelas',
            'seráche', 'atreveivos', 'facede'
        ];

        // Spanish indicators for comparison
        this.spanishIndicators = [
            'que', 'como', 'donde', 'cuando', 'quien', 'porque', 'para', 'con',
            'no', 'pero', 'también', 'ahora', 'después', 'antes', 'siempre',
            'nunca', 'aquí', 'allí', 'todo', 'nada', 'algo', 'algún',
            'hacer', 'hablar', 'contar', 'escuchar', 'saber', 'conocer'
        ];
    }

    /**
     * Initialize franc library with dynamic import
     */
    async initializeFranc() {
        try {
            const francModule = await import('franc');
            this.franc = francModule.franc;
        } catch (error) {
            console.warn('Could not load franc library:', error);
            this.franc = null;
        }
    }

    /**
     * Detect if text is written in Galician
     */
    isGalician(text) {
        if (!text || text.length < 10) {
            return false;
        }

        const normalizedText = text.toLowerCase();
        
        // Count Galician indicators
        const galicianMatches = this.galicianIndicators.filter(word => 
            normalizedText.includes(word)
        ).length;

        // Count Spanish indicators that are NOT also Galician
        const spanishOnlyWords = this.spanishIndicators.filter(word => 
            !this.galicianIndicators.includes(word)
        );
        const spanishMatches = spanishOnlyWords.filter(word => 
            normalizedText.includes(word)
        ).length;

        // Use franc library as secondary detection if available
        let francSaysGalician = false;
        if (this.franc) {
            try {
                const detectedLang = this.franc(text);
                francSaysGalician = detectedLang === 'glg';
            } catch (error) {
                console.warn('Error using franc:', error);
            }
        }

        // Decision logic
        if (galicianMatches > spanishMatches) {
            return true;
        }

        if (francSaysGalician && galicianMatches > 0) {
            return true;
        }

        // Check for specific Galician patterns
        const galicianPatterns = [
            /\bgl[aeiou]/gi,  // gl- combinations common in Galician
            /\bñ[aeiou]/gi,   // ñ- combinations
            /\bch[aeiou]/gi,  // ch- combinations
            /\bxen/gi,        // "xen" pattern
            /\bsei/gi,        // "sei" pattern
        ];

        const patternMatches = galicianPatterns.filter(pattern => 
            pattern.test(normalizedText)
        ).length;

        return patternMatches >= 2 || (patternMatches >= 1 && galicianMatches > 0);
    }

    /**
     * Get confidence score for language detection
     */
    getDetectionConfidence(text) {
        if (!text) return 0;

        const isGal = this.isGalician(text);
        let francResult = null;
        
        if (this.franc) {
            try {
                francResult = this.franc(text);
            } catch (error) {
                console.warn('Error using franc for confidence:', error);
            }
        }
        
        if (isGal && francResult === 'glg') {
            return 0.9;
        } else if (isGal || francResult === 'glg') {
            return 0.7;
        } else {
            return 0.3;
        }
    }
}

module.exports = LanguageDetector;
