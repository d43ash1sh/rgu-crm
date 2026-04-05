import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full py-12 px-8 border-t border-slate-200/10 bg-slate-50 relative z-10 text-center md:text-left">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto items-start">
        <div>
          <span className="text-lg font-bold text-slate-900">Assam Students’ Forum</span>
          <p className="mt-4 text-slate-500 font-inter text-xs tracking-widest leading-relaxed">
            Connecting hearts across borders, preserving legacy through leadership.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <a className="text-slate-500 hover:text-blue-600 hover:underline decoration-2 underline-offset-4 font-inter text-xs tracking-widest uppercase transition-colors" href="https://www.instagram.com/rgu_assam_students_forum" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a className="text-slate-500 hover:text-blue-600 hover:underline decoration-2 underline-offset-4 font-inter text-xs tracking-widest uppercase transition-colors" href="https://www.facebook.com/groups/698892873526421/" target="_blank" rel="noreferrer">
            Facebook
          </a>
          <a className="text-slate-500 hover:text-blue-600 hover:underline decoration-2 underline-offset-4 font-inter text-xs tracking-widest uppercase transition-colors" href="#" target="_blank" rel="noreferrer">
            Telegram
          </a>
        </div>
        <div className="flex flex-col gap-4 md:items-end">
          <Link to="/contact" className="text-slate-500 hover:text-blue-600 hover:underline decoration-2 underline-offset-4 font-inter text-xs tracking-widest uppercase transition-colors">
            Contact &amp; Privacy Policy
          </Link>
          <p className="text-slate-400 font-inter text-xs tracking-widest uppercase md:text-right">
            © 2025 Assam Students’ Forum, RGU.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-200">
        <p className="text-slate-400 font-medium text-sm tracking-wide text-center">
          <a href="https://www.instagram.com/debashishbordoloi007" target="_blank" rel="noreferrer" className="hover:text-blue-500 hover:underline transition-colors">
            made by ❤️ debashish
          </a>
        </p>
      </div>
    </footer>
  );
}
