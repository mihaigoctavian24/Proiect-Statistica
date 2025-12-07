import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const QA = ({ q, a }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-white/5 rounded-lg bg-surface-100/20 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left p-4 flex justify-between items-center hover:bg-white/5 transition-colors"
            >
                <span className="font-semibold text-slate-200 text-sm">{q}</span>
                {isOpen ? <ChevronUp size={16} className="text-indigo-400" /> : <ChevronDown size={16} className="text-slate-500" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4 text-xs text-surface-300 leading-relaxed border-t border-white/5 pt-2"
                    >
                        {a}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export function FAQ({ onClose }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-[#0f0f0f] border border-white/10 w-full max-w-2xl max-h-[80vh] flex flex-col rounded-2xl shadow-2xl relative overflow-hidden"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-surface-100/10">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="text-indigo-400">?</span> Întrebări Frecvente
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    <QA
                        q="Ce este Naive Bayes?"
                        a="Naive Bayes este un algoritm probabilistic de clasificare bazat pe Teorema lui Bayes. Este numit 'Naive' (naiv) deoarece presupune că prezența unui cuvânt într-un mesaj este independentă de prezența oricărui alt cuvânt, ceea ce rareori se întâmplă în realitate, dar funcționează surprinzător de bine în practică."
                    />
                    <QA
                        q="Cum funcționează acest clasificator Spam/Ham?"
                        a="Algoritmul a fost antrenat pe un set de date (SMS Spam Collection/Enron) și a învățat frecvența cuvintelor în mesaje Spam și Ham. Când introduci un text nou, el calculează probabilitatea ca acel set de cuvinte să aparțină fiecărei clase și alege clasa cu probabilitatea cea mai mare."
                    />
                    <QA
                        q="Ce este Smoothing (Alfa)?"
                        a="Laplace Smoothing (Alfa) este o tehnică folosită pentru a evita probabilitățile de zero. Dacă un cuvânt nu a fost întâlnit niciodată în antrenament (ex: 'ChatGPT'), probabilitatea sa ar fi 0, ceea ce ar anula întregul calcul. Adăugând o valoare mică (alfa), ne asigurăm că modelul poate gestiona cuvinte necunoscute."
                    />
                    <QA
                        q="Ce reprezintă Prior Bias?"
                        a="Prior Probability este convingerea inițială a modelului înainte de a vedea orice dată. Dacă setăm Prior la 50%, modelul este neutru. Dacă știm că 90% din email-uri sunt Ham în general, putem seta Prior-ul pentru a reflecta această realitate, făcând modelul mai sceptic în a declara ceva Spam."
                    />
                    <QA
                        q="Datele mele sunt salvate?"
                        a="Nu. Toate calculele se fac local, în browser-ul tău. Textul introdus nu este trimis către niciun server."
                    />
                </div>
            </motion.div>
        </motion.div>
    );
}
