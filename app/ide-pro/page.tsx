import { Metadata } from 'next';
import CroweLogicIDE from '@/components/CroweLogicIDE';

export const metadata: Metadata = {
  title: 'Professional IDE - Crowe Logic AI',
  description: 'Professional integrated development environment for mycology research with advanced AI assistance, file management, and terminal integration.',
  keywords: ['IDE', 'development environment', 'mycology', 'coding', 'AI assistance'],
};

export default function IDEProPage() {
  return (
    <div className="h-screen">
      <CroweLogicIDE />
    </div>
  );
}
