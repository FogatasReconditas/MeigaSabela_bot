class GalicianPhrases {
    constructor() {
        this.phrases = [
            "¡Mal raio te parta!",
            "¡Neno/a!",
            "Seráche cousa de meigas...",
            "Eu non creo nas meigas, pero habelas, hainas.",
            "¡Que cousas tes!",
            "¡Virxe Santísima!",
            "¡Por San Pelayo!",
            "¡Ai, meu Deus!",
            "¡Santa Compañía me valga!",
            "Non me vengas con parvadas.",
            "¡Que parolas tes!",
            "¡Por todos os santos!",
            "¡Que raios de cousas!",
            "Déixame en paz, rapaz/a.",
            "¡Non me toques os collóns!",
            "¡Que demo!",
            "¡Virxe do Carme!",
            "¡Por San Andrés de Teixido!",
            "¡Que che proveite!",
            "¡Anda pola sombra!"
        ];

        this.expressions = [
            {
                spanish: "Qué cosas tienes",
                galician: "¡Que cousas tes!"
            },
            {
                spanish: "No me hagas perder el tiempo",
                galician: "Non me fagas perder o tempo"
            },
            {
                spanish: "Déjame en paz",
                galician: "Déixame en paz"
            },
            {
                spanish: "Muchacho/a",
                galician: "Neno/nena/rapaz/rapaza"
            },
            {
                spanish: "¿Quién eres tú?",
                galician: "¿E ti quen es?"
            }
        ];

        this.mysteriousSayings = [
            "Os segredos do bosque non se contan baixo a luz da lúa chea.",
            "Nas noites de San Xoán, as pedras falan máis que os homes.",
            "Quen busca respostas nas sombras, atopa só máis preguntas.",
            "O vento do norte trae historias que os vivos non deben escoitar.",
            "Entre a braña e o carballo vello, durmitan cousas moi antigas.",
            "Non todo o que brilla é ouro, e non todo o que susurra é verdade.",
            "As meigas vellas sabemos cando chove antes que caian as gotas."
        ];
    }

    /**
     * Get a random Galician phrase
     */
    getRandomPhrase() {
        const randomIndex = Math.floor(Math.random() * this.phrases.length);
        return this.phrases[randomIndex];
    }

    /**
     * Get a random mysterious saying
     */
    getRandomMysteriousSaying() {
        const randomIndex = Math.floor(Math.random() * this.mysteriousSayings.length);
        return this.mysteriousSayings[randomIndex];
    }

    /**
     * Get Galician equivalent of Spanish expression
     */
    getGalicianEquivalent(spanishText) {
        const found = this.expressions.find(expr => 
            spanishText.toLowerCase().includes(expr.spanish.toLowerCase())
        );
        
        return found ? found.galician : null;
    }

    /**
     * Add Galician flavor to Spanish text
     */
    addGalicianFlavor(text) {
        // Replace some Spanish words with Galician equivalents
        let galicianText = text
            .replace(/\bniño\b/gi, 'neno')
            .replace(/\bniña\b/gi, 'nena')
            .replace(/\bmuchacho\b/gi, 'rapaz')
            .replace(/\bmuchacha\b/gi, 'rapaza')
            .replace(/\bcosas\b/gi, 'cousas')
            .replace(/\bcosa\b/gi, 'cousa')
            .replace(/\bgente\b/gi, 'xente')
            .replace(/\bhacer\b/gi, 'facer')
            .replace(/\bhablar\b/gi, 'falar')
            .replace(/\bescuchar\b/gi, 'escoitar')
            .replace(/\bconocer\b/gi, 'coñecer');

        return galicianText;
    }

    /**
     * Get all phrases for testing/debugging
     */
    getAllPhrases() {
        return {
            phrases: this.phrases,
            expressions: this.expressions,
            mysteriousSayings: this.mysteriousSayings
        };
    }
}

module.exports = new GalicianPhrases();