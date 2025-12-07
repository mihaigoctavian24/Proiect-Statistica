import { Github, FileText, HelpCircle } from 'lucide-react';

export function Footer({ onOpenFAQ, onOpenGuide }) {
    return (
        <footer className="col-span-12 mt-12 pt-8 pb-8 border-t border-white/5 flex flex-col gap-6 text-sm text-surface-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

                {/* Left: University Info */}
                <div className="text-center md:text-left justify-self-center md:justify-self-start">
                    <div className="font-bold text-slate-200 uppercase tracking-wider text-xs mb-1">
                        Universitatea Româno-Americană
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest">
                        Facultatea de Informatică Economică
                    </div>
                </div>

                {/* Center: Authors */}
                <div className="flex flex-col items-center gap-1 justify-self-center text-center">
                    <div className="text-xs text-slate-400">
                        Realizat de studenții grupei <span className="text-indigo-400 font-mono">624</span>:
                    </div>
                    <div className="font-medium text-slate-200 text-xs">
                        Octavian Mihai & Abbasi Pazeyazd Bianca-Maria
                    </div>
                </div>

                {/* Right: Links */}
                <div className="flex gap-4 justify-self-center md:justify-self-end">
                    <button
                        onClick={onOpenGuide}
                        className="flex items-center gap-2 hover:text-indigo-400 transition-colors text-xs uppercase font-bold tracking-wider"
                    >
                        <FileText size={14} /> Ghid Utilizare
                    </button>
                    <button
                        onClick={onOpenFAQ}
                        className="flex items-center gap-2 hover:text-indigo-400 transition-colors text-xs uppercase font-bold tracking-wider"
                    >
                        <HelpCircle size={14} /> FAQ
                    </button>
                </div>
            </div>

            <div className="text-center text-[10px] text-white/20 font-mono">
                &copy; 2025 Naive Bayes Lab. All rights reserved. Made with ❤️ by Bubu & Dudu Dev Team.
            </div>
        </footer>
    );
}
