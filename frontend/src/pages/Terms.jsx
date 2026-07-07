import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Terms() {
  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen flex flex-col font-body">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24 px-6 max-w-4xl mx-auto w-full">
        <header className="mb-10 pb-6 border-b border-slate-200">
          <div className="text-xs font-bold uppercase tracking-widest text-[#0969da] mb-2">Legal Documents</div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Terms of Service</h1>
          <p className="text-sm text-slate-500 mt-2">Last updated: July 07, 2026</p>
        </header>

        <article className="prose prose-slate max-w-none space-y-6 text-sm md:text-base leading-relaxed text-slate-650">
          <h2 className="text-xl font-bold text-slate-900 mt-8">1. Acceptance of Terms</h2>
          <p>
            Welcome to the Rajiv Gandhi University (RGU) Assam Students' Forum portal. By accessing, registering, or using our services, including the Student Registry, Housing Hub, and Notice Boards, you agree to comply with and be bound by these Terms of Service.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8">2. Account Registration and Security</h2>
          <p>
            To utilize specific features such as the Student Registry and Housing Hub, you must apply for membership enrollment. You represent and warrant that all registry information submitted is accurate, current, and verified. Forum administrators retain absolute authority to approve, deny, or revoke memberships at any time.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8">3. Conduct and Acceptable Use</h2>
          <p>
            Users are strictly prohibited from submitting misleading descriptions, unauthorized advertisements, or unverified listings on the Housing Hub or forum notice boards. Submissions found violating community standards or representing false credentials will be deleted, and the associated student account locked.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8">4. Moderation & Administrative Action</h2>
          <p>
            All community postings, including accommodation offers and flatmate requests, are subjected to mandatory administrative validation before going live. The admin panel operators reserve the right to edit, decline, or purge posts without prior warning to maintain community trust and security.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8">5. Disclaimers & Limitation of Liability</h2>
          <p>
            The RGU Assam Students' Forum provides this platform as a collaborative resource for student welfare. We do not inspect, guarantee, or take responsibility for the physical safety, financial security, or legal validity of any housing arrangements negotiated through the Housing Hub.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8">6. Changes to Terms</h2>
          <p>
            The executive committee reserves the right to modify these terms at any time. Modified terms take effect immediately upon publication. Continued use of the website represents your agreement to the revised terms.
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
}
