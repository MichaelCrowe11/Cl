import { Metadata } from 'next';
import { PageWrapper } from '@/components/page-wrapper';
import LabManagementEnhanced from "@/components/platform/lab-management-enhanced";

export const metadata: Metadata = {
  title: 'CroweOS Lab Platform - Advanced Research Management',
  description: 'Comprehensive AI-powered mycology lab management platform with intelligent tracking, protocol management, and research optimization tools.',
  keywords: ['AI lab management', 'mycology research', 'intelligent tracking', 'research platform', 'scientific workflow'],
};

export default function PlatformPage() {
  return <LabManagementEnhanced />
}
