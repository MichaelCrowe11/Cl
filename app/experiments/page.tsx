import { redirect } from "next/navigation"

export default function ExperimentsPage() {
  // Redirect to main app with experiments section
  redirect("/?section=experiments")
}
