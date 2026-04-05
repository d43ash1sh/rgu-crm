import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Contact() {
  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col antialiased selection:bg-primary/20 selection:text-primary">
      <Navbar />
      
      <main className="flex-1 relative pt-32 pb-24 px-8 max-w-4xl mx-auto w-full z-10">
        <div className="absolute inset-0 pointer-events-none radial-dots z-[-1] opacity-50"></div>
        
        {/* Header */}
        <header className="mb-20 text-center">
          <span className="label-md text-tertiary tracking-[0.2em] mb-4 block uppercase">Helpdesk & Agreements</span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight mb-8">
            Contact & <span className="text-primary">Privacy Policy</span>
          </h1>
          <p className="text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            We value your trust and are committed to keeping your information safe. Connect with us anytime.
          </p>
        </header>

        {/* Contact Information */}
        <section className="bg-surface-container-low p-10 rounded-2xl border border-outline-variant/10 shadow-sm mb-16">
          <h2 className="text-3xl font-bold mb-6 text-slate-900 border-b border-outline-variant/30 pb-4">Contact Information</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">We would love to hear from you. Whether you have questions regarding membership, events, or simply want to connect with the community, feel free to reach out.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-3xl text-primary">location_on</span>
              <div>
                <h4 className="font-semibold text-slate-800 text-lg">Organization Location</h4>
                <p className="text-slate-500 mt-1">Assam Students’ Forum (RGUASF)<br/>Rajiv Gandhi University, Doimukh<br/>Arunachal Pradesh, India</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-3xl text-primary">mail</span>
              <div>
                <h4 className="font-semibold text-slate-800 text-lg">Email Address</h4>
                <a href="mailto:d4shh4x0r@wearehackerone.com" className="text-blue-600 hover:text-blue-700 hover:underline mt-1 block transition-colors">d4shh4x0r@wearehackerone.com</a>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Policy */}
        <section className="space-y-12">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-slate-900 border-b border-outline-variant/30 pb-4">Privacy Policy</h2>
            <p className="text-slate-600 leading-relaxed">Your privacy is important to us. This policy outlines how the Assam Students’ Forum (RGUASF) collects, uses, and protects your information.</p>
          </div>

          <div className="grid gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-slate-800">a. Information We Collect</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-2 ml-2 leading-relaxed">
                <li>Personal details such as your Name, Email, and messages provided through our contact forms.</li>
                <li>Basic website usage data to understand how visitors interact with our platform.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-slate-800">b. How We Use Information</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-2 ml-2 leading-relaxed">
                <li>To adequately respond to your direct queries and helpdesk tickets.</li>
                <li>To improve our digital services and platform layout.</li>
                <li>To communicate important updates, upcoming events, and membership circulars.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-slate-800">c. Data Protection</h3>
              <p className="text-slate-600 leading-relaxed ml-2 border-l-4 border-emerald-500 pl-4 bg-emerald-50 py-3 pr-3 rounded-r-lg">
                <strong>We do not sell or share personal data.</strong> Any information we collect is kept strictly safe and is utilized solely for its intended community purposes.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-slate-800">d. Third-Party Services</h3>
              <p className="text-slate-600 leading-relaxed ml-2">
                We may utilize external application services (such as databases, job board APIs, or contact forms) to ensure the platform runs smoothly. Please note that these integrated tools carry their own respective privacy policies.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-slate-800">e. Consent</h3>
              <p className="text-slate-600 leading-relaxed ml-2">
                By browsing and engaging with the RGUASF digital platform, you automatically agree to the parameters set forth in this policy.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
