import { redirect } from "next/navigation"

export default function DashboardPage() {
  // Redirect to main app with dashboard section
  redirect("/?section=dashboard")
}
