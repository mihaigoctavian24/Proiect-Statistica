export class NaiveBayes {
    constructor(modelData) {
        this.model = modelData;
    }

    preprocess(text) {
        return text.toLowerCase()
            .replace(/[^a-zmwăâîșț\s]/g, '')
            .split(/\s+/)
            .filter(t => t.length > 0);
    }

    predict(text, alpha = 1.0, priorSpam = 0.5) {
        const tokens = this.preprocess(text);
        if (tokens.length === 0) return null;

        // 1. Priors
        const logPriorSpam = Math.log(priorSpam);
        const logPriorHam = Math.log(1 - priorSpam);

        let logProbSpam = logPriorSpam;
        let logProbHam = logPriorHam;

        const steps = []; // For visualization
        const vocabSize = this.model.vocabulary.length;
        const spamTotal = this.model.total_words_in_class.spam;
        const hamTotal = this.model.total_words_in_class.ham;

        // 2. Evidence
        tokens.forEach(token => {
            let pWordSpam, pWordHam, type;

            const inVocab = this.model.vocabulary.includes(token);

            if (inVocab) {
                const countSpam = this.model.word_counts.spam[token] || 0;
                const countHam = this.model.word_counts.ham[token] || 0;

                // Dynamic Smoothing
                pWordSpam = (countSpam + alpha) / (spamTotal + alpha * vocabSize);
                pWordHam = (countHam + alpha) / (hamTotal + alpha * vocabSize);
                type = 'known';
            } else {
                // Unknown word smoothing
                pWordSpam = alpha / (spamTotal + alpha * vocabSize);
                pWordHam = alpha / (hamTotal + alpha * vocabSize);
                type = 'unknown';
            }

            logProbSpam += Math.log(pWordSpam);
            logProbHam += Math.log(pWordHam);

            steps.push({
                token,
                inVocab,
                pSpam: pWordSpam,
                pHam: pWordHam,
                ratio: pWordSpam / pWordHam,
                logSpamContrib: Math.log(pWordSpam),
                logHamContrib: Math.log(pWordHam)
            });
        });

        // 3. Normalize
        const maxLog = Math.max(logProbSpam, logProbHam);
        const probSpamUnnorm = Math.exp(logProbSpam - maxLog);
        const probHamUnnorm = Math.exp(logProbHam - maxLog);
        const total = probSpamUnnorm + probHamUnnorm;

        const finalPSpam = probSpamUnnorm / total;

        return {
            isSpam: finalPSpam > 0.5,
            pSpam: finalPSpam,
            pHam: 1 - finalPSpam,
            logSpam: logProbSpam,
            logHam: logProbHam,
            tokens: steps
        };
    }
}
