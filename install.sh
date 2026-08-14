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
cat << "EOF"
  _____                   ______ _
 |  __ \                 |  ____| |
 | |  | | __ _ _ __  _ __| |__  | | _____      __
 | |  | |/ _` | '_ \| '_ \  __| | |/ _ \ \ /\ / /
 | |__| | (_| | | | | | | | |   | | (_) \ V  V /
 |_____/ \__,_|_| |_|_| |_|_|   |_|\___/ \_/\_/
EOF
echo -e "${NC}"
echo -e "${CYAN}The AI-Native Next.js SaaS Starter for Vibe Coding${NC}"
echo ""

# ── 1. Get app name ──────────────────────────────────────────
if [ -t 0 ]; then
  read -p "$(echo -e "${BOLD}Enter your app name${NC} [my-app]: ")" INPUT_NAME < /dev/tty
  read -p "$(echo -e "${BOLD}GitHub URL for your project repo${NC} (optional): ")" PROJECT_REPO_URL < /dev/tty
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

# Record the exact template revision before the project history is rebranded.
# Both sync commands use this anchor to calculate safe, file-level updates.
DANNFLOW_COMMIT=$(git rev-parse HEAD)
DANNFLOW_SYNCED_AT=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
printf '{\n  "dannflow_commit": "%s",\n  "synced_at": "%s",\n  "repo": "https://github.com/Danncode10/DannFlow",\n  "base_branch": "main",\n  "dev_branch": "dev"\n}\n' "$DANNFLOW_COMMIT" "$DANNFLOW_SYNCED_AT" > dannflow.json
echo -e "✅ Created dannflow.json for DannFlow commit ${DANNFLOW_COMMIT:0:12}"

# DannFlow is the template. Keep it as fetch-only upstream so project work
# cannot accidentally be pushed back into the template repository.
git remote rename origin upstream
git remote set-url --push upstream DISABLED

if [ -n "$PROJECT_REPO_URL" ]; then
  git remote add origin "$PROJECT_REPO_URL"
  echo -e "✅ Remotes configured: origin → project, upstream → DannFlow (fetch-only)"
else
  echo -e "✅ Remote configured: upstream → DannFlow (fetch-only)"
  echo -e "   ${YELLOW}Your project still needs an origin remote. /new-project must create/repoint it before pushing.${NC}"
fi

# ── 4. Install npm dependencies ──────────────────────────────
echo -e "\n${CYAN}📦 Installing npm dependencies...${NC}"
npm install --silent
echo -e "✅ npm install complete"

# ── 5. Set up .env.local ─────────────────────────────────────
if [ -f .env.example ] && [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo -e "✅ Created .env.local from .env.example"
  echo -e "   ${YELLOW}⚠️  Remember to fill in your Supabase keys in .env.local${NC}"
elif [ -f .env.local ]; then
  echo -e "ℹ️  .env.local already exists — skipping"
else
  echo -e "${YELLOW}⚠️  .env.example not found — skipping .env.local creation${NC}"
fi

# ── 6. Rebrand project via guide.sh ──────────────────────────
echo -e "\n${CYAN}🎨 Rebranding project to '${APP_NAME}'...${NC}"
chmod +x guide.sh
bash guide.sh init "$APP_NAME"
echo -e "✅ Project rebranded"

# ── 7. Install Ruflo (optional) ──────────────────────────────
echo -e "\n${CYAN}🧠 Installing Ruflo (AI memory + swarm tools)...${NC}"
if npm install -g ruflo@latest --silent 2>/dev/null; then
  echo -e "✅ Ruflo installed globally"
  echo -e "   ${YELLOW}Run 'ruflo init wizard' inside your project to finish Ruflo setup${NC}"
else
  echo -e "${YELLOW}⚠️  Ruflo install failed (permission issue or npm registry). Skipping.${NC}"
  echo -e "   You can install it later with: ${CYAN}npm install -g ruflo@latest${NC}"
fi

# ── Done ─────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}${BOLD}✅ DannFlow installed successfully!${NC}"
echo ""
echo -e "${BOLD}Your project:${NC} ./${PKG_NAME}"
echo ""
echo -e "${BOLD}Next steps:${NC}"
echo -e "  1. ${CYAN}cd ${PKG_NAME}${NC}"
echo -e "  2. Open in Claude Code and run ${CYAN}/new-project${NC} to configure origin and project context"
echo -e "  3. Configure ${CYAN}GitHub MCP${NC} and ${CYAN}Supabase MCP${NC} (see docs/dannflow_docs/mcp-setup.md)"
echo -e "  4. Create a Kanban GitHub Project with Backlog, Ready, In progress, Done"
echo -e "  5. Run ${CYAN}/masterplan-init${NC}, then ${CYAN}/what-task${NC}"
echo ""
echo -e "${CYAN}Need help? Run ${BOLD}./guide.sh${NC}${CYAN} anytime for step-by-step setup.${NC}"
echo ""
