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

    const { data: environmentalData, error } = await supabase
      .from("user_environmental_data")
      .select("*")
      .eq("user_id", userId)
      .order("recorded_at", { ascending: false })
      .limit(10)

    if (error) {
      return NextResponse.json({ error: "Failed to fetch environmental data" }, { status: 500 })
    }

    return NextResponse.json({ environmentalData })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const { location, temperature, humidity, co2_level, ph_level, pressure } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: environmentalData, error } = await supabase
      .from("user_environmental_data")
      .insert({
        user_id: userId,
        location,
        temperature,
        humidity,
        co2_level,
        ph_level,
        pressure,
        recorded_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "Failed to record environmental data" }, { status: 500 })
    }

    return NextResponse.json({ environmentalData })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
