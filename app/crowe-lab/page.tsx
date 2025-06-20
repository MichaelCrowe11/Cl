import CroweGrokInterface from "@/components/crowe-grok-interface"

export default function CroweLabPage() {
  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col">
        <div className="border-b p-4 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950 dark:to-blue-950">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Crowe Lab - Advanced Mode
              </h1>
              <p className="text-sm text-muted-foreground">
                PhD-level mycology expertise powered by Grok-2-Latest with enhanced Crowe Logic methodology
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">API Endpoint</div>
              <div className="text-sm font-mono">/api/chat-grok-direct</div>
            </div>
          </div>
        </div>
        <CroweGrokInterface model="grok-2-latest" />
      </div>
    </div>
  )
}
