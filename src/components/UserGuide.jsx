import { X, Play, Sliders, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Step = ({ icon: Icon, title, desc, num }) => (
    <div className="flex gap-4">
        <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center font-bold text-indigo-400 text-sm">
                {num}
            </div>
            {num < 3 && <div className="w-0.5 h-full bg-white/5 min-h-[40px]"></div>}
        </div>
        <div className="pb-8">
            <h3 className="text-base font-bold text-slate-200 mb-1 flex items-center gap-2">
                <Icon size={16} className="text-slate-400" /> {title}
            </h3>
            <p className="text-sm text-surface-300 leading-relaxed">
                {desc}
            </p>
        </div>
    </div>
)

export function UserGuide({ onClose }) {
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
                        <span className="text-indigo-400">📖</span> Ghid de Utilizare
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <Step
                        num={1}
                        icon={Play}
                        title="Introduceți Textul"
                        desc="Scrieți un mesaj în zona de input sau folosiți butonul 'AUTO-GEN' pentru a genera exemple aleatorii de Spam sau Ham. Aplicația va analiza textul în timp real."
                    />
                    <Step
                        num={2}
                        icon={Sliders}
                        title="Ajustați Parametrii"
                        desc="Folosiți slider-ul 'Smoothing (α)' pentru a controla cât de mult penalizează algoritmul cuvintele necunoscute. Slider-ul 'Prior Bias' vă permite să simulați scenarii unde vă așteptați la mai mult spam sau ham implicit."
                    />
                    <Step
                        num={3}
                        icon={BarChart2}
                        title="Analizați Rezultatele"
                        desc="Urmăriți graficul 'Verdict Final' pentru decizia algoritmului. 'Bayesian Stream' vă arată cum se schimbă probabilitatea cu fiecare cuvânt citit, iar 'Word Impact' evidențiază cuvintele cheie care au înclinat balanța."
                    />
                </div>
            </motion.div>
        </motion.div>
    );
}
