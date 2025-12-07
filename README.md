# Naive Bayes Spam Classifier 📧🛡️

> **Lucrare pentru Sesiunea de Comunicări Științifice Studențești 2025**  
> **Universitatea Româno-Americană | Facultatea de Informatică Economică**

![Project Status](https://img.shields.io/badge/Status-Finalizat-success)
![Version](https://img.shields.io/badge/Version-v8.0-blue)
![License](https://img.shields.io/badge/License-MIT-purple)

O aplicație interactivă React concepută pentru a demonstra vizual și intuitiv funcționarea algoritmului **Naive Bayes** în clasificarea textului (Spam vs. Ham). Proiectul pune accent pe vizualizarea datelor în timp real și explicarea conceptelor statistice din spatele Machine Learning-ului.

---

## 👥 Echipa de Proiect

**Autori (Grupa 624):**

* 🎓 **Octavian Mihai**
* 🎓 **Abbasi Pazeyazd Bianca-Maria**

**Profesor Coordonator:**

* 👩‍🏫 **Gruiescu Mihaela** (Disciplina: Statistică)

---

## ✨ Funcționalități Cheie

### 1. 🧠 Analiză Probabilistică în Timp Real

Algoritmul rulează instantaneu (_client-side_) pe măsură ce tastezi sau generezi exemple.

* **Tokenizare Live**: Vezi cum textul este spart în cuvinte și filtrat.
* **Scoruri Logaritmice**: Vizualizezi contribuția fiecărui cuvânt la scorul final (Log-Odds).

### 2. 📊 Vizualizări Avansate

* **Bayesian Stream (Line Chart)**: Urmărește evoluția probabilității pe măsură ce propoziția este procesată cuvânt cu cuvânt.
* **Tug of War Impact (Bar Chart)**: Un "război" vizual între cuvintele care indică Spam (roșu) și cele care indică Legitim/Ham (verde).
* **Matricea Probabilităților**: Fiecare cuvânt primește un "multiplier" vizual bazat pe impactul să statistic.

### 3. 🎛️ Laborator Interactiv

Experimentează cu hiperparametrii modelului pentru a înțelege cum influențează decizia:

* **Smoothing (α)**: Ajustează nivelul de "agresivitate" al modelului față de cuvintele necunoscute.
* **Prior Bias**: Simulează un mediu în care Spam-ul este rar sau frecvent (Prior probabilities).

### 4. 📚 Documentație Integrată

* Ghid de Utilizare pas-cu-pas.
* Explicații teoretice (Teorema lui Bayes) disponibile direct în interfață.
* Secțiune FAQ pentru întrebări comune.

---

## 🛠️ Tehnologii Utilizate

* **Frontend**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Design Premium Dark Mode & Glassmorphism)
* **Charts**: [Recharts](https://recharts.org/)
* **Animations**: [Framer Motion](https://www.framer.com/motion/)
* **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Instalare și Rulare

Dacă dorești să rulezi proiectul local:

1. **Clonează repository-ul:**

    ```bash
    git clone https://github.com/octav1an/naive-bayes-spam-classifier.git
    cd naive-bayes-spam-classifier
    ```

2. **Instalează dependențele:**

    ```bash
    npm install
    ```

3. **Pornește serverul de dezvoltare:**

    ```bash
    npm run dev
    ```

    Aplicația va fi disponibilă la `http://localhost:5173` (sau similar).

---

## 📐 Despre Algoritm

Aplicația folosește **Multinomial Naive Bayes**, o variantă populară pentru clasificarea textului.
Modelul a fost antrenat pe setul de date **SMS Spam Collection** (5,574 mesaje).

**Formula de bază:**
> $P(Spam|W) \propto P(Spam) \prod_{i=1}^{n} P(w_i|Spam)$

Unde:

* $P(Spam)$ este probabilitatea a priori (Prior).
* $P(w_i|Spam)$ este probabilitatea condiționată ca un cuvânt $w_i$ să apară într-un mesaj Spam (Likelihood).

---

## 📄 Licență

Acest proiect este licențiat sub [MIT License](LICENSE).
Copyright © 2025 Octavian Mihai & Abbasi Pazeyazd Bianca-Maria. All Rights Reserved.
