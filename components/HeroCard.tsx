import React, { useRef, useState } from 'react';
import { Hero } from '../types';
import { getHeroImageUrl, getAttributeColor, getHeroVideoUrl } from '../services/dotaService';

interface HeroCardProps {
  hero: Hero;
  onClick: () => void;
}

export const HeroCard: React.FC<HeroCardProps> = ({ hero, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const attrColor = getAttributeColor(hero.primary_attr);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setVideoReady(false);
  };

  const handleVideoPlay = () => {
    setVideoReady(true);
  };

  return (
    <div 
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative bg-slate-800 rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-1 border border-slate-700 hover:border-blue-400/50 flex flex-col h-full"
    >
      {/* Media Container (Video/Image) */}
      <div className="relative aspect-[16/9] overflow-hidden shrink-0 bg-slate-900">
        
        {/* Video Layer - Only rendered when hovered to save memory on mobile */}
        {isHovered && (
          <video
            autoPlay
            muted
            loop
            playsInline
            onPlaying={handleVideoPlay}
            className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-300 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
          >
            <source src={getHeroVideoUrl(hero.name)} type="video/webm" />
            <source src={getHeroVideoUrl(hero.name).replace('.webm', '.mp4')} type="video/mp4" />
          </video>
        )}

        {/* Static Image Layer */}
        <img 
          src={getHeroImageUrl(hero.img)} 
          alt={hero.localized_name} 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${videoReady ? 'opacity-0' : 'opacity-100'}`}
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80 pointer-events-none" />
        
        {/* Attribute Color Indicator (Dot) */}
        <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur rounded-full p-1.5 border border-slate-600 shadow-lg z-10">
           <div className={`w-3 h-3 rounded-full ${attrColor.replace('text-', 'bg-')} shadow-[0_0_8px_currentColor]`}></div>
        </div>
      </div>

      {/* Content Box */}
      <div className="p-3 relative z-10 flex items-center gap-3 bg-slate-800 flex-1 border-t border-slate-700/50">
        {/* Small Icon */}
        <div className="shrink-0 relative">
          <img 
              src={getHeroImageUrl(hero.icon)} 
              alt="icon" 
              className="w-10 h-10 rounded-md shadow-md border border-slate-600 object-cover bg-slate-900"
              loading="lazy"
          />
        </div>
        
        <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h3 className="text-base font-bold text-slate-100 group-hover:text-blue-400 transition-colors truncate leading-tight">
              {hero.localized_name}
            </h3>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {hero.roles.slice(0, 1).map((role, idx) => (
                  <span key={idx} className="text-[10px] uppercase tracking-wider bg-slate-700 px-1.5 py-0.5 rounded text-slate-300 border border-slate-600/50">
                  {role}
                  </span>
              ))}
              {hero.roles.length > 1 && (
                 <span className="text-[10px] text-slate-500 py-0.5">+ {hero.roles.length - 1}</span>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};