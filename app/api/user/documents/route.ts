import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY!,
)

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const category = request.nextUrl.searchParams.get("category")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let query = supabase
      .from("user_documents")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (category) {
      query = query.eq("category", category)
    }

    const { data: documents, error } = await query

    if (error) {
      return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
    }

    return NextResponse.json({ documents })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const { name, type, category, content, metadata } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: document, error } = await supabase
      .from("user_documents")
      .insert({
        user_id: userId,
        name,
        type,
        category,
        content,
        file_size: content ? content.length : 0,
        metadata: metadata || {},
        status: "ready",
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "Failed to create document" }, { status: 500 })
    }

    return NextResponse.json({ document })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
