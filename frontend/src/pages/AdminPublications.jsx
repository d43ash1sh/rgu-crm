import { BookOpen, Plus } from 'lucide-react';

export default function AdminPublications() {
  return (
    <div className="space-y-8 pb-20">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-2">Publications</h2>
          <p className="text-slate-500 font-medium text-sm tracking-tight">Access and edit the intellectual repertoire of the Assam Students’ Forum.</p>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold text-sm shadow-xl shadow-primary/20 hover:scale-105 transition-all">
          <Plus size={20} />
          Post New Publication
        </button>
      </header>

      <section className="bg-white/50 backdrop-blur-xl border border-slate-200/10 p-20 rounded-[3rem] text-center italic font-bold text-slate-300">
         <div className="flex justify-center mb-6 text-slate-100">
            <BookOpen size={64} />
         </div>
         Intellectual Heritage Feed <br/>
         <span className="text-xs uppercase tracking-widest mt-4 inline-block opacity-50 font-black">Scanning Archives...</span>
      </section>
    </div>
  );
}
