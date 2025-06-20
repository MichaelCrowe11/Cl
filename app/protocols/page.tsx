import { redirect } from "next/navigation"

export default function ProtocolsPage() {
  // Redirect to main app with protocols section
  redirect("/?section=protocols")
}
