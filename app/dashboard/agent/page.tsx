import { AgentAssistant } from '@/components/agent-assistant'

export default function DashboardAgentPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Crowe Logic Coding Agent</h1>
        <p className="text-muted-foreground mt-1">
          Generate production-ready code for your mycology research platform
        </p>
      </div>
      <AgentAssistant />
    </div>
  )
} 