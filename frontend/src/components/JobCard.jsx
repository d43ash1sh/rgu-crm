import { motion } from 'framer-motion';

export default function JobCard({ job }) {
  // Format the description
  const description = job.job_description 
    ? job.job_description.substring(0, 100) + '...' 
    : 'Exciting opportunity at ' + job.employer_name;

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="bg-white/70 backdrop-blur-md border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(37,99,235,0.12)] p-6 rounded-2xl flex flex-col justify-between h-full group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-bold text-lg text-slate-900 leading-tight">
            {job.job_title}
          </h3>
          {job.employer_logo && (
            <img 
              src={job.employer_logo} 
              alt={job.employer_name} 
              className="w-10 h-10 object-contain rounded bg-white shadow-sm p-1 ml-4 shrink-0"
              onError={(e) => e.target.style.display = 'none'}
            />
          )}
        </div>
        
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
            <span className="material-symbols-outlined text-[16px]">apartment</span>
            {job.employer_name}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="material-symbols-outlined text-[16px]">location_on</span>
            {job.job_city ? `${job.job_city}, ${job.job_country}` : job.job_country || 'Remote / Unspecified'}
          </div>
        </div>

        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between relative z-10">
        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider rounded-full self-start">
          {job.job_employment_type || 'FULLTIME'}
        </span>
        
        <a 
          href={job.job_apply_link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-primary text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm active:scale-95 group-hover:shadow-md flex items-center gap-2"
        >
          Apply <span className="material-symbols-outlined text-[14px]">open_in_new</span>
        </a>
      </div>
    </motion.div>
  );
}
