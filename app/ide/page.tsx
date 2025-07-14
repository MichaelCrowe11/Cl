import { Metadata } from 'next';
import { PageWrapper } from '@/components/page-wrapper';
import EnhancedCroweLogicIDE from '@/components/enhanced-crowe-logic-ide';

export const metadata: Metadata = {
  title: 'Basic IDE - Crowe Logic AI',
  description: 'Basic integrated development environment for mycology research with AI assistant, file management, and integrated terminal.',
  keywords: ['IDE', 'development environment', 'mycology', 'basic IDE', 'research tools'],
};

export default function CroweLogicIDEPage() {
  return (
    <PageWrapper 
      title="Basic IDE"
      description="Basic integrated development environment for research"
      showBreadcrumbs={true}
    >
      <EnhancedCroweLogicIDE />
    </PageWrapper>
  );
}
