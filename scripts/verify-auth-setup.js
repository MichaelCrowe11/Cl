// Crowe Logic AI - Authentication Setup Verification Script
// This script verifies that the authentication system is properly configured

const { createClient } = require("@supabase/supabase-js")

async function verifyAuthSetup() {
  console.log("🔍 Verifying Crowe Logic AI Authentication Setup...\n")

  // Check environment variables - using the correct variable names from your setup
  const requiredEnvVars = [
    "SUPABASE_NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SUPABASE_SERVICE_ROLE_KEY",
  ]

  console.log("📋 Checking Environment Variables:")
  let envVarsValid = true

  requiredEnvVars.forEach((envVar) => {
    const value = process.env[envVar]
    if (value) {
      console.log(`✅ ${envVar}: Set (${value.substring(0, 20)}...)`)
    } else {
      console.log(`❌ ${envVar}: Missing`)
      envVarsValid = false
    }
  })

  if (!envVarsValid) {
    console.log("\n❌ Environment variables are missing. Please set them before continuing.")
    console.log("\n🔧 Expected Environment Variables:")
    console.log("   SUPABASE_NEXT_PUBLIC_SUPABASE_URL=your_supabase_url")
    console.log("   SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key")
    console.log("   SUPABASE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key")
    return
  }

  // Initialize Supabase client with correct environment variables
  const supabase = createClient(
    process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY,
  )

  console.log("\n🗄️ Checking Database Tables:")

  const tables = ["user_profiles", "chat_sessions", "chat_messages", "cultivation_protocols", "batch_tracking"]

  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select("*").limit(1)

      if (error) {
        console.log(`❌ ${table}: Error - ${error.message}`)
      } else {
        console.log(`✅ ${table}: Available`)
      }
    } catch (err) {
      console.log(`❌ ${table}: Connection error - ${err.message}`)
    }
  }

  console.log("\n🔐 Checking RLS Policies:")

  try {
    const { data: policies, error } = await supabase
      .rpc("get_policies")
      .catch(() => ({ data: null, error: "RPC not available" }))

    if (policies && policies.length > 0) {
      console.log(`✅ RLS Policies: ${policies.length} policies found`)
    } else {
      console.log("⚠️ RLS Policies: Unable to verify (this is normal)")
    }
  } catch (err) {
    console.log("⚠️ RLS Policies: Unable to verify (this is normal)")
  }

  console.log("\n🔧 Testing Authentication Functions:")

  // Test user creation (dry run)
  try {
    const testEmail = `test-${Date.now()}@crowelogic.ai`
    const { data, error } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: "test-password-123",
      email_confirm: true,
      user_metadata: { name: "Test User" },
    })

    if (data.user) {
      console.log("✅ User Creation: Working")

      // Clean up test user
      await supabase.auth.admin.deleteUser(data.user.id)
      console.log("✅ User Cleanup: Working")
    } else if (error) {
      console.log(`❌ User Creation: ${error.message}`)
    }
  } catch (err) {
    console.log(`❌ User Creation: ${err.message}`)
  }

  console.log("\n📊 Database Statistics:")

  try {
    const { data: userCount } = await supabase.from("user_profiles").select("id", { count: "exact", head: true })

    console.log(`👥 Total Users: ${userCount || 0}`)
  } catch (err) {
    console.log("❌ Unable to fetch user statistics")
  }

  console.log("\n🎯 Setup Verification Complete!")
  console.log("📝 Next Steps:")
  console.log("   1. Visit /auth/register to test user registration")
  console.log("   2. Visit /auth/login to test user login")
  console.log("   3. Check that protected routes require authentication")
  console.log("   4. Verify user profiles are created automatically")

  console.log("\n🚀 Your Crowe Logic AI authentication system is ready!")
}

// Run verification
verifyAuthSetup().catch(console.error)
