const { Mistral } = require('@mistralai/mistralai');
const characterPrompt = require('../characterPrompt');
const galicianPhrases = require('../galicianPhrases');

class MistralService {
    constructor(apiKey) {
        this.client = new Mistral({
            apiKey: apiKey
        });
    }

    /**
     * Generate general response maintaining Meiga Sabela character
     */
    async generateGeneralResponse(userMessage, isGalician = false) {
        try {
            const systemPrompt = isGalician ? 
                characterPrompt.getGalicianPrompt() : 
                characterPrompt.getSpanishPrompt();

            const chatResponse = await this.client.chat.complete({
                model: 'mistral-large-latest',
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: userMessage
                    }
                ],
                temperature: 0.8,
                max_tokens: 500
            });

            let response = chatResponse.choices[0].message.content;
            
            // Add some authentic Galician phrases occasionally
            if (!isGalician && Math.random() < 0.3) {
                response += `\n\n${galicianPhrases.getRandomPhrase()}`;
            }

            return response;

        } catch (error) {
            console.error('Error generando respuesta general:', error);
            return isGalician ? 
                "🌙 Algo escuro me impide ver con claridade... Téntao de novo." :
                "🌙 Algo oscuro me impide ver con claridad... Inténtalo de nuevo.";
        }
    }

    /**
     * Generate response about podcast using RSS data
     */
    async generatePodcastResponse(userMessage, podcastInfo, isGalician = false) {
        try {
            const systemPrompt = isGalician ? 
                characterPrompt.getGalicianPodcastPrompt() : 
                characterPrompt.getSpanishPodcastPrompt();

            const podcastContext = `
Información actual del podcast @fogatasreconditas:
${JSON.stringify(podcastInfo, null, 2)}
            `;

            const chatResponse = await this.client.chat.complete({
                model: 'mistral-large-latest',
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt + '\n\n' + podcastContext
                    },
                    {
                        role: 'user',
                        content: userMessage
                    }
                ],
                temperature: 0.7,
                max_tokens: 600
            });

            return chatResponse.choices[0].message.content;

        } catch (error) {
            console.error('Error generando respuesta sobre podcast:', error);
            
            const fallbackResponse = isGalician ? 
                "Ah, eses dous... o italiano e o venezolano. Andan a remexer nas miñas historias antigas. Se queres saber que descubriron, escoita o que contan..." :
                "Ah, esos dos... el italiano y el venezolano. Andan removiendo mis historias antiguas. Si quieres saber qué descubrieron, escucha lo que cuentan...";
            
            return fallbackResponse;
        }
    }

    /**
     * Generate response about legends and where to listen
     */
    async generateLegendsResponse(userMessage, isGalician = false) {
        try {
            const systemPrompt = isGalician ? 
                characterPrompt.getGalicianLegendsPrompt() : 
                characterPrompt.getSpanishLegendsPrompt();

            const chatResponse = await this.client.chat.complete({
                model: 'mistral-large-latest',
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: userMessage
                    }
                ],
                temperature: 0.7,
                max_tokens: 400
            });

            return chatResponse.choices[0].message.content;

        } catch (error) {
            console.error('Error generando respuesta sobre leyendas:', error);
            
            const fallbackResponse = isGalician ? 
                "As historias antigas non se contan a calquera. Escoita o que se di nas noites de San Xoán... ou mellor, escoita a eses dous rapaces se queres saber máis." :
                "Las historias antiguas no se cuentan a cualquiera. Escucha lo que se dice en las noches de San Juan... o mejor, escucha a esos dos muchachos si quieres saber más.";
            
            return fallbackResponse;
        }
    }
}

module.exports = MistralService;
