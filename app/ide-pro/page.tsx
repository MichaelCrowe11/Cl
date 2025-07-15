import { Metadata } from 'next';
import ProCroweLogicIDESimple from '@/components/pro-crowe-logic-ide-simple';

export const metadata: Metadata = {
  title: 'Professional IDE - Crowe Logic AI Pro',
  description: 'Advanced professional IDE with AI-powered code completion, real-time debugging, performance monitoring, and specialized mycology development tools.',
  keywords: ['Pro IDE', 'AI development', 'mycology', 'debugging', 'collaboration', 'professional coding'],
};

export default function IDEProPage() {
  return (
    <div className="h-screen">
      <ProCroweLogicIDESimple />
    </div>
  );
}
