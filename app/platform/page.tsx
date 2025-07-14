import { Metadata } from 'next';
import { PageWrapper } from '@/components/page-wrapper';
import EnhancedCroweLogicDashboard from "@/components/enhanced-crowe-logic-dashboard";

export const metadata: Metadata = {
  title: 'Lab Platform - Crowe Logic AI',
  description: 'Comprehensive mycology lab management platform with batch tracking, protocol management, and research tools.',
  keywords: ['lab management', 'mycology', 'batch tracking', 'protocols', 'research platform'],
};

export default function PlatformPage() {
  return (
    <PageWrapper 
      title="Lab Platform"
      description="Comprehensive mycology lab management and research tools"
      showBreadcrumbs={true}
    >
      <EnhancedCroweLogicDashboard />
    </PageWrapper>
  );
}
