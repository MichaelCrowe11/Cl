import { redirect } from "next/navigation"

export default function ReportsPage() {
  // Redirect to main app with reports section
  redirect("/?section=reports")
}
