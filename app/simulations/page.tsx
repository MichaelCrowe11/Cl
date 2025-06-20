import { redirect } from "next/navigation"

export default function SimulationsPage() {
  // Redirect to main app with simulations section
  redirect("/?section=simulations")
}
