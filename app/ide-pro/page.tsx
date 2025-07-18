import { Metadata } from 'next';
import CroweOSProIDEEnhanced from '@/components/ide/crowe-os-pro-ide-enhanced';

export const metadata: Metadata = {
  title: 'CroweOS Pro IDE - Enhanced Development Environment',
  description: 'Professional IDE with modular sidebars, integrated Crowe Logic AI, mycology tools, enhanced scrollbars, code completion, and seamless development experience based on the basic IDE design.',
  keywords: ['Pro IDE', 'Crowe Logic', 'AI development', 'mycology', 'debugging', 'collaboration', 'professional coding', 'modular sidebars'],
};

export default function IDEProPage() {
  return (
    <div className="h-screen overflow-hidden">
      <CroweOSProIDEEnhanced />
    </div>
  );
}
