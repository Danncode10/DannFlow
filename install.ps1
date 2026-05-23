# DannFlow Elite Installer for Windows (PowerShell)
# Run: powershell -ExecutionPolicy Bypass -Command "iex (irm https://raw.githubusercontent.com/Danncode10/DannFlow/main/install.ps1)"
#
# Every step prints a clear PASS/FAIL status. A summary at the end lists
# exactly which steps succeeded, which failed, and which (if any) were skipped.

# ── Step tracking ─────────────────────────────────────────────────────────────
$Global:StepNum     = 0
$Global:PassCount   = 0
$Global:FailCount   = 0
$Global:SkipCount   = 0
$Global:Summary     = @()
$Global:FailedSteps = @()

function Invoke-Step {
    param(
        [Parameter(Mandatory=$true)][string]$Name,
        [Parameter(Mandatory=$true)][scriptblock]$Action
    )
    $Global:StepNum++
    Write-Host ""
    Write-Host "[$Global:StepNum] $Name" -ForegroundColor Cyan
    try {
        & $Action
        $code = $LASTEXITCODE
        if ($null -eq $code) { $code = 0 }
        if ($code -ne 0) { throw "Exit code $code" }
        Write-Host "  ✅ PASS — $Name" -ForegroundColor Green
        $Global:PassCount++
        $Global:Summary += "✅ [$Global:StepNum] $Name"
    } catch {
        Write-Host "  ❌ FAIL — $Name" -ForegroundColor Red
        Write-Host "  ↳ Error: $_" -ForegroundColor Yellow
        $Global:FailCount++
        $Global:FailedSteps += "[$Global:StepNum] $Name — $_"
        $Global:Summary += "❌ [$Global:StepNum] $Name"
    }
}

function Mark-Skip {
    param([string]$Name, [string]$Reason)
    $Global:StepNum++
    Write-Host ""
    Write-Host "[$Global:StepNum] $Name — SKIPPED" -ForegroundColor Yellow
    Write-Host "  ↳ Reason: $Reason" -ForegroundColor Yellow
    $Global:SkipCount++
    $Global:Summary += "⏭  [$Global:StepNum] $Name (skipped: $Reason)"
}

# ── Banner ────────────────────────────────────────────────────────────────────
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
Write-Host "The high-performance AI-Native Next.js SaaS Starter.`n" -ForegroundColor White

# 0. Prompt for App Name
$app_name = Read-Host "Enter your App Name [My DannFlow App]"
if ([string]::IsNullOrWhiteSpace($app_name)) { $app_name = "My DannFlow App" }
$folder_name = ($app_name.ToLower() -replace ' ', '-') -replace '[^a-z0-9-]', ''

Write-Host "`n🚀 Creating $app_name in $folder_name...`n" -ForegroundColor Cyan

# 1. Clone repo
Invoke-Step "Clone DannFlow repository" {
    git clone https://github.com/Danncode10/DannFlow $folder_name
}
if ($Global:FailCount -gt 0) {
    Write-Host "`nFatal: clone failed. Cannot continue.`n" -ForegroundColor Red
    exit 1
}
Set-Location $folder_name
Remove-Item install.ps1, install.sh -ErrorAction SilentlyContinue

# 2. npm install
Invoke-Step "Install npm dependencies" { npm install }

# 3. .env.local
if (Test-Path .env.example) {
    Invoke-Step "Create .env.local from .env.example" {
        Copy-Item .env.example .env.local
    }
} else {
    Mark-Skip "Create .env.local" ".env.example not found in repo"
}

# 4. Ruflo global install
Invoke-Step "Install Ruflo globally (beta)" { npm install -g ruflo@latest }

# 5. Register Ruflo MCP with Claude Code
$claudeExists = (Get-Command claude -ErrorAction SilentlyContinue) -ne $null
if ($claudeExists) {
    Invoke-Step "Register Ruflo MCP server with Claude Code" {
        claude mcp add ruflo -- npx ruflo@latest mcp start
    }
} else {
    Mark-Skip "Register Ruflo MCP server" "Claude Code CLI not found on PATH — run later: claude mcp add ruflo -- npx ruflo@latest mcp start"
}

# 6. Ruflo project init wizard (interactive)
Invoke-Step "Ruflo project init wizard" { npx ruflo@latest init wizard }

# 7. Skill packs
Write-Host "`n── Installing skill packs ──" -ForegroundColor Cyan

Invoke-Step "Skill: Leonxlnx/taste-skill (design taste)"      { npx -y skills add https://github.com/Leonxlnx/taste-skill --all -y }
Invoke-Step "Skill: emilkowalski/skill (animation craft)"      { npx -y skills add https://github.com/emilkowalski/skill --all -y }
Invoke-Step "Skill: pbakaus/impeccable (UI anti-patterns)"     { npx -y skills add https://github.com/pbakaus/impeccable --all -y }
Invoke-Step "Skill: anthropics/claude-api (SDK + caching)"     { npx -y skills add anthropics/skills@claude-api -y }
Invoke-Step "Skill: shadcn/ui (component guidance)"            { npx -y skills add shadcn/ui@shadcn -y }
Invoke-Step "Skill: alirezarezvani/a11y-audit (WCAG 2.2)"      { npx -y skills add alirezarezvani/claude-skills@a11y-audit -y }
Invoke-Step "Skill: coreyhaines31/marketingskills (30+)"       { npx -y skills add coreyhaines31/marketingskills --all -y }
Invoke-Step "Skill: addyosmani/web-quality-skills (SEO)"       { npx -y skills add addyosmani/web-quality-skills@seo -y }

# ── Summary ───────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "═══════════════════ Installation Summary ═══════════════════" -ForegroundColor White
foreach ($item in $Global:Summary) {
    Write-Host "  $item"
}
Write-Host "─────────────────────────────────────────────────────────────" -ForegroundColor White
Write-Host "  Passed:  $Global:PassCount" -ForegroundColor Green
Write-Host "  Failed:  $Global:FailCount" -ForegroundColor Red
Write-Host "  Skipped: $Global:SkipCount" -ForegroundColor Yellow
Write-Host "  Total:   $Global:StepNum"
Write-Host "═════════════════════════════════════════════════════════════`n" -ForegroundColor White

if ($Global:FailCount -eq 0 -and $Global:SkipCount -eq 0) {
    Write-Host "🎉 All $Global:StepNum steps completed successfully — no failures, no skips.`n" -ForegroundColor Green
} elseif ($Global:FailCount -eq 0) {
    Write-Host "✅ All required steps passed. ($Global:SkipCount optional step(s) skipped — see above.)`n" -ForegroundColor Green
} else {
    Write-Host "⚠️  $Global:FailCount step(s) failed:" -ForegroundColor Red
    foreach ($s in $Global:FailedSteps) { Write-Host "   • $s" -ForegroundColor Red }
    Write-Host "`nScroll up to see the actual error output for each failed step.`n" -ForegroundColor Yellow
}

# ── Next steps ────────────────────────────────────────────────────────────────
Write-Host "Your project is ready in: $folder_name`n" -ForegroundColor Cyan
Write-Host "Next: Tailor Claude to YOUR project (do this before building)`n"
Write-Host "  1. cd $folder_name" -ForegroundColor Yellow
Write-Host "  2. Edit README.md to describe YOUR app — not DannFlow" -ForegroundColor Yellow
Write-Host "  3. Open Claude Code and run /init-claude" -ForegroundColor Yellow
Write-Host "  4. Fill in PROJECT_CONTEXT.md" -ForegroundColor Yellow
Write-Host "  5. Run /ruflo-upgrade then /no-conflict" -ForegroundColor Yellow
Write-Host "`nThen: npm run dev to start the dev server.`n" -ForegroundColor Cyan
Write-Host "Happy Vibe Coding! 🚢`n" -ForegroundColor Green

if ($Global:FailCount -gt 0) { exit 1 }
exit 0
