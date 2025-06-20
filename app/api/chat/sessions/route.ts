import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY!,
)

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: sessions, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 })
    }

    return NextResponse.json({ sessions })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const { title } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: session, error } = await supabase
      .from("chat_sessions")
      .insert({
        user_id: userId,
        title: title || "New Chat Session",
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
    }

    return NextResponse.json({ session })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
