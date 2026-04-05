export default function SearchBar({ query, setQuery, handleSearch }) {
  const onKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-2xl bg-white border border-slate-200 p-2 flex items-center z-10 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
      <span className="material-symbols-outlined text-slate-400 pl-4 pr-2">search</span>
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Search for internships, dev roles, or remote jobs..."
        className="w-full bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400 font-inter py-3 px-2 font-medium"
      />
      <button 
        onClick={handleSearch}
        className="bg-primary text-white px-6 py-3 rounded-xl font-semibold scale-95 hover:scale-100 hover:bg-blue-700 active:scale-95 transition-all outline-none"
      >
        Search
      </button>
    </div>
  );
}
