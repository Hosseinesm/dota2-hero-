import React, { useEffect, useState } from 'react';
import { Hero, GeminiHeroData } from '../types';
import { getHeroVideoUrl, getAttributeName, getAttributeColor } from '../services/dotaService';
import { generateHeroStrategy } from '../services/geminiService';

interface HeroModalProps {
  hero: Hero;
  onClose: () => void;
}

export const HeroModal: React.FC<HeroModalProps> = ({ hero, onClose }) => {
  const [aiData, setAiData] = useState<GeminiHeroData | null>(null);
  const [loadingAi, setLoadingAi] = useState<boolean>(true);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Fetch AI Data
  useEffect(() => {
    let isMounted = true;
    const fetchAiData = async () => {
      setLoadingAi(true);
      const data = await generateHeroStrategy(hero.localized_name);
      if (isMounted) {
        setAiData(data);
        setLoadingAi(false);
      }
    };
    fetchAiData();
    return () => { isMounted = false; };
  }, [hero.localized_name]);

  const videoUrl = getHeroVideoUrl(hero.name);
  const primaryColorClass = getAttributeColor(hero.primary_attr);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-slate-900 w-full max-w-5xl h-[90vh] rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col lg:flex-row animate-[fadeIn_0.3s_ease-out]">
        
        {/* Close Button Mobile */}
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 z-20 p-2 bg-black/50 rounded-full text-white lg:hidden hover:bg-red-500/50 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Left Side: Visuals & Stats (Desktop Left / Mobile Top) */}
        <div className="lg:w-2/5 h-1/3 lg:h-full relative bg-black flex flex-col">
           {/* The "GIF" - Actually a loop video */}
          <div className="relative w-full h-full lg:h-3/5 overflow-hidden">
             <video 
               autoPlay 
               loop 
               muted 
               playsInline 
               poster={`https://api.opendota.com${hero.img}`}
               className="w-full h-full object-cover object-top opacity-90"
             >
                <source src={videoUrl} type="video/webm" />
                <source src={videoUrl.replace('.webm', '.mp4')} type="video/mp4" />
                {/* Fallback image if video fails or loads slow */}
                <img src={`https://api.opendota.com${hero.img}`} alt={hero.localized_name} className="w-full h-full object-cover" />
             </video>
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent lg:bg-gradient-to-r" />
             
             <div className="absolute bottom-4 right-4 text-white drop-shadow-lg">
                <h2 className="text-4xl font-black uppercase tracking-wide">{hero.localized_name}</h2>
                <div className="flex items-center gap-2 mt-2">
                    <span className={`text-sm font-bold px-3 py-1 rounded-full bg-black/60 border border-slate-600 ${primaryColorClass}`}>
                       {getAttributeName(hero.primary_attr)}
                    </span>
                    <span className="text-sm font-bold px-3 py-1 rounded-full bg-black/60 border border-slate-600 text-slate-300">
                      {hero.attack_type}
                    </span>
                </div>
             </div>
          </div>

          {/* Base Stats */}
          <div className="flex-1 p-6 bg-slate-900/50 overflow-y-auto border-t border-slate-800 lg:border-t-0">
             <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
               مشخصات پایه
             </h3>
             <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <StatRow label="قدرت" val={hero.base_str} gain={hero.str_gain} icon="text-red-500" />
                <StatRow label="سرعت" val={hero.base_agi} gain={hero.agi_gain} icon="text-green-500" />
                <StatRow label="هوش" val={hero.base_int} gain={hero.int_gain} icon="text-blue-500" />
                
                <div className="col-span-2 h-px bg-slate-800 my-1"></div>

                <div className="flex justify-between">
                   <span className="text-slate-400">Health</span>
                   <span className="text-green-400 font-mono">{hero.base_health}</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-slate-400">Mana</span>
                   <span className="text-blue-400 font-mono">{hero.base_mana}</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-slate-400">Armor</span>
                   <span className="text-slate-200 font-mono">{hero.base_armor.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-slate-400">Move Speed</span>
                   <span className="text-slate-200 font-mono">{hero.move_speed}</span>
                </div>
             </div>
          </div>
        </div>

        {/* Right Side: AI Content (Lore & Guide) */}
        <div className="lg:w-3/5 h-2/3 lg:h-full bg-slate-800 p-6 lg:p-10 overflow-y-auto">
           {/* Close Desktop */}
           <button 
              onClick={onClose} 
              className="hidden lg:block absolute top-6 left-6 text-slate-500 hover:text-white transition-colors"
           >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
           </button>

           {loadingAi ? (
             <div className="h-full flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 relative">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                </div>
                <div className="text-center">
                    <p className="text-lg font-bold text-slate-200">هوش مصنوعی جمنای در حال تحلیل...</p>
                    <p className="text-sm text-slate-500 mt-2">نوشتن داستان و استراتژی به زبان فارسی</p>
                </div>
             </div>
           ) : aiData ? (
             <div className="space-y-8 animate-[slideUp_0.5s_ease-out]">
                {/* Lore Section */}
                <section>
                   <h3 className="text-2xl font-bold text-amber-500 mb-3 flex items-center gap-2">
                     <span className="text-3xl">📜</span> داستان هیرو
                   </h3>
                   <p className="text-slate-300 leading-8 text-justify border-r-4 border-slate-600 pr-4 bg-slate-800/50 rounded-lg p-2">
                     {aiData.lore}
                   </p>
                </section>

                {/* Playstyle */}
                <section>
                   <h3 className="text-xl font-bold text-blue-400 mb-3 flex items-center gap-2">
                     <span className="text-2xl">🎮</span> سبک بازی
                   </h3>
                   <p className="text-slate-300 leading-7">
                     {aiData.playstyle}
                   </p>
                </section>

                {/* Grid for Tips, Counters, Strengths */}
                <div className="grid md:grid-cols-2 gap-6">
                   {/* Strengths */}
                   <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                      <h4 className="text-green-400 font-bold mb-3 flex items-center gap-2">
                         <span>💪</span> نقاط قوت
                      </h4>
                      <ul className="space-y-2">
                         {aiData.strengths.map((str, i) => (
                           <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                             <span className="text-green-500 mt-1">✓</span> {str}
                           </li>
                         ))}
                      </ul>
                   </div>

                   {/* Counters */}
                   <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                      <h4 className="text-red-400 font-bold mb-3 flex items-center gap-2">
                         <span>🚫</span> ضد هیروها (Counters)
                      </h4>
                      <ul className="space-y-2">
                         {aiData.counters.map((ctr, i) => (
                           <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                             <span className="text-red-500 mt-1">⚔</span> {ctr}
                           </li>
                         ))}
                      </ul>
                   </div>
                </div>

                {/* Pro Tips */}
                <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-5 rounded-xl border border-blue-500/20">
                   <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <span className="text-yellow-400">★</span> نکات حرفه‌ای
                   </h3>
                   <div className="space-y-3">
                      {aiData.tips.map((tip, i) => (
                        <div key={i} className="flex gap-3">
                           <span className="bg-blue-600/20 text-blue-300 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border border-blue-500/30">
                             {i + 1}
                           </span>
                           <p className="text-slate-200 text-sm leading-6">{tip}</p>
                        </div>
                      ))}
                   </div>
                </div>

             </div>
           ) : (
             <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <p>متاسفانه اطلاعات دریافت نشد.</p>
                <button 
                  onClick={() => onClose()} // Or retry
                  className="mt-4 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 text-white"
                >
                  بازگشت
                </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

const StatRow: React.FC<{ label: string, val: number, gain: number, icon: string }> = ({ label, val, gain, icon }) => (
  <div className="flex items-center justify-between">
     <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${icon.replace('text-', 'bg-')}`}></div>
        <span className="text-slate-400">{label}</span>
     </div>
     <div className="flex items-center gap-1 font-mono">
        <span className="text-white text-base">{val}</span>
        <span className="text-xs text-slate-500">+{gain.toFixed(1)}</span>
     </div>
  </div>
);