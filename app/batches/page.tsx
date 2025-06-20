import { redirect } from "next/navigation"

export default function BatchesPage() {
  // Redirect to main app with batches section
  redirect("/?section=batches")
}
