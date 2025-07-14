import { Metadata } from 'next';
import { PageWrapper } from '@/components/page-wrapper';
import CroweLogicChatGPTInterface from "@/components/crowe-logic-chatgpt-interface";

export const metadata: Metadata = {
  title: 'AI Assistant - Crowe Logic AI',
  description: 'Intelligent AI assistant for mycology research, lab management, and cultivation guidance with advanced chat capabilities.',
  keywords: ['AI assistant', 'chat', 'mycology', 'research help', 'cultivation guidance'],
};

export default function ChatPage() {
  return (
    <PageWrapper 
      title="AI Assistant"
      description="Intelligent assistant for mycology research and lab management"
      showBreadcrumbs={true}
    >
      <CroweLogicChatGPTInterface />
    </PageWrapper>
  );
}
