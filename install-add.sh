#!/bin/bash

# install-add.sh — Add DannFlow Claude tooling to an existing project
# Usage: curl -sSL https://raw.githubusercontent.com/Danncode10/DannFlow/main/install-add.sh | bash
#
# What it does:
#   - Downloads .claude/ (commands + config), guide.sh, SKILLS.md, AGENTS.md, PROJECT_CONTEXT.md
#   - Installs Ruflo globally (skips if already installed) and registers its MCP server
#   - Downloads all 8 skill packs
#   - Does NOT touch src/, package.json, .env.local, or your database

# ── Self-pipe fix ─────────────────────────────────────────────────────────────
# When run as `curl | bash`, stdin is the pipe stream. Interactive subprocesses
# (like the skills CLI TUI) consume that stream and break the rest of the script.
# Fix: save ourselves to a temp file and re-execute with a real stdin.
if [ -z "$INSTALL_ADD_RUNNING" ]; then
    export INSTALL_ADD_RUNNING=1
    SELF_TMP=$(mktemp /tmp/install-add-XXXX.sh)
    cat > "$SELF_TMP"
    bash "$SELF_TMP"
    EXIT_CODE=$?
    rm -f "$SELF_TMP"
    exit $EXIT_CODE
fi
# ─────────────────────────────────────────────────────────────────────────────

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m'

DANNFLOW_REPO="https://github.com/Danncode10/DannFlow"
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

# Plain shallow clone — no sparse/filter flags so all file contents are downloaded
if ! git clone --depth 1 "$DANNFLOW_REPO" "$TMP_DIR" 2>/dev/null; then
    echo -e "${RED}❌ Failed to clone DannFlow. Check your internet connection.${NC}"
    exit 1
fi

# ── Install .claude/ ──────────────────────────────────────────────────────────
echo -e "📁 ${CYAN}Installing .claude/ (commands + config)...${NC}"
if [ -d ".claude" ]; then
    echo -e "   ${YELLOW}Existing .claude/ found — merging (your custom files are preserved).${NC}"

    # Copy everything non-destructively first
    cp -rn "$TMP_DIR/.claude/." ".claude/" 2>/dev/null || true

    # Force-overwrite only DannFlow's own command files
    if [ -d "$TMP_DIR/.claude/commands" ]; then
        mkdir -p ".claude/commands"
        for f in "$TMP_DIR/.claude/commands/"*.md; do
            [ -f "$f" ] || continue
            cp "$f" ".claude/commands/$(basename "$f")"
        done
    fi

    # Overwrite subdirectory command packs (agents/, swarm/, memory/, etc.)
    for subdir in "$TMP_DIR/.claude/commands/"/*/; do
        [ -d "$subdir" ] || continue
        dname=$(basename "$subdir")
        mkdir -p ".claude/commands/$dname"
        cp -r "$subdir"* ".claude/commands/$dname/" 2>/dev/null || true
    done

    echo -e "   ✅ .claude/ merged"
else
    cp -r "$TMP_DIR/.claude" ".claude"
    echo -e "   ✅ .claude/ installed"
fi

# ── Other files ───────────────────────────────────────────────────────────────
echo -e "📋 ${CYAN}Installing guide.sh...${NC}"
cp "$TMP_DIR/guide.sh" "./guide.sh" && chmod +x "./guide.sh"
echo -e "   ✅ guide.sh"

echo -e "📚 ${CYAN}Installing SKILLS.md...${NC}"
cp "$TMP_DIR/SKILLS.md" "./SKILLS.md"
echo -e "   ✅ SKILLS.md"

[ -f "$TMP_DIR/AGENTS.md" ] && cp "$TMP_DIR/AGENTS.md" "./AGENTS.md" && echo -e "   ✅ AGENTS.md"

if [ ! -f "PROJECT_CONTEXT.md" ]; then
    cp "$TMP_DIR/PROJECT_CONTEXT.md" "./PROJECT_CONTEXT.md"
    echo -e "   ✅ PROJECT_CONTEXT.md (fill this in after /init-claude)"
else
    echo -e "   ℹ️  PROJECT_CONTEXT.md already exists — skipped"
fi

# Cleanup temp clone
rm -rf "$TMP_DIR"

# ── Ruflo — install only if not already installed ─────────────────────────────
echo -e "\n🧠 ${CYAN}Checking Ruflo...${NC}"
if npm list -g ruflo 2>/dev/null | grep -q ruflo; then
    echo -e "   ℹ️  Ruflo already installed globally — skipping npm install"
else
    echo -e "   Installing Ruflo globally (beta)..."
    if ! npm install -g ruflo@latest; then
        echo -e "${YELLOW}⚠️  Global ruflo install failed. Retry: npm install -g ruflo@latest${NC}"
    else
        echo -e "   ✅ Ruflo installed"
    fi
fi

# Register MCP only if not already registered
if command -v claude >/dev/null 2>&1; then
    if claude mcp list 2>/dev/null | grep -q ruflo; then
        echo -e "   ℹ️  Ruflo MCP already registered — skipping"
    else
        echo -e "   🔌 Registering Ruflo MCP server..."
        claude mcp add ruflo -- npx ruflo@latest mcp start || \
            echo -e "${YELLOW}⚠️  Could not register MCP. Run: claude mcp add ruflo -- npx ruflo@latest mcp start${NC}"
        echo -e "   ✅ Ruflo MCP registered"
    fi
else
    echo -e "   ${YELLOW}ℹ️  Claude Code CLI not found — skipping MCP registration.${NC}"
    echo -e "   After installing Claude Code: ${YELLOW}claude mcp add ruflo -- npx ruflo@latest mcp start${NC}"
fi

# ── Skill packs ───────────────────────────────────────────────────────────────
echo -e "\n🎨 ${CYAN}Installing skill packs (this may take a minute)...${NC}"

install_skill() {
    local label="$1"
    local cmd="$2"
    echo -e "   → ${label}"
    if eval "$cmd" < /dev/null > /dev/null 2>&1; then
        echo -e "   ✅ ${label}"
    else
        echo -e "   ${YELLOW}⚠️  ${label} failed — retry: ./guide.sh skills-update${NC}"
    fi
}

install_skill "Leonxlnx/taste-skill (design taste)"         "npx -y skills add https://github.com/Leonxlnx/taste-skill --all -y"
install_skill "emilkowalski/skill (animation craft)"         "npx -y skills add https://github.com/emilkowalski/skill --all -y"
install_skill "pbakaus/impeccable (UI anti-patterns)"        "npx -y skills add https://github.com/pbakaus/impeccable --all -y"
install_skill "anthropics/claude-api (SDK + caching)"        "npx -y skills add anthropics/skills@claude-api -y"
install_skill "shadcn/ui (component guidance)"               "npx -y skills add shadcn/ui@shadcn -y"
install_skill "alirezarezvani/a11y-audit (WCAG 2.2)"         "npx -y skills add alirezarezvani/claude-skills@a11y-audit -y"
install_skill "coreyhaines31/marketingskills (30+ skills)"   "npx -y skills add coreyhaines31/marketingskills --all -y"
install_skill "addyosmani/web-quality-skills (SEO)"          "npx -y skills add addyosmani/web-quality-skills@seo -y"

# ── Done ──────────────────────────────────────────────────────────────────────
echo -e "\n${GREEN}${BOLD}✅ DannFlow Claude tooling installed!${NC}\n"
echo -e "${BOLD}Your next steps (open Claude Code):${NC}\n"
echo -e "  ${CYAN}1.${NC} Edit ${YELLOW}README.md${NC} — describe YOUR project (not DannFlow)"
echo -e "     Claude reads this to understand what you're building.\n"
echo -e "  ${CYAN}2.${NC} Run ${YELLOW}/init-claude${NC}"
echo -e "     Rewrites CLAUDE.md + SKILLS.md + commands to match your project.\n"
echo -e "  ${CYAN}3.${NC} Fill in ${YELLOW}PROJECT_CONTEXT.md${NC}"
echo -e "     Add audience, stack decisions, design rules, anti-decisions.\n"
echo -e "  ${CYAN}4.${NC} Run ${YELLOW}/ruflo-upgrade${NC}"
echo -e "     Adds memory + parallel-agent patterns to your commands.\n"
echo -e "  ${CYAN}5.${NC} Run ${YELLOW}/no-conflict${NC}"
echo -e "     Verifies docs and code are in sync.\n"
echo -e "Run ${CYAN}./guide.sh${NC} at any time for the interactive setup wizard.\n"
echo -e "Happy Vibe Coding! 🚢\n"
