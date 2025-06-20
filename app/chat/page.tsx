import { redirect } from "next/navigation"

export default function ChatPage() {
  // Redirect to main app with chat section
  redirect("/?section=chat")
}
