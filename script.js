document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const messageInput = document.getElementById('messageInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const randomBtn = document.getElementById('randomBtn');
    const resultSection = document.getElementById('resultSection');

    // UI Output Elements
    const classificationBadge = document.getElementById('classificationBadge');
    const classificationIcon = document.getElementById('classificationIcon');
    const classificationText = document.getElementById('classificationText');
    const spamProbValue = document.getElementById('spamProbValue');
    const hamProbValue = document.getElementById('hamProbValue');
    const spamBar = document.getElementById('spamBar');
    const hamBar = document.getElementById('hamBar');
    const explanationText = document.getElementById('explanationText');
    const tokenChips = document.getElementById('tokenChips');

    // State
    let model = null;
    let isModelLoaded = false;

    // Random Examples
    const examples = [
        "FELICITĂRI! Ai câștigat un iPhone 15 GRATUIT! Click ACUM!",
        "Bună! Ne vedem la meeting mâine la ora 10?",
        "URGENT: Contul tău a expirat. Reactivează ACUM pentru bonus 1000 EUR!",
        "Raportul de statistică este gata. L-am încărcat pe drive.",
        "Ofertă EXCLUSIVĂ! Slăbește 10kg în 2 zile! Click aici!",
        "Mulțumesc pentru ajutorul de ieri, a fost foarte util."
    ];

    // Load Model
    async function loadModel() {
        try {
            const response = await fetch('model.json');
            model = await response.json();
            isModelLoaded = true;
            console.log("✅ Model loaded successfully!", model);
        } catch (error) {
            console.error("❌ Error loading model:", error);
            alert("Eroare la încărcarea modelului (model.json). Asigură-te că rulezi pe un server web (ex: Live Server).");
        }
    }

    loadModel();

    // Event Listeners
    analyzeBtn.addEventListener('click', () => {
        if (!isModelLoaded) {
            alert("Modelul încă se încarcă...");
            return;
        }
        if (!messageInput.value.trim()) {
            alert("Introduceți un mesaj!");
            return;
        }
        analyzeMessage(messageInput.value);
    });

    clearBtn.addEventListener('click', () => {
        messageInput.value = '';
        resultSection.classList.add('hidden');
    });

    randomBtn.addEventListener('click', () => {
        const randomMsg = examples[Math.floor(Math.random() * examples.length)];
        messageInput.value = randomMsg;
        // Optional: Auto analyze
        // analyzeMessage(randomMsg);
    });

    // Core Logic
    function preprocess(text) {
        // Lowercase
        text = text.toLowerCase();
        // Remove special chars (keep only letters and spaces)
        // Note: JS regex for unicode ranges is a bit different, but this works for basic needs
        // Simplification for demo: replace anything not a letter or space with empty
        text = text.replace(/[^a-zmwăâîșț\s]/g, '');
        // Tokenize
        return text.split(/\s+/).filter(t => t.length > 0);
    }

    function analyzeMessage(text) {
        const tokens = preprocess(text);

        if (tokens.length === 0) {
            alert("Mesajul nu conține cuvinte valide!");
            return;
        }

        // Implementation of predict_proba from Python

        // 1. Log Priors
        let logProbSpam = Math.log(model.class_probs.spam);
        let logProbHam = Math.log(model.class_probs.ham);

        const usedTokens = [];

        // 2. Sum Log Likelihoods
        tokens.forEach(token => {
            if (model.vocabulary.includes(token)) {
                logProbSpam += Math.log(model.word_probs.spam[token]);
                logProbHam += Math.log(model.word_probs.ham[token]);
                usedTokens.push(token);
            } else {
                // Ignore unknown words (or apply smoothing logic if complex, but simple ignore works for demo)
                // Actually my export includes smoothing in the probs, 
                // but for unknown words we skip them in standard NB or assign 1/vocab with smoothing.
                // For simplicity here: skip unknown words as they don't add info in this specific constrained vocab model
            }
        });

        // 3. Log-Sum-Exp Trick (to go back to probability space without underflow)
        // Or simply: since we just have 2 classes, we can normalize directly from exp
        // But to be safe against overflow of exp, we subtract max
        const maxLog = Math.max(logProbSpam, logProbHam);
        const probSpamUnnorm = Math.exp(logProbSpam - maxLog);
        const probHamUnnorm = Math.exp(logProbHam - maxLog);

        const total = probSpamUnnorm + probHamUnnorm;

        const pSpam = probSpamUnnorm / total;
        const pHam = probHamUnnorm / total;

        displayResults(pSpam, pHam, usedTokens);
    }

    function displayResults(pSpam, pHam, tokens) {
        // Show section
        resultSection.classList.remove('hidden');
        resultSection.style.opacity = 0;
        setTimeout(() => {
            resultSection.style.opacity = 1;
        }, 10);

        // Update Values
        const isSpam = pSpam > pHam;

        // Badge
        classificationBadge.className = `classification-badge ${isSpam ? 'spam' : 'ham'}`;
        classificationIcon.innerHTML = isSpam ? '<i class="fas fa-exclamation-triangle"></i>' : '<i class="fas fa-check-circle"></i>';
        classificationText.innerText = isSpam ? 'SPAM DETECTAT' : 'MESAJ LEGITIM (HAM)';

        // Bars
        const pSpamPct = (pSpam * 100).toFixed(1);
        const pHamPct = (pHam * 100).toFixed(1);

        spamProbValue.innerText = `${pSpamPct}%`;
        hamProbValue.innerText = `${pHamPct}%`;

        // Animate bars
        setTimeout(() => {
            spamBar.style.width = `${pSpamPct}%`;
            hamBar.style.width = `${pHamPct}%`;
        }, 100);

        // Explanation / Tokens
        tokenChips.innerHTML = '';
        if (tokens.length > 0) {
            explanationText.innerText = `Analiza s-a bazat pe ${tokens.length} cuvinte recunoscute din vocabularul modelului (antrenat pe 30 mesaje).`;
            tokens.forEach(t => {
                const chip = document.createElement('span');
                chip.className = 'chip highlight';
                chip.innerText = t;
                tokenChips.appendChild(chip);
            });
        } else {
            explanationText.innerText = "Niciun cuvânt din mesaj nu a fost găsit în vocabularul de antrenare (model mic).";
        }
    }
});
