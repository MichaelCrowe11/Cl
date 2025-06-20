import EnhancedChatInterface from "@/components/enhanced-chat-interface"

export default function ChatPage() {
  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col">
        <EnhancedChatInterface />
      </div>
    </div>
  )
}
