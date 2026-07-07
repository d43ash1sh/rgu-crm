import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Privacy() {
  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen flex flex-col font-body">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24 px-6 max-w-4xl mx-auto w-full">
        <header className="mb-10 pb-6 border-b border-slate-200">
          <div className="text-xs font-bold uppercase tracking-widest text-[#0969da] mb-2">Legal Documents</div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-slate-500 mt-2">Last updated: July 07, 2026</p>
        </header>

        <article className="prose prose-slate max-w-none space-y-6 text-sm md:text-base leading-relaxed text-slate-650">
          <h2 className="text-xl font-bold text-slate-900 mt-8">1. Information We Collect</h2>
          <p>
            When applying for membership or submitting flatmate matches, we collect the necessary personal data to verify your student status. This includes your name, institutional email address, department, study year, university roll number, contact details, and hometown district.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8">2. How We Use Your Data</h2>
          <p>
            We process collected data solely for verifying enrollment eligibility, matching students in housing programs, and delivering administrative notices. Personal files, including contact numbers, are only displayed on verified public listing elements upon your explicit consent.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8">3. Data Sharing & Security</h2>
          <p>
            The RGU Assam Students' Forum does not sell or distribute user registry files to third-party commercial marketing platforms. We protect administrative access with multi-layered biometric Passkeys (WebAuthn) and session tokens to enforce restricted record logs.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8">4. Cookies and Session Storage</h2>
          <p>
            We employ session cookies to maintain administrator authentication state. These cookies are set with HTTP-only, secure, and same-site flags to eliminate external access and protect your session credentials.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8">5. User Rights & Data Retention</h2>
          <p>
            Registered members have the right to request deletion or modification of their registry data at any time. Active listing owners can delete their postings instantly from their accounts. Administrators remove expired profiles and listings regularly.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8">6. Contact Information</h2>
          <p>
            For privacy inquiries or data removal requests, please connect with the security operations committee at the official RGUASF communication channels.
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
}
