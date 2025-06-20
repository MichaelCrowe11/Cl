// Crowe Logic AI - Create Test User Script
// This script creates a complete test user with sample data

const { createClient } = require("@supabase/supabase-js")

async function createTestUser() {
  console.log("👤 Creating Crowe Logic AI Test User...\n")

  // Initialize Supabase client with correct environment variables
  const supabase = createClient(
    process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY,
  )

  const testUser = {
    email: "test@crowelogic.ai",
    password: "CroweLogic123!",
    name: "Test User",
  }

  console.log("📧 Creating test user:", testUser.email)

  try {
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: testUser.email,
      password: testUser.password,
      email_confirm: true,
      user_metadata: { name: testUser.name },
    })

    if (authError) {
      if (authError.message.includes("already registered")) {
        console.log("⚠️ Test user already exists, skipping creation")
        return
      }
      throw authError
    }

    console.log("✅ Auth user created:", authData.user.id)

    // Create user profile
    const profileData = {
      id: authData.user.id,
      email: testUser.email,
      name: testUser.name,
      subscription_status: "trial",
      trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
    }

    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .insert(profileData)
      .select()
      .single()

    if (profileError) {
      console.error("Profile creation error:", profileError)
      // Clean up auth user
      await supabase.auth.admin.deleteUser(authData.user.id)
      throw profileError
    }

    console.log("✅ User profile created")

    // Create sample chat session
    const { data: session, error: sessionError } = await supabase
      .from("chat_sessions")
      .insert({
        user_id: authData.user.id,
        title: "Lion's Mane Cultivation Discussion",
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (!sessionError && session) {
      console.log("✅ Sample chat session created")

      // Create sample chat messages
      const messages = [
        {
          session_id: session.id,
          role: "user",
          content: "What's the best substrate for Lion's Mane cultivation?",
          created_at: new Date(Date.now() - 60000).toISOString(),
        },
        {
          session_id: session.id,
          role: "assistant",
          content:
            "Based on advanced biochemical analysis, Lion's Mane (Hericium erinaceus) thrives on hardwood substrates with specific C:N ratios...",
          created_at: new Date().toISOString(),
        },
      ]

      const { error: messagesError } = await supabase.from("chat_messages").insert(messages)

      if (!messagesError) {
        console.log("✅ Sample chat messages created")
      }
    }

    // Create sample cultivation protocol
    const { error: protocolError } = await supabase.from("cultivation_protocols").insert({
      user_id: authData.user.id,
      name: "Lion's Mane Standard Protocol",
      species: "Hericium erinaceus",
      substrate_formula: "50% Hardwood sawdust, 40% Soy hulls, 8% Wheat bran, 2% CaCO3",
      sterilization_method: "Steam sterilization at 121°C for 90 minutes",
      inoculation_rate: "2-3% by weight",
      incubation_temp: "22-24°C",
      incubation_humidity: "85-90%",
      fruiting_temp: "18-22°C",
      fruiting_humidity: "90-95%",
      expected_yield: "2.5-3.5 lbs per 10lb block",
      notes: "Maintain proper air exchange during fruiting phase",
      created_at: new Date().toISOString(),
    })

    if (!protocolError) {
      console.log("✅ Sample cultivation protocol created")
    }

    console.log("\n🎉 Test user created successfully!")
    console.log("\n📋 Test User Credentials:")
    console.log(`   Email: ${testUser.email}`)
    console.log(`   Password: ${testUser.password}`)
    console.log("\n🚀 You can now:")
    console.log("   1. Visit /auth/login")
    console.log("   2. Sign in with the test credentials")
    console.log("   3. Explore the dashboard and features")
    console.log("   4. Test chat functionality with sample data")
  } catch (error) {
    console.error("❌ Error creating test user:", error)
  }
}

// Run the script
createTestUser().catch(console.error)
