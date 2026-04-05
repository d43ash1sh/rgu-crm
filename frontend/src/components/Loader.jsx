export default function Loader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-surface/50 border border-outline-variant/20 rounded-2xl p-6 h-48 animate-pulse shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-3/4 h-6 bg-slate-200 rounded-md mb-4"></div>
            <div className="w-1/2 h-4 bg-slate-100 rounded-md mb-2"></div>
            <div className="w-1/3 h-4 bg-slate-100 rounded-md"></div>
          </div>
          <div className="flex justify-between items-end mt-6">
            <div className="w-20 h-6 bg-blue-100 rounded-full"></div>
            <div className="w-24 h-10 bg-slate-200 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
