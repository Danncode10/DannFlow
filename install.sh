#!/bin/bash

# install.sh — DannFlow 'Elite' Installer
# Usage:  bash install.sh
#    or:  curl -sSL https://raw.githubusercontent.com/Danncode10/DannFlow/main/install.sh | bash
#
# Every step prints a clear PASS/FAIL status. A summary at the end lists
# exactly which steps succeeded, which failed, and which (if any) were skipped.

# ── Self-pipe fix ─────────────────────────────────────────────────────────────
# When run as `curl | bash`, stdin is the pipe stream. Interactive subprocesses
# (the Ruflo wizard, the skills CLI TUI) consume that stream and never finish.
# Fix: save ourselves to a temp file and re-execute with a real stdin.
if [ -z "$INSTALL_RUNNING" ]; then
    export INSTALL_RUNNING=1
    SELF_TMP=$(mktemp -t dannflow-install 2>/dev/null) || SELF_TMP="/tmp/dannflow-install-$$-$RANDOM.sh"
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

# Step tracking
STEP_NUM=0
PASS_COUNT=0
FAIL_COUNT=0
SKIP_COUNT=0
declare -a SUMMARY
declare -a FAILED_STEPS

# ── Helpers ───────────────────────────────────────────────────────────────────
# run_step "Step name" command arg1 arg2 ...
# Streams the command's output live, then prints PASS/FAIL and records it.
run_step() {
    local name="$1"
    shift
    STEP_NUM=$((STEP_NUM + 1))
    echo ""
    echo -e "${CYAN}${BOLD}[$STEP_NUM] ${name}${NC}"
    echo -e "${DIM}    \$ $*${NC}"

    "$@"
    local code=$?

    if [ $code -eq 0 ]; then
        echo -e "  ${GREEN}✅ PASS — ${name}${NC}"
        PASS_COUNT=$((PASS_COUNT + 1))
        SUMMARY+=("${GREEN}✅${NC} [$STEP_NUM] $name")
        return 0
    fi
    echo -e "  ${RED}❌ FAIL — ${name} (exit $code)${NC}"
    echo -e "  ${YELLOW}↳ See output above for the actual error.${NC}"
    FAIL_COUNT=$((FAIL_COUNT + 1))
    FAILED_STEPS+=("[$STEP_NUM] $name (exit $code)")
    SUMMARY+=("${RED}❌${NC} [$STEP_NUM] $name (exit $code)")
    return $code
}

# mark_skip "Step name" "reason"
mark_skip() {
    STEP_NUM=$((STEP_NUM + 1))
    echo ""
    echo -e "${YELLOW}${BOLD}[$STEP_NUM] ${1} — SKIPPED${NC}"
    echo -e "  ${YELLOW}↳ Reason: $2${NC}"
    SKIP_COUNT=$((SKIP_COUNT + 1))
    SUMMARY+=("${YELLOW}⏭${NC}  [$STEP_NUM] $1 (skipped: $2)")
}

# ── Banner ────────────────────────────────────────────────────────────────────
clear
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

echo -e "${BOLD}Welcome to the DannFlow 'Elite' Installer!${NC}"
echo -e "The high-performance AI-Native Next.js SaaS Starter.\n"

# ── 0. Prompt for App Name ────────────────────────────────────────────────────
read -p "Enter your App Name [My DannFlow App]: " app_name < /dev/tty
app_name=${app_name:-"My DannFlow App"}
folder_name=$(echo "$app_name" | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g' | sed 's/[^a-z0-9-]//g')

echo -e "\n🚀 ${CYAN}Creating ${BOLD}$app_name${NC}${CYAN} in ${BOLD}$folder_name${NC}${CYAN}...${NC}"

# ── 1. Clone DannFlow ─────────────────────────────────────────────────────────
UPSTREAM_URL="https://github.com/Danncode10/DannFlow.git"

run_step "Clone DannFlow repository" git clone "$UPSTREAM_URL" "$folder_name"
if [ $? -ne 0 ]; then
    echo -e "\n${RED}${BOLD}Fatal: clone failed. Cannot continue.${NC}"
    exit 1
fi
cd "$folder_name" || { echo -e "${RED}Cannot cd into $folder_name${NC}"; exit 1; }

# Add upstream remote so /sync-upstream works
git remote rename origin upstream 2>/dev/null || true

# Remove installer scripts from the new project to avoid clutter
rm -f install.sh install.ps1 install-add.sh

# ── 2. npm install ────────────────────────────────────────────────────────────
run_step "Install npm dependencies" npm install

# ── 3. .env.local ─────────────────────────────────────────────────────────────
if [ -f .env.example ]; then
    run_step "Create .env.local from .env.example" cp .env.example .env.local
else
    mark_skip "Create .env.local" ".env.example not found in repo"
fi

# ── 4. Ruflo global install ───────────────────────────────────────────────────
run_step "Install Ruflo globally (beta)" npm install -g ruflo@latest

# ── 5. Register Ruflo MCP with Claude Code ────────────────────────────────────
if command -v claude >/dev/null 2>&1; then
    if claude mcp list 2>/dev/null | grep -q ruflo; then
        mark_skip "Register Ruflo MCP server" "Already registered for this project scope"
    else
        run_step "Register Ruflo MCP server with Claude Code" \
            claude mcp add ruflo -- npx ruflo@latest mcp start
    fi
else
    mark_skip "Register Ruflo MCP server" \
        "Claude Code CLI not found on PATH — run later: claude mcp add ruflo -- npx ruflo@latest mcp start"
fi

# ── 6. Ruflo project init wizard (interactive — needs real TTY) ───────────────
echo ""
echo -e "${CYAN}${BOLD}[$((STEP_NUM + 1))] Ruflo project init wizard${NC}"
echo -e "${YELLOW}  ↳ This is interactive. Use arrow keys + Enter to select a preset.${NC}"
STEP_NUM=$((STEP_NUM + 1))
if npx ruflo@latest init wizard < /dev/tty; then
    echo -e "  ${GREEN}✅ PASS — Ruflo project init wizard${NC}"
    PASS_COUNT=$((PASS_COUNT + 1))
    SUMMARY+=("${GREEN}✅${NC} [$STEP_NUM] Ruflo project init wizard")
else
    code=$?
    echo -e "  ${RED}❌ FAIL — Ruflo init wizard (exit $code)${NC}"
    echo -e "  ${YELLOW}↳ Re-run later with: npx ruflo@latest init wizard${NC}"
    FAIL_COUNT=$((FAIL_COUNT + 1))
    FAILED_STEPS+=("[$STEP_NUM] Ruflo init wizard (exit $code)")
    SUMMARY+=("${RED}❌${NC} [$STEP_NUM] Ruflo init wizard (exit $code)")
fi

# ── 7–14. Skill packs ─────────────────────────────────────────────────────────
echo -e "\n${CYAN}${BOLD}── Installing skill packs ──${NC}"

run_step "Skill: Leonxlnx/taste-skill (design taste)" \
    npx -y skills add https://github.com/Leonxlnx/taste-skill --all -y

run_step "Skill: emilkowalski/skill (animation craft)" \
    npx -y skills add https://github.com/emilkowalski/skill --all -y

run_step "Skill: pbakaus/impeccable (UI anti-patterns)" \
    npx -y skills add https://github.com/pbakaus/impeccable --all -y

run_step "Skill: anthropics/claude-api (SDK + caching)" \
    npx -y skills add anthropics/skills@claude-api -y

run_step "Skill: shadcn/ui (component guidance)" \
    npx -y skills add shadcn/ui@shadcn -y

run_step "Skill: alirezarezvani/a11y-audit (WCAG 2.2)" \
    npx -y skills add alirezarezvani/claude-skills@a11y-audit -y

run_step "Skill: coreyhaines31/marketingskills (30+ skills)" \
    npx -y skills add coreyhaines31/marketingskills --all -y

run_step "Skill: addyosmani/web-quality-skills (SEO)" \
    npx -y skills add addyosmani/web-quality-skills@seo -y

# ── 15. guide.sh init (branding + git reset) ──────────────────────────────────
chmod +x guide.sh 2>/dev/null
run_step "Initialize project (guide.sh init)" ./guide.sh init "$app_name"

# ── 16. Verify upstream remote is configured ──────────────────────────────────
if git remote get-url upstream >/dev/null 2>&1; then
    STEP_NUM=$((STEP_NUM + 1))
    UPSTREAM_URL_CHECK=$(git remote get-url upstream)
    echo ""
    echo -e "${CYAN}${BOLD}[$STEP_NUM] Verify upstream remote${NC}"
    echo -e "  ${GREEN}✅ PASS — upstream → $UPSTREAM_URL_CHECK${NC}"
    PASS_COUNT=$((PASS_COUNT + 1))
    SUMMARY+=("${GREEN}✅${NC} [$STEP_NUM] Verify upstream remote ($UPSTREAM_URL_CHECK)")
else
    STEP_NUM=$((STEP_NUM + 1))
    echo ""
    echo -e "${CYAN}${BOLD}[$STEP_NUM] Verify upstream remote${NC}"
    echo -e "  ${RED}❌ FAIL — upstream remote is not configured${NC}"
    echo -e "  ${YELLOW}↳ Fix: git remote add upstream https://github.com/Danncode10/DannFlow.git${NC}"
    FAIL_COUNT=$((FAIL_COUNT + 1))
    FAILED_STEPS+=("[$STEP_NUM] Verify upstream remote")
    SUMMARY+=("${RED}❌${NC} [$STEP_NUM] Verify upstream remote (missing)")
fi

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
    echo -e "\n${YELLOW}Scroll up to see the actual error output for each failed step.${NC}"
    echo -e "${YELLOW}You may still continue, but expect issues until the failures are resolved.${NC}\n"
fi

# ── Next steps ────────────────────────────────────────────────────────────────
echo -e "Your project is ready in: ${CYAN}${BOLD}$folder_name${NC}\n"
echo -e "${BOLD}Next: Tailor Claude to YOUR project (do this before building)${NC}\n"
echo -e "  ${CYAN}1.${NC} ${YELLOW}cd $folder_name${NC}"
echo -e "  ${CYAN}2.${NC} Open ${YELLOW}README.md${NC} and rewrite it to describe YOUR app — not DannFlow"
echo -e "  ${CYAN}3.${NC} Open Claude Code and run ${YELLOW}/init-claude${NC}"
echo -e "     → Rewrites CLAUDE.md + SKILLS.md + commands to match your project"
echo -e "  ${CYAN}4.${NC} Fill in ${YELLOW}PROJECT_CONTEXT.md${NC} (audience, stack decisions, design rules)"
echo -e "  ${CYAN}5.${NC} Run ${YELLOW}/ruflo-upgrade${NC} → adds memory + parallel-agent patterns to commands"
echo -e "  ${CYAN}6.${NC} Run ${YELLOW}/no-conflict${NC} → verifies docs and code are in sync\n"
echo -e "Then: ${CYAN}npm run dev${NC} to start the dev server.\n"
echo -e "Run ${CYAN}./guide.sh claude${NC} at any time for the full setup wizard."
echo -e "Full setup guide: ${CYAN}docs/dannflow_docs/setup-flow.md${NC}\n"
echo -e "Happy Vibe Coding! 🚢\n"

# Exit with non-zero if anything failed (so CI / scripts can detect it)
if [ "$FAIL_COUNT" -gt 0 ]; then
    exit 1
fi
exit 0
