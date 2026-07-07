import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Security() {
  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen flex flex-col font-body">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24 px-6 max-w-4xl mx-auto w-full">
        <header className="mb-10 pb-6 border-b border-slate-200">
          <div className="text-xs font-bold uppercase tracking-widest text-[#0969da] mb-2">Legal Documents</div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Security Policy</h1>
          <p className="text-sm text-slate-500 mt-2">Last updated: July 07, 2026</p>
        </header>

        <article className="prose prose-slate max-w-none space-y-6 text-sm md:text-base leading-relaxed text-slate-650">
          <h2 className="text-xl font-bold text-slate-900 mt-8">1. Security Hardening Measures</h2>
          <p>
            RGUASF implements advanced security systems to protect the student registry database and control mechanisms:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Passwordless Biometrics (WebAuthn / Passkeys)</strong>: Enforces Face ID, Touch ID, or Windows Hello for administrative logins, eliminating credentials theft.</li>
            <li><strong>HTTP-only Cookies</strong>: Admin session tokens are isolated from client-side scripts, neutralizing Cross-Site Scripting (XSS) attacks.</li>
            <li><strong>CSRF Shielding</strong>: Modifying state requests require custom validation headers to block cross-site request forgery.</li>
            <li><strong>Brute-Force Protection</strong>: Login endpoints use dynamic rate limits and lockout mechanisms after multiple failed attempts.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-900 mt-8">2. Vulnerability Reporting Policy</h2>
          <p>
            We take platform security seriously. If you discover a vulnerability or security flaw inside the student directory, housing program, or server endpoints, please report it privately to the technical operations committee.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8">3. Reporting Procedure</h2>
          <p>
            Please email your detailed security disclosure report directly to the Technical Administrator. Include proof-of-concept steps, affected endpoints, and sample request payloads if applicable. We will acknowledge receipt within 48 hours and work on resolving the issue immediately.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8">4. Prohibited Testing Methods</h2>
          <p>
            While we encourage responsible vulnerability disclosures, please do not engage in activities that cause denial of service (DoS), damage student registry files, or compromise other users' privacy.
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
}
