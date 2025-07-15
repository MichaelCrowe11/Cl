import { Metadata } from 'next';
import VSCodeProIDE from '@/components/vscode-pro-ide-clean';

export const metadata: Metadata = {
  title: 'CroweOS Pro IDE - VS Code Enhanced',
  description: 'Professional VS Code-styled IDE with integrated Crowe Logic AI, advanced debugging, mycology tools, and seamless development experience.',
  keywords: ['Pro IDE', 'VS Code', 'AI development', 'mycology', 'debugging', 'collaboration', 'professional coding'],
};

export default function IDEProPage() {
  return (
    <div className="h-screen overflow-hidden">
      <VSCodeProIDE />
    </div>
  );
}
