import { X, Book, Code, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';

const Section = ({ icon: Icon, title, children }) => (
    <div className="mb-8">
        <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
            <Icon size={18} className="text-indigo-400" /> {title}
        </h3>
        <div className="text-sm text-surface-300 leading-relaxed space-y-4">
            {children}
        </div>
    </div>
)

export function DocsOverlay({ onClose }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-[#0f0f0f] border border-white/10 w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl shadow-2xl relative overflow-hidden"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-surface-100/10">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="text-indigo-400">📚</span> Documentație Tehnică
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">

                    <Section icon={Book} title="Teorema lui Bayes">
                        <p>
                            Teorema lui Bayes descrie probabilitatea unui eveniment, bazată pe cunoașterea anterioară a condițiilor care ar putea fi legate de eveniment.
                            Formula matematică este:
                        </p>
                        <div className="bg-surface-200/30 p-4 rounded-lg font-mono text-center text-indigo-300 my-4 border border-indigo-500/20">
                            P(A|B) = [ P(B|A) * P(A) ] / P(B)
                        </div>
                        <ul className="list-disc pl-5 space-y-1 opacity-80">
                            <li><strong>P(A|B)</strong>: Probabilitatea ca mesajul să fie Spam (A) știind că conține cuvântul (B).</li>
                            <li><strong>P(B|A)</strong>: Probabilitatea ca acel cuvânt să apară, știind că mesajul e Spam.</li>
                            <li><strong>P(A)</strong>: Probabilitatea a priori ca un mesaj să fie Spam (Prior-ul).</li>
                        </ul>
                    </Section>

                    <Section icon={Code} title="De ce 'Naive'?">
                        <p>
                            Algoritmul este numit "Naiv" deoarece face o presupunere foarte puternică (și adesea falsă în realitate):
                            <strong> independența între caracteristici</strong>.
                        </p>
                        <p>
                            El presupune că prezența unui cuvânt într-un mesaj nu are nicio legătură cu prezența altui cuvânt.
                            De exemplu, pentru model, cuvintele "Câștigă" și "Bani" sunt complet independente, deși în realitate ele apar des împreună în Spam.
                            Cu toate acestea, clasificatorul funcționează surprinzător de bine.
                        </p>
                    </Section>

                    <Section icon={Calculator} title="Implementarea Noastră">
                        <p>
                            Aplicația folosește varianta <strong>Multinomial Naive Bayes</strong>, potrivită pentru clasificarea textului bazată pe frecvența cuvintelor.
                        </p>
                        <div className="space-y-2 mt-2">
                            <div className="flex gap-2">
                                <span className="text-indigo-400 font-bold">1. Tokenizare:</span>
                                <span>Textul este spart în cuvinte, eliminând punctuația și transformând totul în litere mici.</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-indigo-400 font-bold">2. Log-Probabilities:</span>
                                <span>Folosim logaritmi pentru a evita "underflow-ul" aritmetic (înmulțirea multor numere subunitare mici ar da 0). Adunăm logaritmii în loc să înmulțim probabilitățile.</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-indigo-400 font-bold">3. Laplace Smoothing:</span>
                                <span>Adăugăm valoarea α (alfa) la numărătoare pentru a evita probabilitățile de zero pentru cuvinte necunoscute.</span>
                            </div>
                        </div>
                    </Section>

                </div>
            </motion.div>
        </motion.div>
    );
}
