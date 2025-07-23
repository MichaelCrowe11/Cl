import { Metadata } from "next"
import CroweLogicProIDE from "@/components/crowe-logic-pro-ide-clean"

export const metadata: Metadata = {
  title: 'Crowe Logic Pro IDE - AI-Powered Development Environment',
  description: 'Professional IDE with natural language coding, ML algorithm generation, AI-powered debugging, and intelligent code completion.',
}

export default function CroweLogicProPage() {
  return <CroweLogicProIDE />
}
