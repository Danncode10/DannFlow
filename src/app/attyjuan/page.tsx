'use client';

import { AttyJuanNavbar } from '@/components/attyjuan/navbar';
import { AttyJuanHero } from '@/components/attyjuan/hero';
import { StatsBa } from '@/components/attyjuan/stats-bar';
import { ChatPreviewSection } from '@/components/attyjuan/chat-preview';
import { HowItWorksSection } from '@/components/attyjuan/how-it-works';
import { RolesSection } from '@/components/attyjuan/roles';
import { FlowSection } from '@/components/attyjuan/flow';
import { TrustSection } from '@/components/attyjuan/trust';
import { AttyJuanFooter } from '@/components/attyjuan/footer';

export default function AttyJuanPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700&display=swap');
      `}</style>
      <div style={{ backgroundColor: '#F5F7FA', color: '#0F1F2E' }} className="min-h-screen">
        <AttyJuanNavbar />
        <AttyJuanHero />
        <StatsBa />
        <ChatPreviewSection />
        <HowItWorksSection />
        <RolesSection />
        <FlowSection />
        <TrustSection />
        <AttyJuanFooter />
      </div>
    </>
  );
}
