import { Metadata } from 'next';
import FarmManagementIDE from '@/components/farm-management-ide';

export const metadata: Metadata = {
  title: 'Farm Management IDE - Crowe Logic AI',
  description: '52-week production planning, 7-department task management, environmental monitoring, and yield optimization for commercial mushroom farming.',
  keywords: ['farm management', 'mushroom cultivation', 'production planning', 'yield optimization', 'environmental monitoring', 'commercial farming'],
};

export default function FarmManagementPage() {
  return (
    <div className="h-screen overflow-hidden">
      <FarmManagementIDE />
    </div>
  );
}
