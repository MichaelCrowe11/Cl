const fs = require("fs")
const path = require("path")

console.log("🔍 VERIFYING CROWE LOGIC AI PROJECT SETUP")
console.log("==========================================\n")

// Check required files
const requiredFiles = [
  "next.config.mjs",
  "app/layout.tsx",
  "app/page.tsx",
  "tailwind.config.ts",
  "package.json",
  "components/metamask-polyfill.tsx",
  "components/demo-chat-interface.tsx",
  "components/functional-sidebar.tsx",
]

let allFilesExist = true

console.log("📁 Checking required files:")
requiredFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`)
  } else {
    console.log(`❌ ${file} - MISSING`)
    allFilesExist = false
  }
})

console.log("\n📦 Checking package.json dependencies:")
try {
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"))
  const requiredDeps = ["next", "react", "react-dom", "tailwindcss", "lucide-react"]

  requiredDeps.forEach((dep) => {
    if (packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]) {
      console.log(`✅ ${dep}`)
    } else {
      console.log(`❌ ${dep} - MISSING`)
      allFilesExist = false
    }
  })
} catch (error) {
  console.log("❌ Error reading package.json")
  allFilesExist = false
}

console.log("\n🔧 Checking configuration files:")
try {
  // Check Next.js config
  if (fs.existsSync("next.config.mjs")) {
    console.log("✅ Next.js configuration found")
  }

  // Check Tailwind config
  if (fs.existsSync("tailwind.config.ts")) {
    console.log("✅ Tailwind configuration found")
  }

  // Check TypeScript config
  if (fs.existsSync("tsconfig.json")) {
    console.log("✅ TypeScript configuration found")
  }
} catch (error) {
  console.log("❌ Error checking configuration files")
}

console.log("\n" + "=".repeat(50))
if (allFilesExist) {
  console.log("🎉 PROJECT SETUP VERIFIED - ALL FILES PRESENT!")
  console.log("✅ Ready for development and deployment")
  console.log("\n🚀 Next steps:")
  console.log("1. Run 'npm install' to install dependencies")
  console.log("2. Run 'npm run dev' to start development server")
  console.log("3. Run 'npm run build' to create production build")
} else {
  console.log("⚠️  SETUP INCOMPLETE - Some files are missing")
  console.log("Please ensure all required files are present before proceeding")
}
