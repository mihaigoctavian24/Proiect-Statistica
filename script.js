document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const heatmapInput = document.getElementById('heatmapInput');
    const placeholderText = document.getElementById('placeholderText');
    const clearBtn = document.getElementById('clearBtn');
    const randomBtn = document.getElementById('randomBtn');

    // Controls
    const alphaSlider = document.getElementById('alphaSlider');
    const alphaValue = document.getElementById('alphaValue');
    const priorSlider = document.getElementById('priorSlider');
    const priorValue = document.getElementById('priorValue');

    // Outputs
    const resultSection = document.getElementById('resultSection');
    const classificationBadge = document.getElementById('classificationBadge');
    const classificationIcon = document.getElementById('classificationIcon');
    const classificationText = document.getElementById('classificationText');
    const spamProbValue = document.getElementById('spamProbValue');
    const spamBar = document.getElementById('spamBar');
    const formulaDisplay = document.getElementById('formulaDisplay');

    // State
    class DynamicNaiveBayes {
        constructor() {
            this.counts = null; // Raw counts from JSON
            this.alpha = 1.0;
            this.priorSpam = 0.5; // User-defined prior
            this.isLoaded = false;
        }

        async load() {
            try {
                const response = await fetch('model.json');
                this.counts = await response.json();
                this.isLoaded = true;
                console.log("✅ Model counts loaded!", this.counts);
            } catch (error) {
                console.error("Error loading model:", error);
                alert("Nu s-a putut încărca model.json. Verifică serverul local.");
            }
        }

        predict(text) {
            if (!this.isLoaded) return null;

            const tokens = this.preprocess(text);
            if (tokens.length === 0) return null;

            // 1. Priors (from slider)
            // Log odds to avoid underflow
            let logProbSpam = Math.log(this.priorSpam);
            let logProbHam = Math.log(1 - this.priorSpam);

            const tokenDetails = [];

            // 2. Evidence (Likelihoods)
            // Recalculate P(w|c) using current Alpha
            const vocabSize = this.counts.vocabulary.length;

            // Stats needed for calculation
            const spamTotalWords = this.counts.total_words_in_class.spam;
            const hamTotalWords = this.counts.total_words_in_class.ham;

            tokens.forEach(token => {
                if (this.counts.vocabulary.includes(token)) {
                    // Counts for this word
                    const countSpam = this.counts.word_counts.spam[token] || 0;
                    const countHam = this.counts.word_counts.ham[token] || 0;

                    // Smoothed Probabilities (Dynamic!)
                    const pWordSpam = (countSpam + this.alpha) / (spamTotalWords + this.alpha * vocabSize);
                    const pWordHam = (countHam + this.alpha) / (hamTotalWords + this.alpha * vocabSize);

                    logProbSpam += Math.log(pWordSpam);
                    logProbHam += Math.log(pWordHam);

                    // Determine "Spamminess" for heatmap
                    // Ratio > 1 means more likely Spam
                    const ratio = pWordSpam / pWordHam;
                    tokenDetails.push({ token, ratio, pWordSpam, pWordHam });
                } else {
                    // Unknown word -> neutral highlight
                    tokenDetails.push({ token, ratio: 1.0, isUnknown: true });
                }
            });

            // 3. Normalize
            const maxLog = Math.max(logProbSpam, logProbHam);
            const probSpamUnnorm = Math.exp(logProbSpam - maxLog);
            const probHamUnnorm = Math.exp(logProbHam - maxLog);
            const total = probSpamUnnorm + probHamUnnorm;

            const finalPSpam = probSpamUnnorm / total;

            return {
                pSpam: finalPSpam,
                tokenDetails
            };
        }

        preprocess(text) {
            return text.toLowerCase()
                .replace(/[^a-zmwăâîșț\s]/g, '')
                .split(/\s+/)
                .filter(t => t.length > 0);
        }
    }

    const nb = new DynamicNaiveBayes();
    nb.load();

    // Event Listeners for Interactivity
    function updateAnalysis() {
        const text = heatmapInput.innerText;

        // Toggle placeholder
        placeholderText.style.display = text.trim() ? 'none' : 'block';

        if (!text.trim()) {
            resultSection.classList.add('hidden');
            return;
        }

        const result = nb.predict(text);
        if (result) {
            displayResults(result);
            highlightText(text, result.tokenDetails);
        }
    }

    // Input Input
    heatmapInput.addEventListener('input', updateAnalysis);

    // Slider: Alpha
    alphaSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        nb.alpha = val;
        alphaValue.innerText = val.toFixed(1);
        updateAnalysis(); // Re-calc immediately
    });

    // Slider: Prior
    priorSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        nb.priorSpam = val / 100;
        priorValue.innerText = val + '%';
        updateAnalysis(); // Re-calc
    });

    // Helper: Random
    randomBtn.addEventListener('click', () => {
        const examples = [
            "FELICITĂRI! Ai câștigat un iPhone 15 GRATUIT! Click ACUM!",
            "Bună! Ne vedem la meeting mâine la ora 10?",
            "URGENT: Contul tău a expirat. Reactivează ACUM pentru bonus 1000 EUR!",
            "Raportul de statistică este gata. L-am încărcat pe drive.",
            "Ofertă EXCLUSIVĂ! Slăbește 10kg în 2 zile! Click aici!"
        ];
        heatmapInput.innerText = examples[Math.floor(Math.random() * examples.length)];
        updateAnalysis();
    });

    clearBtn.addEventListener('click', () => {
        heatmapInput.innerText = '';
        updateAnalysis();
        heatmapInput.focus();
    });

    // --- Visualization Logic ---

    function displayResults(result) {
        resultSection.classList.remove('hidden');

        const pSpam = result.pSpam;
        const isSpam = pSpam > 0.5;

        // Badge
        classificationBadge.className = `classification-badge ${isSpam ? 'spam' : 'ham'}`;
        classificationIcon.innerHTML = isSpam ? '<i class="fas fa-exclamation-triangle"></i>' : '<i class="fas fa-check-circle"></i>';
        classificationText.innerText = isSpam ? 'SPAM' : 'HAM';

        // Bar
        const pPct = (pSpam * 100).toFixed(1);
        spamProbValue.innerText = `${pPct}%`;
        spamBar.style.width = `${pPct}%`;

        // Math Formula
        // Just showing the values for P(Spam) and evidence product metaphorically
        formulaDisplay.innerText = `P(Spam|W) ≈ ${(nb.priorSpam).toFixed(2)} × Evidence_Score`;
    }

    // Advanced: Highlight words in place without breaking cursor?
    // For simple demo, we just color the known words if the user isn't currently typing inside them? 
    // Or simpler: Just accept that the contenteditable is tricky. 
    // Simpler approach for demo: The "input" is plain text, but we have a separate "view" or we just treat contenteditable carefully.
    // Actually, coloring inside contenteditable while typing is hard.
    // Compromise: We don't color "inside" the input while typing (too buggy).
    // We just calculate.
    // BUT user wanted "Heatmap". 
    // Let's implement a simple "Highlighter" that runs on debounce or just colors the text if not focused?
    // No, let's keep it simple: We won't color the input text itself to avoid cursor jumping.
    // We will assume the "Heatmap" is the analysis result chips we had before, OR we overlay.
    // WAIT: I can just render the chips BELOW the input like "See how the model sees it".

    function highlightText(text, tokenDetails) {
        // We will stick to the previous "Token Chips" approach but enhance it to look like a reconstructed sentence
        // Or actually, let's try to make a "Heatmap visualization" below the input.

        let existingVis = document.getElementById('heatmapVis');
        if (!existingVis) {
            existingVis = document.createElement('div');
            existingVis.id = 'heatmapVis';
            existingVis.className = 'explanation';
            existingVis.style.marginTop = '1rem';
            existingVis.style.lineHeight = '1.8';
            document.querySelector('.input-section').appendChild(existingVis);
        }

        existingVis.innerHTML = '<div style="font-size: 0.9rem; color: #94a3b8; margin-bottom: 0.5rem">Vizualizare Impact Cuvinte (Roșu = Spam, Verde = Ham):</div>';

        // Reconstruct "sentence" with highlighting
        // This is approximate as we lost original whitespace, but good enough for token vis
        tokenDetails.forEach(item => {
            const span = document.createElement('span');
            span.innerText = item.token + ' ';
            span.style.padding = '2px 4px';
            span.style.borderRadius = '4px';
            span.style.marginRight = '4px';

            if (!item.isUnknown) {
                // Color intensity based on ratio
                if (item.ratio > 1.2) {
                    // Spammy
                    span.style.backgroundColor = `rgba(239, 68, 68, ${Math.min(0.8, (item.ratio - 1) * 0.5)})`;
                    span.style.color = '#fff';
                } else if (item.ratio < 0.8) {
                    // Hammy
                    span.style.backgroundColor = `rgba(34, 197, 94, ${Math.min(0.8, (1 - item.ratio) * 0.5)})`;
                    span.style.color = '#fff';
                } else {
                    span.style.color = '#94a3b8'; // Neutral
                }
            } else {
                span.style.color = '#64748b'; // Unknown
                span.style.textDecoration = 'line-through';
            }
            existingVis.appendChild(span);
        });
    }
});
