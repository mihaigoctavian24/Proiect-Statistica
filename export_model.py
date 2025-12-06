import json
import math
from collections import Counter
import re
import os

# --- 1. DATASET ---
spam_messages = [
    "FELICITĂRI! Ai câștigat 1000 EURO! Click aici ACUM pentru a revendica premiul!",
    "Ofertă LIMITATĂ! Cumpără Viagra acum cu 90% REDUCERE!",
    "Ai fost selectat pentru un PREMIU CASH de 5000 EUR! Click aici!",
    "FREE MONEY! Win big prizes! Click now!",
    "Câștigă bani rapid de acasă! Fără investiție! Click aici!",
    "URGENT: Contul tău a fost blocat. Click pentru a reactiva ACUM!",
    "Congratulations! You won a FREE iPhone! Claim now!",
    "Make money fast! Work from home! No experience needed!",
    "Slăbește 10 kg în 7 zile! Pastile MAGICE! Comandă acum!",
    "CASINO ONLINE - Bonus 1000 EUR la prima depunere! Joacă acum!",
    "Credit rapid fără acte! Aprobat în 5 minute! Click aici!",
    "Winner! You have been selected for cash prize! Act now!",
    "Cumpără followeri Instagram! 10000 followeri doar 50 EUR!",
    "OFERTĂ ȘOCANTĂ! Rolex original doar 99 EUR! Stock limitat!",
    "Câștigă bani din reclame! 500 EUR/zi garantat!",
]

ham_messages = [
    "Bună! Ne vedem mâine la cafea?",
    "Ți-am trimis raportul pe email. Verifică te rog.",
    "Meetingul de astăzi este amânat pentru mâine la 10:00.",
    "Hi, how are you doing today?",
    "Ai terminat proiectul la statistică? Să discutăm.",
    "Documentația pentru cursul de AI este disponibilă pe platformă.",
    "Can we schedule a call for tomorrow afternoon?",
    "Mulțumesc pentru ajutor cu tema! A fost foarte util.",
    "Conferința despre Machine Learning este pe 15 martie.",
    "Your order has been shipped. Tracking number: ABC123.",
    "Bună seara! Ai primit notițele de la curs?",
    "Team meeting at 3 PM in conference room B.",
    "Ar fi bine să ne pregătim pentru examen împreună.",
    "The project deadline has been extended by one week.",
    "Mulțumesc pentru recomandarea de carte! O să o citesc.",
]

def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'[^a-zăâîșț\s]', '', text)
    tokens = text.split()
    return tokens

# Prepare data
messages = spam_messages + ham_messages
labels = ['spam'] * len(spam_messages) + ['ham'] * len(ham_messages)
tokenized_messages = [preprocess_text(msg) for msg in messages]

# --- 2. MODEL TRAINING (Logic from notebook, adapted for params) ---
class NaiveBayesClassifier:
    def __init__(self, alpha=1.0):
        self.alpha = alpha
        self.class_probs = {}
        self.word_probs = {}
        self.vocabulary = set()

    def fit(self, messages, labels):
        # 1. Class probabilities
        total_messages = len(labels)
        spam_count = sum(1 for l in labels if l == 'spam')
        ham_count = sum(1 for l in labels if l == 'ham')
        
        self.class_probs['spam'] = spam_count / total_messages
        self.class_probs['ham'] = ham_count / total_messages

        # 2. Build vocabulary and counts
        word_counts = {'spam': Counter(), 'ham': Counter()}
        for tokens, label in zip(messages, labels):
            for word in tokens:
                self.vocabulary.add(word)
                word_counts[label][word] += 1
        
        # 3. Calculate P(word|class) /w smoothing
        vocab_size = len(self.vocabulary)
        for class_name in ['spam', 'ham']:
            self.word_probs[class_name] = {}
            total_words_in_class = sum(word_counts[class_name].values())
            
            for word in self.vocabulary:
                count = word_counts[class_name][word]
                # Laplace smoothing
                prob = (count + self.alpha) / (total_words_in_class + self.alpha * vocab_size)
                self.word_probs[class_name][word] = prob

    def export(self):
        return {
            "class_probs": self.class_probs,
            "word_probs": self.word_probs,
            "vocabulary": list(self.vocabulary),
            "alpha": self.alpha
        }

# Train
print("Training model...")
classifier = NaiveBayesClassifier(alpha=1.0)
classifier.fit(tokenized_messages, labels)

# --- 3. EXPORT TO JSON ---
print("Exporting to model.json...")
model_data = classifier.export()

# Save as JSON for frontend
try:
    os.makedirs("web_demo", exist_ok=True)
    output_path = "web_demo/model.json"

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(model_data, f, ensure_ascii=False, indent=2)

    print(f"✅ Model exported to {output_path}")
    print(f"Vocab size: {len(model_data['vocabulary'])}")
except Exception as e:
    print(f"❌ Error exporting model: {e}")
