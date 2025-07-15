import { Metadata } from 'next';
import MycoIDEWizard from '@/components/mycoide-wizard';

export const metadata: Metadata = {
  title: 'MycoIDE Project Wizard | CroweOS',
  description: 'Generate professional mycology cultivation projects with AI-powered analysis tools',
};

export default function MycoIDEWizardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto py-8">
        <MycoIDEWizard />
      </div>
    </div>
  );
}
