import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Use the correct environment variable names
const supabase = createClient(
  process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY!,
)

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    console.log("Registration attempt for:", email)

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    })

    if (authError) {
      console.error("Auth error:", authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    console.log("User created successfully:", authData.user.id)

    // Create user profile with better error handling
    const profileData = {
      id: authData.user.id,
      email,
      name,
      subscription_status: "trial",
      trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
    }

    console.log("Creating profile with data:", profileData)

    const { data: profileResult, error: profileError } = await supabase
      .from("user_profiles")
      .insert(profileData)
      .select()
      .single()

    if (profileError) {
      console.error("Profile creation error:", profileError)

      // Try to clean up the auth user if profile creation fails
      try {
        await supabase.auth.admin.deleteUser(authData.user.id)
      } catch (cleanupError) {
        console.error("Failed to cleanup user after profile error:", cleanupError)
      }

      return NextResponse.json(
        {
          error: `Failed to create profile: ${profileError.message}`,
          details: profileError,
        },
        { status: 500 },
      )
    }

    console.log("Profile created successfully:", profileResult)

    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: authData.user.id,
        email,
        name,
        subscription_status: "trial",
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
