# Installing Dependencies on Windows

## Option 1: Using npm (if you have Node.js installed)

```powershell
# Install pnpm globally
npm install -g pnpm

# Install project dependencies
pnpm install
```

## Option 2: Direct pnpm installation

```powershell
# Install pnpm using PowerShell
iwr https://get.pnpm.io/install.ps1 -useb | iex

# Restart your terminal, then:
pnpm install
```

## Option 3: Using npm directly (without pnpm)

```powershell
# If you prefer npm over pnpm
npm install
```

After installing dependencies, you can start the development server:
```powershell
pnpm dev
# or
npm run dev
``` 