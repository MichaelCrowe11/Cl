import LabInterface from "@/components/lab-interface"
import { ChatProvider } from "@/state/ChatProvider"

export default function Page() {
  return (
    <ChatProvider>
      <LabInterface />
    </ChatProvider>
  )
}
