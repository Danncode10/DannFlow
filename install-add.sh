#!/bin/bash

# install-add.sh — Add DannFlow Claude tooling to an existing project
# Usage: curl -sSL https://raw.githubusercontent.com/Danncode10/DannFlow/main/install-add.sh | bash
#
# What it does:
#   - Downloads .claude/ (commands, CLAUDE.md, SKILLS.md), guide.sh,
#     AGENTS.md, and PROJECT_CONTEXT.md into your existing project
#   - Installs Ruflo globally and registers its MCP server
#   - Downloads all 8 skill packs
#   - Does NOT touch src/, package.json, .env.local, or your database
#
# After running, open Claude Code and run:
#   1. Edit README.md (describe YOUR project)
#   2. /init-claude   (tailors CLAUDE.md + SKILLS.md + commands to your project)
#   3. /ruflo-upgrade (adds memory + parallel patterns to commands)
#   4. /no-conflict   (verify no drift)

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m'

DANNFLOW_REPO="https://github.com/Danncode10/DannFlow"
RAW_BASE="https://raw.githubusercontent.com/Danncode10/DannFlow/main"
TMP_DIR="/tmp/dannflow-add-$$"

echo -e "${CYAN}${BOLD}"
cat << "EOF"
  _____                   ______ _
 |  __ \                 |  ____| |
 | |  | | __ _ _ __  _ __| |__  | | _____      __
 | |  | |/ _` | '_ \| '_ \  __| | |/ _ \ \ /\ / /
 | |__| | (_| | | | | | | | |   | | (_) \ V  V /
 |_____/ \__,_|_| |_|_| |_|_|   |_|\___/ \_/\_/
EOF
echo -e "${NC}"

echo -e "${BOLD}DannFlow — Add Claude Tooling to Existing Project${NC}"
echo -e "Adds .claude/, guide.sh, SKILLS.md, AGENTS.md, and PROJECT_CONTEXT.md."
echo -e "${YELLOW}Your src/, package.json, .env.local, and database are never touched.${NC}\n"

# Safety check — must be in a project directory
if [ ! -f "package.json" ] && [ ! -f "README.md" ]; then
    echo -e "${RED}❌ No package.json or README.md found.${NC}"
    echo -e "   Run this from the root of your existing project.\n"
    exit 1
fi

# Confirm before proceeding
echo -e "This will add DannFlow Claude tooling to: ${CYAN}$(pwd)${NC}"
read -p "Proceed? (y/n) [y]: " confirm < /dev/tty
confirm=${confirm:-y}
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
    echo -e "\n${YELLOW}Cancelled.${NC}"
    exit 0
fi

echo -e "\n📥 ${CYAN}Fetching DannFlow files...${NC}"

# Clone DannFlow to a temp dir (sparse, depth 1)
if ! git clone --depth 1 --filter=blob:none --sparse "$DANNFLOW_REPO" "$TMP_DIR" 2>/dev/null; then
    echo -e "${RED}❌ Failed to clone DannFlow. Check your internet connection.${NC}"
    exit 1
fi

cd "$TMP_DIR" || exit 1
git sparse-checkout set .claude guide.sh SKILLS.md AGENTS.md PROJECT_CONTEXT.md 2>/dev/null
cd - > /dev/null || exit 1

# Copy .claude/ — merge, don't overwrite user's custom commands
echo -e "📁 ${CYAN}Installing .claude/ (commands + config)...${NC}"
if [ -d ".claude" ]; then
    echo -e "   ${YELLOW}Existing .claude/ found — merging. Your custom commands will be preserved.${NC}"
    cp -rn "$TMP_DIR/.claude/." ".claude/" 2>/dev/null || true
    # Force-overwrite only the DannFlow command files (not user-created ones)
    for f in "$TMP_DIR"/.claude/commands/*.md; do
        fname=$(basename "$f")
        cp "$f" ".claude/commands/$fname"
    done
    echo -e "   ✅ .claude/ merged"
else
    cp -r "$TMP_DIR/.claude" ".claude"
    echo -e "   ✅ .claude/ installed"
fi

# Copy guide.sh
echo -e "📋 ${CYAN}Installing guide.sh...${NC}"
cp "$TMP_DIR/guide.sh" "./guide.sh"
chmod +x "./guide.sh"
echo -e "   ✅ guide.sh installed"

# Copy SKILLS.md (overwrite — it's a reference doc)
echo -e "📚 ${CYAN}Installing SKILLS.md...${NC}"
cp "$TMP_DIR/SKILLS.md" "./SKILLS.md"
echo -e "   ✅ SKILLS.md installed"

# Copy AGENTS.md (overwrite)
if [ -f "$TMP_DIR/AGENTS.md" ]; then
    cp "$TMP_DIR/AGENTS.md" "./AGENTS.md"
    echo -e "   ✅ AGENTS.md installed"
fi

# Copy PROJECT_CONTEXT.md (only if it doesn't exist — don't overwrite user's context)
if [ ! -f "PROJECT_CONTEXT.md" ]; then
    cp "$TMP_DIR/PROJECT_CONTEXT.md" "./PROJECT_CONTEXT.md"
    echo -e "   ✅ PROJECT_CONTEXT.md installed (fill this in after /init-claude)"
else
    echo -e "   ℹ️  PROJECT_CONTEXT.md already exists — skipped"
fi

# Cleanup temp
rm -rf "$TMP_DIR"

# Install Ruflo (global + MCP)
echo -e "\n🧠 ${CYAN}Installing Ruflo globally (beta)...${NC}"
if ! npm install -g ruflo@latest; then
    echo -e "${YELLOW}⚠️  Global ruflo install failed. Retry later: npm install -g ruflo@latest${NC}"
fi

if command -v claude >/dev/null 2>&1; then
    echo -e "🔌 ${CYAN}Registering Ruflo MCP server with Claude Code...${NC}"
    claude mcp add ruflo -- npx ruflo@latest mcp start || \
        echo -e "${YELLOW}⚠️  Could not register ruflo MCP. Run manually: claude mcp add ruflo -- npx ruflo@latest mcp start${NC}"
else
    echo -e "${YELLOW}ℹ️  Claude Code CLI not found — skipping MCP registration.${NC}"
    echo -e "   After installing Claude Code, run: ${YELLOW}claude mcp add ruflo -- npx ruflo@latest mcp start${NC}"
fi

# Install skill packs
echo -e "\n🎨 ${CYAN}Installing skill packs...${NC}"

npx -y skills add https://github.com/Leonxlnx/taste-skill --all    || echo -e "${YELLOW}⚠️  Leonxlnx/taste-skill failed — retry: ./guide.sh skills-update${NC}"
npx -y skills add https://github.com/emilkowalski/skill --all       || echo -e "${YELLOW}⚠️  emilkowalski/skill failed — retry: ./guide.sh skills-update${NC}"
npx -y skills add https://github.com/pbakaus/impeccable --all       || echo -e "${YELLOW}⚠️  pbakaus/impeccable failed — retry: ./guide.sh skills-update${NC}"
npx -y skills add anthropics/skills@claude-api -y                  || echo -e "${YELLOW}⚠️  anthropics/claude-api failed — retry: ./guide.sh skills-update${NC}"
npx -y skills add shadcn/ui@shadcn -y                               || echo -e "${YELLOW}⚠️  shadcn/ui@shadcn failed — retry: ./guide.sh skills-update${NC}"
npx -y skills add alirezarezvani/claude-skills@a11y-audit -y        || echo -e "${YELLOW}⚠️  a11y-audit failed — retry: ./guide.sh skills-update${NC}"
npx -y skills add coreyhaines31/marketingskills --all               || echo -e "${YELLOW}⚠️  marketingskills failed — retry: ./guide.sh skills-update${NC}"
npx -y skills add addyosmani/web-quality-skills@seo -y              || echo -e "${YELLOW}⚠️  web-quality-skills@seo failed — retry: ./guide.sh skills-update${NC}"

# Done
echo -e "\n${GREEN}${BOLD}✅ DannFlow Claude tooling installed!${NC}\n"
echo -e "${BOLD}Your next 4 steps (open Claude Code):${NC}\n"
echo -e "  ${CYAN}1.${NC} Edit ${YELLOW}README.md${NC} — describe YOUR project (not DannFlow)"
echo -e "     Claude reads this to understand what you're building.\n"
echo -e "  ${CYAN}2.${NC} Run ${YELLOW}/init-claude${NC} in Claude Code"
echo -e "     Rewrites CLAUDE.md + SKILLS.md + commands to match your project.\n"
echo -e "  ${CYAN}3.${NC} Run ${YELLOW}/ruflo-upgrade${NC} in Claude Code"
echo -e "     Adds memory + parallel-agent patterns to your commands.\n"
echo -e "  ${CYAN}4.${NC} Run ${YELLOW}/no-conflict${NC} in Claude Code"
echo -e "     Verifies docs and code are in sync.\n"
echo -e "${BOLD}Then fill in ${CYAN}PROJECT_CONTEXT.md${NC} with your audience, stack decisions, and design rules.${NC}"
echo -e "Skills and commands read it before acting — no skill file editing needed.\n"
echo -e "Run ${CYAN}./guide.sh${NC} at any time for the interactive setup wizard.\n"
echo -e "Happy Vibe Coding! 🚢\n"
