import GrokChatInterface from "@/components/grok-chat-interface"

export default function GrokLabPage() {
  return (
    <div className="h-screen flex flex-col">
      <GrokChatInterface model="grok-2-1212" />
    </div>
  )
}
