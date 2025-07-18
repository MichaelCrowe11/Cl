import { Metadata } from 'next';
import SLODashboard from '@/components/slo-dashboard';

export const metadata: Metadata = {
  title: 'SLO Dashboard | CroweOS',
  description: 'Service Level Objectives monitoring and canary health checks',
};

export default function DashboardSLOPage() {
  return (
    <div className="min-h-screen bg-background">
      <SLODashboard />
    </div>
  );
}
