#!/bin/bash
set -e

# ──────────────────────────────────────────────────────────────
# DannFlow Installer
# Usage: curl -sSL https://raw.githubusercontent.com/Danncode10/DannFlow/main/install.sh | bash
# ──────────────────────────────────────────────────────────────

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'
BOLD='\033[1m'

echo -e "${BLUE}${BOLD}"
cat << "BANNER"
  _____                   ______ _
 |  __ \                 |  ____| |
 | |  | | __ _ _ __  _ __| |__  | | _____      __
 | |  | |/ _` | '_ \| '_ \  __| | |/ _ \ \ /\ / /
 | |__| | (_| | | | | | | | |   | | (_) \ V  V /
 |_____/ \__,_|_| |_|_| |_|_|   |_|\___/ \_/\_/
BANNER
echo -e "${NC}"
echo -e "${CYAN}The AI-Native Next.js SaaS Starter for Vibe Coding${NC}"
echo ""

# ── 1. Get app name ──────────────────────────────────────────
# Check if /dev/tty is readable to allow interactive prompts when piped via `curl ... | bash`
if [ -r /dev/tty ]; then
  read -p "$(echo -e "${BOLD}Enter your app name${NC} [my-app]: ")" INPUT_NAME < /dev/tty
  read -p "$(echo -e "${BOLD}GitHub URL for your project repo${NC} (optional): ")" PROJECT_REPO_URL < /dev/tty
elif [ -t 0 ]; then
  read -p "$(echo -e "${BOLD}Enter your app name${NC} [my-app]: ")" INPUT_NAME
  read -p "$(echo -e "${BOLD}GitHub URL for your project repo${NC} (optional): ")" PROJECT_REPO_URL
else
  # Non-interactive installs configure the project origin later via /new-project.
  INPUT_NAME=""
  PROJECT_REPO_URL=""
fi

APP_NAME=${INPUT_NAME:-"my-app"}
PKG_NAME=$(echo "$APP_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g' | sed 's/[^a-z0-9-]//g')

echo -e "\n🚀 Installing ${BOLD}${APP_NAME}${NC} from DannFlow...\n"

# ── 2. Check dependencies ────────────────────────────────────
for cmd in git node npm; do
  if ! command -v $cmd &>/dev/null; then
    echo -e "${RED}❌ '$cmd' is not installed. Please install it and re-run.${NC}"
    exit 1
  fi
done

# ── 3. Clone DannFlow ────────────────────────────────────────
TARGET_DIR="$PWD/$PKG_NAME"

if [ -d "$TARGET_DIR" ]; then
  echo -e "${RED}❌ Directory '${PKG_NAME}' already exists. Choose a different name or remove it first.${NC}"
  exit 1
fi

echo -e "${CYAN}📦 Cloning DannFlow into ./${PKG_NAME}...${NC}"
git clone https://github.com/Danncode10/DannFlow.git "$TARGET_DIR"
cd "$TARGET_DIR"

# Record the exact template revision before resetting Git history.
# /sync-upstream uses this anchor to calculate safe, file-level updates.
DANNFLOW_COMMIT=$(git rev-parse HEAD)
DANNFLOW_SYNCED_AT=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
printf '{\n  "dannflow_commit": "%s",\n  "synced_at": "%s",\n  "repo": "https://github.com/Danncode10/DannFlow",\n  "base_branch": "main",\n  "dev_branch": "dev"\n}\n' "$DANNFLOW_COMMIT" "$DANNFLOW_SYNCED_AT" > dannflow.json
echo -e "✅ Created dannflow.json for DannFlow commit ${DANNFLOW_COMMIT:0:12}"

# Reset Git history to give the new project a clean slate.
rm -rf .git
git init -b main > /dev/null
git remote add upstream https://github.com/Danncode10/DannFlow.git
git remote set-url --push upstream DISABLED

if [ -n "$PROJECT_REPO_URL" ]; then
  git remote add origin "$PROJECT_REPO_URL"
  echo -e "✅ Remotes configured: origin → $PROJECT_REPO_URL, upstream → DannFlow (fetch-only)"
else
  echo -e "✅ Remote configured: upstream → DannFlow (fetch-only)"
  echo -e "   ${YELLOW}Note: Add your project repository origin later (or run /new-project).${NC}"
fi

# ── 4. Set up .env.local ─────────────────────────────────────
if [ -f .env.example ] && [ ! -f .env.local ]; then
  cp .env.example .env.local
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/^NEXT_PUBLIC_SITE_NAME=.*/NEXT_PUBLIC_SITE_NAME=\"$APP_NAME\"/" .env.local
  else
    sed -i "s/^NEXT_PUBLIC_SITE_NAME=.*/NEXT_PUBLIC_SITE_NAME=\"$APP_NAME\"/" .env.local
  fi
  echo -e "✅ Created .env.local with NEXT_PUBLIC_SITE_NAME=\"$APP_NAME\""
  echo -e "   ${YELLOW}⚠️  Remember to fill in your Supabase keys in .env.local${NC}"
elif [ -f .env.local ]; then
  echo -e "ℹ️  .env.local already exists — skipping"
else
  echo -e "${YELLOW}⚠️  .env.example not found — skipping .env.local creation${NC}"
fi

# ── 5. Rebrand package.json & config.ts ──────────────────────
echo -e "\n${CYAN}🎨 Configuring project for '${APP_NAME}'...${NC}"
if [ -f package.json ]; then
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/\"name\": \".*\"/\"name\": \"$PKG_NAME\"/" package.json
  else
    sed -i "s/\"name\": \".*\"/\"name\": \"$PKG_NAME\"/" package.json
  fi
  echo -e "✅ Updated package.json name to '$PKG_NAME'"
fi

if [ -f src/lib/config.ts ]; then
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/name: process.env.NEXT_PUBLIC_SITE_NAME || \".*\"/name: process.env.NEXT_PUBLIC_SITE_NAME || \"$APP_NAME\"/" src/lib/config.ts
  else
    sed -i "s/name: process.env.NEXT_PUBLIC_SITE_NAME || \".*\"/name: process.env.NEXT_PUBLIC_SITE_NAME || \"$APP_NAME\"/" src/lib/config.ts
  fi
  echo -e "✅ Updated src/lib/config.ts fallback name"
fi

# ── 6. Write clean project README.md ─────────────────────────
cat << STARTER_README > README.md
# ${APP_NAME}

Welcome to **${APP_NAME}**, built on the DannFlow SaaS architecture.

## 🚀 Quick Start

### 1. Initialize Context & Vertical DNA
Define your product requirements, audience, and features:
- **For JuanStack Verticals**: Run `/juanstack-init` in your AI IDE for an interactive setup interview.
- **For Standard SaaS**: Fill out `PROJECT_CONTEXT.md`.

### 2. Next Steps with AI Agent
Open this repository in your AI IDE (Claude Code, Antigravity, or Cursor) and follow this sequence:

1. **Configure Repository Origin (if not set):**
   \`\`\`bash
   /new-project
   \`\`\`
2. **Initialize Masterplan & Connect Database:**
   Create a Kanban GitHub Project board with \`Backlog\`, \`Ready\`, \`In progress\`, and \`Done\` columns, then run:
   \`\`\`bash
   /masterplan-init
   \`\`\`
3. **Execute Tasks:**
   \`\`\`bash
   /what-task
   \`\`\`

### 3. Development Commands

\`\`\`bash
npm run dev          # Start local dev server (http://localhost:3000)
npm run build        # Build production bundle
npm run db:migrate   # Push Supabase migrations to remote cloud database
npm run db:types     # Sync TypeScript types from database schema
\`\`\`

### 4. Upstream Syncing
To pull template updates, new commands, and bug fixes from DannFlow without breaking custom code:
\`\`\`bash
/sync-upstream
\`\`\`
STARTER_README
echo -e "✅ Created clean starter README.md"

# ── 7. Initial Git Commit ────────────────────────────────────
git add .
git commit -m "chore: initialize $APP_NAME from DannFlow ($DANNFLOW_COMMIT)" > /dev/null
echo -e "✅ Created clean initial commit on main"

# ── 8. Install npm dependencies ──────────────────────────────
echo -e "\n${CYAN}📦 Installing npm dependencies...${NC}"
npm install
chmod +x .husky/pre-commit .husky/pre-push .husky/commit-msg 2>/dev/null || true
echo -e "✅ npm install complete & husky hooks configured"

# ── 9. Ruflo Setup (Optional) ────────────────────────────────
echo -e "\n${CYAN}🧠 Ruflo (AI Memory & Swarm Tools)${NC}"
echo -e "   Ruflo is optional. To install globally and launch its wizard, run:"
echo -e "   ${CYAN}npm run setup:ruflo${NC} (or ${CYAN}npm install -g ruflo@latest${NC})"

# ── Done ─────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}${BOLD}✅ ${APP_NAME} installed successfully!${NC}"
echo ""
echo -e "${BOLD}Your project:${NC} ./${PKG_NAME}"
echo ""
echo -e "${BOLD}Next steps:${NC}"
echo -e "  1. ${CYAN}cd ${PKG_NAME}${NC}"
echo -e "  2. Initialize project context:"
echo -e "     • For JuanStack verticals: run ${CYAN}/juanstack-init${NC} in your AI IDE"
echo -e "     • For standard SaaS: edit ${CYAN}PROJECT_CONTEXT.md${NC}"
echo -e "  3. Open in your AI IDE and run ${CYAN}/new-project${NC} (to link origin) and ${CYAN}/masterplan-init${NC}"
echo ""
echo -e "${CYAN}Need help? Run ${BOLD}./guide.sh${NC}${CYAN} anytime for step-by-step setup.${NC}"
echo ""
