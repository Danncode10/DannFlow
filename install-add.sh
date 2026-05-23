#!/bin/bash

# install-add.sh — Add DannFlow Claude tooling to an existing project
# Usage: curl -sSL https://raw.githubusercontent.com/Danncode10/DannFlow/main/install-add.sh | bash
#
# Every step prints a clear PASS/FAIL status. A summary at the end lists
# exactly which steps succeeded, which failed, and which (if any) were skipped.
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
    SELF_TMP=$(mktemp -t dannflow-install-add 2>/dev/null) || SELF_TMP="/tmp/dannflow-install-add-$$-$RANDOM.sh"
    cat > "$SELF_TMP"
    bash "$SELF_TMP" < /dev/tty
    EXIT_CODE=$?
    rm -f "$SELF_TMP"
    exit $EXIT_CODE
fi
# ─────────────────────────────────────────────────────────────────────────────

# Colors
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

DANNFLOW_REPO="https://github.com/Danncode10/DannFlow"
TMP_DIR="/tmp/dannflow-add-$$"

# Step tracking
STEP_NUM=0
PASS_COUNT=0
FAIL_COUNT=0
SKIP_COUNT=0
declare -a SUMMARY
declare -a FAILED_STEPS

mark_pass() {
    STEP_NUM=$((STEP_NUM + 1))
    echo -e "  ${GREEN}✅ PASS — $1${NC}"
    PASS_COUNT=$((PASS_COUNT + 1))
    SUMMARY+=("${GREEN}✅${NC} [$STEP_NUM] $1")
}

mark_fail() {
    STEP_NUM=$((STEP_NUM + 1))
    local code="${2:-1}"
    echo -e "  ${RED}❌ FAIL — $1 (exit $code)${NC}"
    [ -n "$3" ] && echo -e "  ${YELLOW}↳ $3${NC}"
    FAIL_COUNT=$((FAIL_COUNT + 1))
    FAILED_STEPS+=("[$STEP_NUM] $1 (exit $code)")
    SUMMARY+=("${RED}❌${NC} [$STEP_NUM] $1 (exit $code)")
}

mark_skip() {
    STEP_NUM=$((STEP_NUM + 1))
    echo -e "  ${YELLOW}⏭  SKIP — $1${NC}"
    echo -e "  ${YELLOW}↳ Reason: $2${NC}"
    SKIP_COUNT=$((SKIP_COUNT + 1))
    SUMMARY+=("${YELLOW}⏭${NC}  [$STEP_NUM] $1 (skipped: $2)")
}

# run_step runs a command, streams its output, and records PASS/FAIL.
run_step() {
    local name="$1"
    shift
    echo ""
    echo -e "${CYAN}${BOLD}▶ ${name}${NC}"
    echo -e "${DIM}    \$ $*${NC}"
    if "$@"; then
        mark_pass "$name"
        return 0
    fi
    local code=$?
    mark_fail "$name" "$code" "See output above for the actual error."
    return $code
}

# ── Banner ────────────────────────────────────────────────────────────────────
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

echo -e "This will add DannFlow Claude tooling to: ${CYAN}$(pwd)${NC}"
read -p "Proceed? (y/n) [y]: " confirm < /dev/tty
confirm=${confirm:-y}
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
    echo -e "\n${YELLOW}Cancelled.${NC}"
    exit 0
fi

# ── 1. Clone DannFlow into temp dir ───────────────────────────────────────────
echo ""
echo -e "${CYAN}${BOLD}▶ Fetching DannFlow files${NC}"
if git clone --depth 1 "$DANNFLOW_REPO" "$TMP_DIR"; then
    mark_pass "Clone DannFlow into temp dir"
else
    mark_fail "Clone DannFlow into temp dir" "$?" "Check your internet connection."
    echo -e "\n${RED}${BOLD}Fatal: cannot continue without source files.${NC}"
    exit 1
fi

# ── 2. Install .claude/ ───────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}${BOLD}▶ Install .claude/ (commands + config)${NC}"
if [ -d ".claude" ]; then
    echo -e "  ${YELLOW}Existing .claude/ found — merging (your custom files are preserved).${NC}"
    cp -rn "$TMP_DIR/.claude/." ".claude/" 2>/dev/null || true
    if [ -d "$TMP_DIR/.claude/commands" ]; then
        mkdir -p ".claude/commands"
        for f in "$TMP_DIR/.claude/commands/"*.md; do
            [ -f "$f" ] || continue
            cp "$f" ".claude/commands/$(basename "$f")"
        done
    fi
    for subdir in "$TMP_DIR/.claude/commands/"/*/; do
        [ -d "$subdir" ] || continue
        dname=$(basename "$subdir")
        mkdir -p ".claude/commands/$dname"
        cp -r "$subdir"* ".claude/commands/$dname/" 2>/dev/null || true
    done
    mark_pass ".claude/ merged into existing project"
else
    if cp -r "$TMP_DIR/.claude" ".claude"; then
        mark_pass ".claude/ installed"
    else
        mark_fail ".claude/ install" "$?"
    fi
fi

# ── 3. guide.sh ───────────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}${BOLD}▶ Install guide.sh${NC}"
if cp "$TMP_DIR/guide.sh" "./guide.sh" && chmod +x "./guide.sh"; then
    mark_pass "guide.sh installed and made executable"
else
    mark_fail "Install guide.sh" "$?"
fi

# ── 4. SKILLS.md ──────────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}${BOLD}▶ Install SKILLS.md${NC}"
if cp "$TMP_DIR/SKILLS.md" "./SKILLS.md"; then
    mark_pass "SKILLS.md installed"
else
    mark_fail "Install SKILLS.md" "$?"
fi

# ── 5. AGENTS.md ──────────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}${BOLD}▶ Install AGENTS.md${NC}"
if [ -f "$TMP_DIR/AGENTS.md" ]; then
    if cp "$TMP_DIR/AGENTS.md" "./AGENTS.md"; then
        mark_pass "AGENTS.md installed"
    else
        mark_fail "Install AGENTS.md" "$?"
    fi
else
    mark_skip "Install AGENTS.md" "Source file not present in upstream repo"
fi

# ── 6. PROJECT_CONTEXT.md ─────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}${BOLD}▶ Install PROJECT_CONTEXT.md${NC}"
if [ ! -f "PROJECT_CONTEXT.md" ]; then
    if cp "$TMP_DIR/PROJECT_CONTEXT.md" "./PROJECT_CONTEXT.md"; then
        mark_pass "PROJECT_CONTEXT.md installed (fill it in after /init-claude)"
    else
        mark_fail "Install PROJECT_CONTEXT.md" "$?"
    fi
else
    mark_skip "Install PROJECT_CONTEXT.md" "Already exists — kept your version"
fi

rm -rf "$TMP_DIR"

# ── 7. Ruflo global install ───────────────────────────────────────────────────
echo ""
echo -e "${CYAN}${BOLD}▶ Install Ruflo globally${NC}"
if npm list -g ruflo 2>/dev/null | grep -q ruflo; then
    mark_skip "Install Ruflo globally" "Already installed globally"
else
    if npm install -g ruflo@latest; then
        mark_pass "Ruflo installed globally"
    else
        mark_fail "Install Ruflo globally" "$?" "Retry: npm install -g ruflo@latest"
    fi
fi

# ── 8. Register Ruflo MCP ─────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}${BOLD}▶ Register Ruflo MCP with Claude Code${NC}"
if command -v claude >/dev/null 2>&1; then
    if claude mcp list 2>/dev/null | grep -q ruflo; then
        mark_skip "Register Ruflo MCP" "Already registered"
    else
        if claude mcp add ruflo -- npx ruflo@latest mcp start; then
            mark_pass "Ruflo MCP registered"
        else
            mark_fail "Register Ruflo MCP" "$?" "Retry: claude mcp add ruflo -- npx ruflo@latest mcp start"
        fi
    fi
else
    mark_skip "Register Ruflo MCP" \
        "Claude Code CLI not found — run later: claude mcp add ruflo -- npx ruflo@latest mcp start"
fi

# ── 9–16. Skill packs ─────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}${BOLD}── Installing skill packs (this may take a minute) ──${NC}"

# install_skill prints actual output (no silent muting) so you can see errors.
install_skill() {
    local label="$1"
    shift
    echo ""
    echo -e "${CYAN}${BOLD}▶ ${label}${NC}"
    echo -e "${DIM}    \$ $*${NC}"
    if "$@" < /dev/null; then
        mark_pass "$label"
    else
        mark_fail "$label" "$?" "Retry with: ./guide.sh skills-update"
    fi
}

install_skill "Skill: Leonxlnx/taste-skill (design taste)" \
    npx -y skills add https://github.com/Leonxlnx/taste-skill --all -y

install_skill "Skill: emilkowalski/skill (animation craft)" \
    npx -y skills add https://github.com/emilkowalski/skill --all -y

install_skill "Skill: pbakaus/impeccable (UI anti-patterns)" \
    npx -y skills add https://github.com/pbakaus/impeccable --all -y

install_skill "Skill: anthropics/claude-api (SDK + caching)" \
    npx -y skills add anthropics/skills@claude-api -y

install_skill "Skill: shadcn/ui (component guidance)" \
    npx -y skills add shadcn/ui@shadcn -y

install_skill "Skill: alirezarezvani/a11y-audit (WCAG 2.2)" \
    npx -y skills add alirezarezvani/claude-skills@a11y-audit -y

install_skill "Skill: coreyhaines31/marketingskills (30+ skills)" \
    npx -y skills add coreyhaines31/marketingskills --all -y

install_skill "Skill: addyosmani/web-quality-skills (SEO)" \
    npx -y skills add addyosmani/web-quality-skills@seo -y

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}═══════════════════ Installation Summary ═══════════════════${NC}"
for item in "${SUMMARY[@]}"; do
    echo -e "  $item"
done
echo -e "${BOLD}─────────────────────────────────────────────────────────────${NC}"
echo -e "  ${GREEN}Passed:${NC}  $PASS_COUNT"
echo -e "  ${RED}Failed:${NC}  $FAIL_COUNT"
echo -e "  ${YELLOW}Skipped:${NC} $SKIP_COUNT"
echo -e "  ${BOLD}Total:${NC}   $STEP_NUM"
echo -e "${BOLD}═════════════════════════════════════════════════════════════${NC}\n"

if [ "$FAIL_COUNT" -eq 0 ] && [ "$SKIP_COUNT" -eq 0 ]; then
    echo -e "${GREEN}${BOLD}🎉 All $STEP_NUM steps completed successfully — no failures, no skips.${NC}\n"
elif [ "$FAIL_COUNT" -eq 0 ]; then
    echo -e "${GREEN}${BOLD}✅ All required steps passed.${NC} ${YELLOW}($SKIP_COUNT optional step(s) skipped — see above.)${NC}\n"
else
    echo -e "${RED}${BOLD}⚠️  $FAIL_COUNT step(s) failed:${NC}"
    for s in "${FAILED_STEPS[@]}"; do
        echo -e "   ${RED}•${NC} $s"
    done
    echo -e "\n${YELLOW}Scroll up to see the actual error output for each failed step.${NC}\n"
fi

# ── Next steps ────────────────────────────────────────────────────────────────
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

if [ "$FAIL_COUNT" -gt 0 ]; then
    exit 1
fi
exit 0
