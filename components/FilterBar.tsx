import React from 'react';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  attrFilter: string;
  setAttrFilter: (a: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  attrFilter, 
  setAttrFilter 
}) => {
  
  // Icons for attributes
  const StrIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.07 4.93L17.66 3.52C17.41 3.27 17.17 3.09 16.96 3L13.13 6.83C14.7 6.83 16.27 7.42 17.47 8.62C19.81 10.96 19.81 14.76 17.47 17.1L19.07 18.7L20.48 17.29C23.89 13.88 23.89 8.35 20.48 4.93L19.07 4.93ZM3.52 17.66L4.93 19.07C8.35 22.48 13.88 22.48 17.29 19.07L18.7 17.66L17.1 16.06C14.76 18.4 10.96 18.4 8.62 16.06C7.42 14.86 6.83 13.29 6.83 11.72L3 15.55C3.09 15.76 3.27 16 3.52 16.25L3.52 17.66ZM12.03 2L10 4.03L12 6.03L14 4.03L12.03 2ZM5.12 10.59L11.59 17.06L13 15.65L6.53 9.18L5.12 10.59ZM17.47 5.34L18.88 6.75L12.41 13.22L11 11.81L17.47 5.34Z" /></svg>
  );
  
  const AgiIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M10.59,13.41C11,13.8 11,14.44 10.59,14.83C10.2,15.22 9.56,15.22 9.17,14.83C7.22,12.88 7.22,9.71 9.17,7.76V7.76L12.71,4.22C14.66,2.27 17.83,2.27 19.78,4.22C21.73,6.17 21.73,9.34 19.78,11.29L18.89,12.18L17.48,10.77L18.37,9.88C19.54,8.71 19.54,6.81 18.37,5.64C17.2,4.47 15.3,4.47 14.13,5.64L10.59,9.18C9.42,10.35 9.42,12.24 10.59,13.41M13.41,9.17C13.8,8.78 14.44,8.78 14.83,9.17C16.78,11.12 16.78,14.29 14.83,16.24V16.24L11.29,19.78C9.34,21.73 6.17,21.73 4.22,19.78C2.27,17.83 2.27,14.66 4.22,12.71L5.11,11.82L6.52,13.23L5.63,14.12C4.46,15.29 4.46,17.19 5.63,18.36C6.8,19.53 8.7,19.53 9.87,18.36L13.41,14.83C14.58,13.66 14.58,11.76 13.41,10.59C13,10.2 13,9.56 13.41,9.17Z" /></svg>
  );

  const IntIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2C15.86,2 19,5.14 19,9C19,14.25 12,22 12,22C12,22 5,14.25 5,9C5,5.14 8.14,2 12,2M12,4C9.24,4 7,6.24 7,9C7,11.5 10,16.5 12,19.2C14,16.5 17,11.5 17,9C17,6.24 14.76,4 12,4M12,11A2,2 0 0,1 10,9A2,2 0 0,1 12,7A2,2 0 0,1 14,9A2,2 0 0,1 12,11Z" /></svg>
  );

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
      {/* Search Input */}
      <div className="relative group">
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-5 h-5 text-slate-400 group-focus-within:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          className="block w-full md:w-64 p-2.5 pr-10 text-sm text-white bg-slate-800 border border-slate-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 placeholder-slate-500 transition-all shadow-sm"
          placeholder="جستجوی نام هیرو..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          dir="rtl"
        />
      </div>

      {/* Attribute Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
        <button
            onClick={() => setAttrFilter('all')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap border flex items-center gap-2 ${
              attrFilter === 'all' 
              ? 'bg-slate-100 text-slate-900 border-white' 
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <span className="text-lg">✵</span> همه
        </button>
        <button
            onClick={() => setAttrFilter('str')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap border flex items-center gap-2 ${
              attrFilter === 'str' 
              ? 'bg-red-600 text-white border-red-400 shadow-[0_0_15px_rgba(220,38,38,0.5)]' 
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-red-400'
            }`}
          >
            <StrIcon /> قدرتی
        </button>
        <button
            onClick={() => setAttrFilter('agi')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap border flex items-center gap-2 ${
              attrFilter === 'agi' 
              ? 'bg-green-600 text-white border-green-400 shadow-[0_0_15px_rgba(22,163,74,0.5)]' 
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-green-400'
            }`}
          >
            <AgiIcon /> سرعتی
        </button>
        <button
            onClick={() => setAttrFilter('int')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap border flex items-center gap-2 ${
              attrFilter === 'int' 
              ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.5)]' 
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-blue-400'
            }`}
          >
            <IntIcon /> هوش
        </button>
      </div>
    </div>
  );
};