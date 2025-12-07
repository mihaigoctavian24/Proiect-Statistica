import { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CookieBanner() {
    const [accepted, setAccepted] = useState(true); // Default to true (hidden) to avoid flash, check effect

    useEffect(() => {
        const hasAccepted = localStorage.getItem('nb_cookies_accepted');
        if (!hasAccepted) {
            setAccepted(false);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('nb_cookies_accepted', 'true');
        setAccepted(true);
    };

    return (
        <AnimatePresence>
            {!accepted && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-0 left-0 w-full bg-[#0A0A0A]/95 border-t border-white/10 backdrop-blur-md p-4 z-50 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl"
                >
                    <div className="flex items-center gap-4 max-w-2xl">
                        <div className="p-2 bg-surface-200/50 rounded-lg shrink-0">
                            <Cookie className="text-indigo-400" size={20} />
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            Acest site utilizează cookie-uri pentru a îmbunătăți experiența de navigare și a memora preferințele tale.
                            Continuarea navigării implică acceptarea utilizării acestora.
                        </p>
                    </div>
                    <div className="flex gap-3 shrink-0">
                        <button
                            onClick={handleAccept}
                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
                        >
                            ACCEPT
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
