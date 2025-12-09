import { Hero } from '../types';

const API_BASE = 'https://api.opendota.com';

export const fetchHeroes = async (): Promise<Hero[]> => {
  // Let the component handle the try-catch to show error UI
  const response = await fetch(`${API_BASE}/api/heroStats`);
  if (!response.ok) {
    throw new Error('خطا در دریافت اطلاعات از سرور');
  }
  const data = await response.json();
  
  // Sort alphabetically
  return data.sort((a: Hero, b: Hero) => a.localized_name.localeCompare(b.localized_name));
};

export const getHeroImageUrl = (path: string) => {
  if (!path) return ''; // Safety check
  return `${API_BASE}${path}`;
};

export const getHeroVideoUrl = (internalName: string) => {
  // Convert npc_dota_hero_antimage -> antimage
  const name = internalName.replace('npc_dota_hero_', '');
  // Valve's CDN structure for hero renders
  return `https://cdn.cloudflare.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/${name}.webm`;
};

export const getAttributeColor = (attr: string) => {
  switch (attr) {
    case 'str': return 'text-red-500';
    case 'agi': return 'text-green-500';
    case 'int': return 'text-blue-400';
    case 'all': return 'text-orange-400';
    default: return 'text-slate-400';
  }
};

export const getAttributeName = (attr: string) => {
  switch (attr) {
    case 'str': return 'قدرتی (Strength)';
    case 'agi': return 'سرعتی (Agility)';
    case 'int': return 'هوش (Intelligence)';
    case 'all': return 'یونیورسال (Universal)';
    default: return attr;
  }
};