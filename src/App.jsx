
import { useState, useEffect } from 'react';
import { NaiveBayes } from './utils/naiveBayes';
import { Sliders, RefreshCw, Zap, Activity, Terminal, Award, BookOpen, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

// V8 Components
import { Footer } from './components/Footer';
import { FAQ } from './components/FAQ';
import { UserGuide } from './components/UserGuide';
import { DocsOverlay } from './components/DocsOverlay';
import { CookieBanner } from './components/CookieBanner';

function App() {
  const [model, setModel] = useState(null);
  const [nb, setNb] = useState(null);
  const [text, setText] = useState("Câștigă un iPhone gratuit acum! Click aici.");
  const [alpha, setAlpha] = useState(1.0);
  const [prior, setPrior] = useState(50);
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [tugData, setTugData] = useState([]);
  const [pieData, setPieData] = useState([]);

  // V8 State
  const [activeOverlay, setActiveOverlay] = useState(null); // 'faq' | 'guide' | 'docs' | null

  useEffect(() => {
    fetch('/model.json')
      .then(res => res.json())
      .then(data => {
        setModel(data);
        setNb(new NaiveBayes(data));
      });
  }, []);

  useEffect(() => {
    if (nb && text) {
      const res = nb.predict(text, alpha, prior / 100);
      setResult(res);

      // --- 1. Line Chart Data (Bayesian Stream) ---
      let runningLogSpam = Math.log(prior / 100);
      let runningLogHam = Math.log((100 - prior) / 100);

      const streamPoints = [{
        name: 'Start',
        prob: prior / 100,
        token: 'PRIOR'
      }];

      res.tokens.forEach((t, i) => {
        if (t.inVocab) {
          runningLogSpam += Math.log(t.pSpam);
          runningLogHam += Math.log(t.pHam);

          const maxLog = Math.max(runningLogSpam, runningLogHam);
          const pSpamUnnorm = Math.exp(runningLogSpam - maxLog);
          const pHamUnnorm = Math.exp(runningLogHam - maxLog);
          const pSpamCurrent = pSpamUnnorm / (pSpamUnnorm + pHamUnnorm);

          streamPoints.push({
            name: i + 1,
            prob: pSpamCurrent,
            token: t.token,
            isSpam: t.ratio > 1
          });
        }
      });
      setChartData(streamPoints);



      // --- 3. Bar Chart Data (Tug of War) ---
      // Filter significant words and sort by impact magnitude
      const significantTokens = res.tokens.filter(t => t.inVocab);
      const spamBiased = significantTokens.filter(t => t.ratio > 1).map(t => ({
        name: t.token,
        impact: t.ratio, // > 1
        type: 'Spam'
      })).sort((a, b) => b.impact - a.impact).slice(0, 5); // Top 5 spam

      const hamBiased = significantTokens.filter(t => t.ratio < 1).map(t => ({
        name: t.token,
        impact: 1 / t.ratio, // Invert to get magnitude > 1 for comparison
        displayImpact: -1 * (1 / t.ratio), // Negative for chart
        type: 'Ham'
      })).sort((a, b) => b.impact - a.impact).slice(0, 5); // Top 5 ham

      // Combine for chart
      setTugData([...spamBiased, ...hamBiased]);

    }
  }, [nb, text, alpha, prior]);

  const handleRandom = () => {
    const examples = [
      "URGENT: Your bank account is locked. Click here to verify identity.",
      "Congratulations! You've won a $1000 Walmart gift card. Claim now!",
      "Hey hanging out tonight? Let me know if you want to grab pizza.",
      "Meeting reminder: Project review tomorrow at 10 AM in Room 302.",
      "Exclusive offer: Lose 20 lbs in 2 weeks with this miracle pill!",
      "Attached is the invoice for last month's services. Please review.",
      "FWD: Funny cat video check this out lol",
      "Win a free iPhone 15 Pro Max! Limited time offer!",
      "Hi Mom, I'll be home late for dinner today. Love you.",
      "PayPal: You received a payment of $50.00 USD from Alice."
    ];
    setText(examples[Math.floor(Math.random() * examples.length)]);
  };

  if (!model) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-bg gap-4">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
      <div className="text-surface-300 font-mono text-sm">INITIALIZING SYSTEM...</div>
    </div>
  );

  const pieColors = ['#ef4444', '#22c55e'];

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-[1600px] mx-auto grid grid-cols-12 gap-6 content-start">

      {/* V7: ACADEMIC HEADER */}
      {/* V7: ACADEMIC HEADER */}
      <header className="col-span-12 mb-8 py-6 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>

        <div className="flex flex-col xl:grid xl:grid-cols-[1fr_auto_1fr] items-center gap-4 relative z-10">

          {/* LEFT: Logo */}
          <div className="hidden xl:flex justify-start opacity-80 hover:opacity-100 transition-opacity min-w-[240px]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-surface-200/50 border border-white/10 rounded-xl flex items-center justify-center backdrop-blur-md">
                <Activity className="text-indigo-400" size={20} />
              </div>
              <div className="flex flex-col">
                <div className="font-bold text-base tracking-tight text-slate-200 leading-none">NB<span className="text-indigo-400">Lab</span></div>
                <div className="text-[10px] text-slate-500 font-mono">v7.0 Final</div>
              </div>
            </div>
          </div>

          {/* CENTER: Titles */}
          <div className="flex flex-col items-center text-center mx-auto max-w-4xl px-4">
            <div className="text-[10px] md:text-xs font-bold tracking-[0.15em] text-indigo-400 uppercase mb-2 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              SESIUNEA DE COMUNICĂRI ȘTIINȚIFICE STUDENȚEȘTI 2025
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50 mb-4"></div>

            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-slate-400">
              Demonstrație Practică: Clasificarea Spam-ului cu Naive Bayes
            </h1>

            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-sm text-surface-300 font-mono">
              <span className="flex items-center gap-2"><Award size={14} className="text-yellow-500" /> Profesor Coordonator: Gruiescu Mihaela</span>
              <span className="hidden md:inline text-white/10">|</span>
              <span className="flex items-center gap-2"><BookOpen size={14} className="text-blue-400" /> Disciplina: Statistică</span>
            </div>
          </div>

          {/* RIGHT: Actions */}
          <div className="hidden xl:flex justify-end gap-3 min-w-[240px]">
            <a
              href="https://github.com/mihaigoctavian24/Proiect-Statistica"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-surface-200/50 hover:bg-surface-200 border border-white/10 rounded-lg text-slate-300 hover:text-white transition-all backdrop-blur-md group"
            >
              <Github size={16} className="text-white group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-wider">GitHub</span>
            </a>

            <button
              onClick={() => setActiveOverlay('docs')}
              className="flex items-center gap-2 px-4 py-2 bg-surface-200/50 hover:bg-surface-200 border border-white/10 rounded-lg text-slate-300 hover:text-white transition-all backdrop-blur-md group"
            >
              <BookOpen size={16} className="text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-wider">Documentație</span>
            </button>
          </div>

        </div>
      </header>

      {/* LEFT COLUMN: Input & Controls */}
      <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">

        {/* INPUT STUDIO */}
        <section className="bento-card flex-1 flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Input Sequence</h2>
            <div className="flex gap-2">
              <button
                onClick={handleRandom}
                className="text-xs flex items-center gap-1.5 px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-slate-300 hover:text-white transition-all"
                title="Generate Random Example"
              >
                <Zap size={12} className="text-yellow-400" /> AUTO-GEN
              </button>
              <button
                onClick={() => setText("")}
                className="text-xs flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 px-2 py-1 rounded text-slate-300 hover:text-white transition-all"
              >
                <RefreshCw size={12} /> CLEAR
              </button>
            </div>
          </div>

          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            className="flex-1 w-full bg-transparent border-0 resize-none outline-none text-2xl font-light text-slate-200 placeholder:text-surface-300 leading-relaxed"
            placeholder="Enter text to analyze..."
            spellCheck="false"
          />

          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                <Sliders size={12} /> HYPERPARAMETERS
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="group">
                <div className="flex justify-between mb-2">
                  <label className="text-xs text-slate-400">Smoothing (α)</label>
                  <span className="text-xs font-mono text-accent">{alpha.toFixed(1)}</span>
                </div>
                <input
                  type="range" min="0.1" max="5" step="0.1"
                  value={alpha} onChange={e => setAlpha(parseFloat(e.target.value))}
                  className="w-full accent-white cursor-pointer"
                />
              </div>

              <div className="group">
                <div className="flex justify-between mb-2">
                  <label className="text-xs text-slate-400">Prior Bias</label>
                  <span className="text-xs font-mono text-accent">{prior}%</span>
                </div>
                <input
                  type="range" min="1" max="99" step="1"
                  value={prior} onChange={e => setPrior(parseInt(e.target.value))}
                  className="w-full accent-white cursor-pointer"
                />
              </div>
            </div>

            {/* V6: Interactive Explanation Card */}
            <motion.div
              key={alpha + prior}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface-100 border border-indigo-500/30 rounded-lg p-3 text-xs text-slate-300 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
              <div className="font-semibold text-indigo-300 mb-1 flex items-center gap-2">
                <Zap size={10} /> LABORATORY INSIGHT
              </div>
              <p className="leading-relaxed opacity-90">
                {alpha < 1.0 ? "Smoothing Scăzut: Modelul este agresiv. Cuvintele neîntâlnite sunt considerate imposibile, ceea ce poate duce la decizii eronate." :
                  alpha > 1.0 ? "Smoothing Ridicat: Modelul este conservator. Necesită dovezi foarte puternice pentru a-și schimba opinia." :
                    "Laplace Smoothing (Standard): O abordare echilibrată care gestionează corect cuvintele necunoscute."}
              </p>
              <div className="h-px w-full bg-border my-2"></div>
              <p className="leading-relaxed opacity-90">
                {prior > 50 ? `Bias spre SPAM: Îi spui modelului că ${prior}% din toate mesajele sunt SPAM înainte de a citi textul.` :
                  prior < 50 ? `Bias spre HAM: Îi spui modelului că ${100 - prior}% din toate mesajele sunt HAM(sigure) implicit.` :
                    "Prior Neutru: Modelul pleacă de la premisa egală (50/50) că mesajul poate fi Spam sau Ham."}
              </p>
            </motion.div>
          </div>
        </section>
      </div>

      {/* RIGHT COLUMN: Analysis Engine */}
      <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">

        {/* ROW 1: PREDICTION & DONUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div layout className="bento-card relative overflow-hidden group min-h-[220px] flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap size={64} />
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase mb-4">Verdict Final</h3>
              <div className={`text-6xl font-bold tracking-tight mb-2 ${result?.isSpam ? 'text-data-spam' : 'text-data-ham'}`}>
                {result?.isSpam ? 'SPAM' : 'HAM'}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="text-2xl font-mono text-white font-bold">
                  {(Math.max(result?.pSpam || 0, result?.pHam || 0) * 100).toFixed(2)}%
                </div>
                <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mt-1">
                  Confidence
                </div>
              </div>
              <div className="text-xs text-surface-300 font-mono opacity-60">
                Log-Odds Difference: {Math.abs(result?.logSpam - result?.logHam).toFixed(4)}
              </div>
            </div>
          </motion.div>

          <motion.div layout className="bento-card py-4 px-4 bg-surface-100/50 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-semibold text-slate-500 uppercase">Bayesian Stream</h3>
              <div className="text-[10px] font-mono text-surface-300">Probability Evolution</div>
            </div>
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <defs>
                    <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="50%" stopColor="#ef4444" stopOpacity={1} />
                      <stop offset="50%" stopColor="#22c55e" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <ReferenceLine y={0.5} stroke="#525252" strokeDasharray="3 3" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#171717', border: '1px solid #404040', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ display: 'none' }}
                    formatter={(value) => [`${(value * 100).toFixed(1)}% `, 'P(Spam)']}
                  />
                  <Line
                    type="monotone"
                    dataKey="prob"
                    stroke="url(#splitColor)"
                    strokeWidth={2}
                    dot={false}
                    animationDuration={500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* ROW 2: TUG OF WAR CHART */}
        <div className="bento-card h-64 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase">Word Impact Analysis ("Tug of War")</h3>
            <div className="flex gap-4 text-[10px] font-mono text-surface-300">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-data-ham"></div> Pushes HAM</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-data-spam"></div> Pushes SPAM</span>
            </div>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={tugData}
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" horizontal={false} />
                <XAxis type="number" hide domain={['dataMin', 'dataMax']} />
                <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11, fill: '#D4D4D4' }} interval={0} />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: '#171717', border: '1px solid #404040', borderRadius: '8px', fontSize: '12px', color: '#e2e8f0' }}
                  itemStyle={{ color: '#e2e8f0' }}
                  formatter={(value) => value.toFixed(4)}
                />
                <Bar dataKey="impact" name="Impact (Ratio)">
                  {tugData.map((entry, index) => (
                    <Cell key={`cell - ${index} `} fill={entry.type === 'Spam' ? '#ef4444' : '#22c55e'} />
                  ))}
                </Bar>
                {/* We use a trick: negative values for ham in chart data if needed, or separate bars.
                             Here I used 'impact' which for my data prep is all magnitude > 1, but sorted.
                             To make it a true tug of war (center 0), I should use displayImpact which I calculated.
                             Actually, let's keep it simple: Just magnitude bars colored by type is visually clearer than center alignment for now.
                          */}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TOKEN VIUALIZATION */}
        <section className="bento-card flex-1 overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Probability Matrix</h2>
            <div className="flex gap-2 text-[10px] font-mono text-surface-300">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-data-spam"></div> &gt;1.0</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-data-ham"></div> &lt;1.0</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence>
              <motion.div className="flex flex-wrap gap-2 content-start">
                {result?.tokens.map((t, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    whileHover={{ scale: 1.05 }}
                    className={`
                        relative group cursor-default
                        flex items-center gap-3 px-4 py-2 rounded-lg border
                        ${!t.inVocab ? 'border-dashed border-surface-200 opacity-50' :
                        t.ratio > 1.2 ? 'bg-data-spam/10 border-data-spam/30 text-slate-200' :
                          t.ratio < 0.8 ? 'bg-data-ham/10 border-data-ham/30 text-slate-200' :
                            'bg-surface-200 border-surface-300 text-slate-400'
                      }
`}
                  >
                    <span className="text-sm font-medium">{t.token}</span>

                    {t.inVocab && (
                      <div className={`text - [10px] font - mono px - 1.5 rounded ${t.ratio > 1 ? 'bg-data-spam/20 text-data-spam' : 'bg-data-ham/20 text-data-ham'} `}>
                        {t.ratio > 1 ? `x${t.ratio.toFixed(1)} ` : `x${(1 / t.ratio).toFixed(1)} `}
                      </div>
                    )}

                    {/* Hover Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-black border border-surface-300 p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 text-xs">
                      <div className="grid grid-cols-2 gap-2 mb-1">
                        <div className="text-slate-500">P(Spam)</div>
                        <div className="text-right font-mono text-data-spam">{(t.pSpam || 0).toFixed(4)}</div>
                        <div className="text-slate-500">P(Ham)</div>
                        <div className="text-right font-mono text-data-ham">{(t.pHam || 0).toFixed(4)}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {result?.tokens.length === 0 && (
                  <div className="w-full h-full flex items-center justify-center text-surface-300 text-sm italic">
                    Waiting for input stream...
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* MATH CONSOLE */}
        <section className="bg-[#050505] border border-border rounded-xl p-4 font-mono text-xs text-slate-400 overflow-x-auto">
          <div className="flex items-center gap-2 text-surface-300 mb-3 border-b border-white/5 pb-2">
            <Terminal size={12} />
            <span>REAL-TIME LOG</span>
          </div>
          <div className="space-y-1">
            <div><span className="text-blue-400">const</span> <span className="text-yellow-200">log_prob_spam</span> = <span className="text-purple-400">Math</span>.log({(prior / 100).toFixed(2)})</div>
            {result?.tokens.filter(t => t.inVocab).slice(0, 3).map((t, i) => (
              <div key={i} className="pl-4">
                + <span className="text-purple-400">Math</span>.log(<span className="text-data-spam">{t.pSpam.toFixed(5)}</span>) <span className="text-surface-300">// "{t.token}"</span>
              </div>
            ))}
            {result?.tokens.filter(t => t.inVocab).length > 3 && <div className="pl-4 text-surface-300">... ({result.tokens.length - 3} more terms)</div>}
            <div>= <span className={result?.isSpam ? "text-data-spam font-bold" : "text-white"}>{result?.logSpam.toFixed(4)}</span></div>
          </div>
        </section>



      </div>

      {/* V8: FOOTER */}
      <Footer onOpenFAQ={() => setActiveOverlay('faq')} onOpenGuide={() => setActiveOverlay('guide')} />

      {/* OVERLAYS */}
      <AnimatePresence>
        {activeOverlay === 'faq' && <FAQ onClose={() => setActiveOverlay(null)} key="faq" />}
        {activeOverlay === 'guide' && <UserGuide onClose={() => setActiveOverlay(null)} key="guide" />}
        {activeOverlay === 'docs' && <DocsOverlay onClose={() => setActiveOverlay(null)} key="docs" />}
      </AnimatePresence>

      <CookieBanner />
    </div >
  );
}

export default App;
