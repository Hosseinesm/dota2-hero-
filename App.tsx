import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Hero } from './types';
import { fetchHeroes } from './services/dotaService';
import { HeroCard } from './components/HeroCard';
import { HeroModal } from './components/HeroModal';
import { FilterBar } from './components/FilterBar';

const App: React.FC = () => {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [attrFilter, setAttrFilter] = useState<string>('all');

  const loadHeroes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHeroes();
      setHeroes(data);
    } catch (err) {
      console.error("Failed to load heroes:", err);
      setError("مشکل در برقراری ارتباط با سرور. لطفا اتصال اینترنت خود را بررسی کنید.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHeroes();
  }, [loadHeroes]);

  const filteredHeroes = useMemo(() => {
    return heroes.filter((hero) => {
      const matchesSearch = hero.localized_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAttr = attrFilter === 'all' || hero.primary_attr === attrFilter;
      return matchesSearch && matchesAttr;
    });
  }, [heroes, searchQuery, attrFilter]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-10 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-red-500/20 shadow-xl shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-400">
              راهنمای هیروهای دوتا ۲
            </h1>
          </div>
          
          <FilterBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            attrFilter={attrFilter}
            setAttrFilter={setAttrFilter}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 animate-pulse">در حال دریافت اطلاعات از سرور...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 gap-6 text-center">
            <div className="p-4 bg-red-900/30 rounded-full text-red-400">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-xl text-slate-200 font-bold mb-2">خطا در دریافت لیست هیروها</p>
              <p className="text-slate-400">{error}</p>
            </div>
            <button 
              onClick={loadHeroes}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-lg shadow-red-600/20 font-bold flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              تلاش مجدد
            </button>
          </div>
        ) : (
          <>
            {heroes.length > 0 && filteredHeroes.length === 0 ? (
               <div className="text-center py-20 text-slate-500 flex flex-col items-center">
                <svg className="w-16 h-16 mb-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-xl">هیچ هیرویی با این مشخصات پیدا نشد.</p>
                <button 
                  onClick={() => { setSearchQuery(''); setAttrFilter('all'); }}
                  className="mt-4 text-blue-400 hover:text-blue-300 underline"
                >
                  پاک کردن فیلترها
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {filteredHeroes.map((hero) => (
                  <HeroCard 
                    key={hero.id} 
                    hero={hero} 
                    onClick={() => setSelectedHero(hero)} 
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal */}
      {selectedHero && (
        <HeroModal 
          hero={selectedHero} 
          onClose={() => setSelectedHero(null)} 
        />
      )}
    </div>
  );
};

export default App;