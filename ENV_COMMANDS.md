# CroweOS Systems - Environment Management Commands

# 1. Check your current Vercel environment variables
vercel env ls

# 2. Pull existing environment variables from Vercel
./env-sync.sh pull

# 3. List all environment variables (local and remote)
./env-sync.sh list

# 4. Setup development environment
./env-sync.sh setup

# 5. Push local environment variables to Vercel (after editing .env.local)
./env-sync.sh push

# Manual Vercel env commands:
# Add a single environment variable to all environments
vercel env add OPENAI_API_KEY

# Add environment variable to specific environment
vercel env add DATABASE_URL production

# Remove an environment variable
vercel env rm VARIABLE_NAME

# Pull all environment variables to a file
vercel env pull .env.local
