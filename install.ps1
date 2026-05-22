# DannFlow Elite Installer for Windows (PowerShell)
# Run: powershell -ExecutionPolicy Bypass -Command "iex (irm https://raw.githubusercontent.com/Danncode10/DannFlow/main/install.ps1)"

Write-Host "`n" -ForegroundColor Cyan
Write-Host @"
  _____                   ______ _
 |  __ \                 |  ____| |
 | |  | | __ _ _ __  _ __| |__  | | _____      __
 | |  | |/ _`` | '_ \| '_ \  __| | |/ _ \ \ /\ / /
 | |__| | (_| | | | | | | |   | | (_) \ V  V /
 |_____/ \__,_|_| |_|_| |_|_|   |_|\___/ \_/\_/
"@ -ForegroundColor Cyan

Write-Host "Welcome to the DannFlow 'Elite' Installer!`n" -ForegroundColor Cyan -NoNewline
Write-Host "The high-performance AI-Native Next.js SaaS Starter.`n`n" -ForegroundColor White

# 1. Prompt for App Name
$app_name = Read-Host "Enter your App Name [My DannFlow App]"
if ([string]::IsNullOrWhiteSpace($app_name)) { $app_name = "My DannFlow App" }

$folder_name = ($app_name.ToLower() -replace ' ', '-') -replace '[^a-z0-9-]', ''

Write-Host "`n🚀 Creating $app_name in $folder_name...`n" -ForegroundColor Cyan

# 2. Clone the Repository
if (git clone https://github.com/Danncode10/DannFlow $folder_name 2>$null) {
    Set-Location $folder_name
    Remove-Item install.ps1 -ErrorAction SilentlyContinue
    Write-Host "✅ Repository cloned`n" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to clone the repository.`n" -ForegroundColor Red
    exit 1
}

# 3. Environment Setup
Write-Host "📦 Installing dependencies...`n" -ForegroundColor Cyan
npm install

Write-Host "🔑 Setting up environment variables...`n" -ForegroundColor Cyan
if (!(Test-Path .env.local) -and (Test-Path .env.example)) {
    Copy-Item .env.example .env.local
    Write-Host "✅ .env.local created`n" -ForegroundColor Green
}

# 4. Install Ruflo (global, once per machine)
Write-Host "🧠 Installing Ruflo globally (beta)...`n" -ForegroundColor Cyan
npm install -g ruflo@latest 2>$null | Out-Null
if ($?) {
    Write-Host "✅ Ruflo installed globally`n" -ForegroundColor Green
} else {
    Write-Host "⚠️  Global ruflo install failed. You can retry later with: npm install -g ruflo@latest`n" -ForegroundColor Yellow
}

# 5. Register Ruflo MCP if Claude CLI exists
$claude_exists = (Get-Command claude -ErrorAction SilentlyContinue) -ne $null
if ($claude_exists) {
    Write-Host "🔌 Registering Ruflo MCP with Claude Code...`n" -ForegroundColor Cyan
    claude mcp add ruflo -- npx ruflo@latest mcp start 2>$null | Out-Null
    if ($?) {
        Write-Host "✅ Ruflo MCP registered`n" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Could not register Ruflo MCP. Run manually: claude mcp add ruflo -- npx ruflo@latest mcp start`n" -ForegroundColor Yellow
    }
} else {
    Write-Host "ℹ️  Claude Code CLI not found — skipping MCP registration.`n" -ForegroundColor Yellow
    Write-Host "   After installing Claude Code, run: claude mcp add ruflo -- npx ruflo@latest mcp start`n"
}

# 6. Per-project Ruflo init (via npm setup script for cross-platform compat)
Write-Host "🌀 Running Ruflo project init wizard...`n" -ForegroundColor Cyan
npx ruflo@latest init wizard 2>$null | Out-Null
if ($?) {
    Write-Host "✅ Ruflo project init complete`n" -ForegroundColor Green
} else {
    Write-Host "⚠️  Ruflo init wizard did not finish. You can run it later with: npx ruflo@latest init wizard`n" -ForegroundColor Yellow
}

# 7. Install design-taste skill packs (idempotent)
Write-Host "🎨 Installing skill packs...`n" -ForegroundColor Cyan
npm run setup:skills 2>$null | Out-Null
if ($?) {
    Write-Host "✅ Skill packs installed`n" -ForegroundColor Green
} else {
    Write-Host "⚠️  Some skill packs failed. Retry later with: npm run setup:skills`n" -ForegroundColor Yellow
}

# 8. Trigger Guide Initialization (Unix guide.sh equivalent — manual steps for Windows)
Write-Host "`n✨ Project initialization instructions:`n" -ForegroundColor Cyan
Write-Host "1. Edit .env.local with your Supabase credentials" -ForegroundColor Yellow
Write-Host "2. Run: npm run dev" -ForegroundColor Yellow
Write-Host "3. For the interactive setup guide, use WSL/Git Bash: ./guide.sh`n" -ForegroundColor Yellow

Write-Host "────────────────────────────────────────────────────────`n" -ForegroundColor Cyan
Write-Host "Setup Complete!`n" -ForegroundColor Green -BackgroundColor Black
Write-Host "Your project is ready in: $folder_name`n" -ForegroundColor Cyan
Write-Host "To start developing:`n" -ForegroundColor White
Write-Host "  1. cd $folder_name`n" -ForegroundColor Yellow
Write-Host "  2. npm run dev`n" -ForegroundColor Yellow
Write-Host "`nHappy Vibe Coding! 🚢`n" -ForegroundColor Green
