export default function Filters({ activeFilter, setActiveFilter }) {
  const filters = ['ALL', 'FULLTIME', 'INTERN', 'CONTRACTOR', 'PARTTIME'];

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-8 z-10 relative">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => setActiveFilter(filter)}
          className={`px-5 py-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 ${
            activeFilter === filter 
              ? 'bg-slate-900 text-white shadow-md scale-105' 
              : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
