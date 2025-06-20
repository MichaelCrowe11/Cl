import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY!,
)

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // Create user profile
    const { error: profileError } = await supabase.from("user_profiles").insert({
      id: authData.user.id,
      email,
      name,
      subscription_status: "trial",
      trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      created_at: new Date().toISOString(),
    })

    if (profileError) {
      return NextResponse.json({ error: "Failed to create profile" }, { status: 500 })
    }

    return NextResponse.json({
      message: "User created successfully",
      user: { id: authData.user.id, email, name },
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
