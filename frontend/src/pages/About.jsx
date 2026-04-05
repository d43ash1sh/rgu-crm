import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col antialiased selection:bg-primary/20 selection:text-primary">
      <Navbar />
      
      <main className="flex-1 relative pt-32 pb-24 px-8 max-w-5xl mx-auto w-full z-10">
        <div className="absolute inset-0 pointer-events-none radial-dots z-[-1] opacity-50"></div>
        
        {/* Header */}
        <header className="mb-20 text-center">
          <span className="label-md text-tertiary tracking-[0.2em] mb-4 block uppercase">Established 2011</span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight mb-8">
            About RGU<span className="text-primary">ASF</span>
          </h1>
          <p className="text-2xl md:text-3xl text-on-surface-variant font-light leading-relaxed max-w-4xl mx-auto italic">
            “A home away from home for Assamese students at RGU — built on unity, culture, and support.”
          </p>
        </header>

        {/* Identity & Mission */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24 items-start">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold border-b border-outline-variant/30 pb-4">Who We Are</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              The Assam Students’ Forum, Rajiv Gandhi University (RGUASF) is a student-led organization representing the Assamese student community at Rajiv Gandhi University, Arunachal Pradesh.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Established with the aim of building unity and support among students from Assam, the forum works as a bridge between students, culture, and academic life. RGUASF focuses on creating a welcoming environment for students who come from Assam to pursue higher education. It helps newcomers adjust to campus life, provides peer support, and ensures that no student feels isolated away from home.
            </p>
          </div>
          
          <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/10 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-primary flex items-center gap-3">
              <span className="material-symbols-outlined">visibility</span>
              Our Vision
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed font-medium">
              To build a strong, connected, and supportive Assamese student community at Rajiv Gandhi University that encourages growth, cultural pride, and mutual respect.
            </p>
          </div>
        </section>

        {/* What We Do & Mission Framework */}
        <section className="mb-24">
          <h2 className="text-4xl font-bold tracking-tight mb-12 text-center">Our Mission & Activities</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
              <h3 className="text-2xl font-bold mb-6 text-blue-900 flex items-center gap-3">
                <span className="material-symbols-outlined">api</span>
                Core Mission
              </h3>
              <ul className="space-y-4 text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-blue-500 mt-0.5">check_circle</span>
                  <span>Support Assamese students academically and socially.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-blue-500 mt-0.5">check_circle</span>
                  <span>Promote unity, cooperation, and leadership among members.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-blue-500 mt-0.5">check_circle</span>
                  <span>Preserve and celebrate Assamese culture and traditions.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-blue-500 mt-0.5">check_circle</span>
                  <span>Act as a platform for student voice and representation.</span>
                </li>
              </ul>
            </div>

            {/* Activities */}
            <div className="bg-indigo-50 p-8 rounded-2xl border border-indigo-100">
              <h3 className="text-2xl font-bold mb-6 text-indigo-900 flex items-center gap-3">
                <span className="material-symbols-outlined">local_activity</span>
                What We Do
              </h3>
              <ul className="space-y-4 text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-indigo-500 mt-0.5">festival</span>
                  <span>Organize cultural events like Bihu celebrations and festivals.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-indigo-500 mt-0.5">diversity_3</span>
                  <span>Conduct student meetups, discussions, and awareness programs.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-indigo-500 mt-0.5">support_agent</span>
                  <span>Provide guidance and support for new students.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-indigo-500 mt-0.5">campaign</span>
                  <span>Represent student concerns when required.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-indigo-500 mt-0.5">handshake</span>
                  <span>Promote collaboration with other student communities.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="mb-12">
          <div className="text-center mb-12">
            <span className="label-md text-tertiary tracking-widest uppercase">Principles</span>
            <h2 className="text-4xl font-bold tracking-tight mt-4">Our Core Values</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center hover:-translate-y-1 transition-transform">
              <span className="material-symbols-outlined text-4xl text-primary mb-4 block">diversity_1</span>
              <h4 className="font-bold text-lg mb-2">Unity & Brotherhood</h4>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center hover:-translate-y-1 transition-transform">
              <span className="material-symbols-outlined text-4xl text-orange-500 mb-4 block">temple_hindu</span>
              <h4 className="font-bold text-lg mb-2">Cultural Preservation</h4>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center hover:-translate-y-1 transition-transform">
              <span className="material-symbols-outlined text-4xl text-emerald-500 mb-4 block">supervisor_account</span>
              <h4 className="font-bold text-lg mb-2">Leadership & Responsibility</h4>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center hover:-translate-y-1 transition-transform">
              <span className="material-symbols-outlined text-4xl text-purple-500 mb-4 block">volunteer_activism</span>
              <h4 className="font-bold text-lg mb-2">Inclusivity & Respect</h4>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
