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
    SELF_TMP=$(mktemp /tmp/dannflow-install-XXXX.sh)
    cat > "$SELF_TMP"
    bash "$SELF_TMP"
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

# ── 0a. Visibility mode (public fork vs private mirror) ───────────────────────
# DannFlow upstream is PUBLIC. GitHub does not allow forking a public repo as
# private, so we offer two paths:
#   public  → `gh repo fork` (real fork, Network graph link, "forked from" label)
#   private → bare-clone + mirror push to a new private repo (history preserved,
#             but no GitHub fork relationship — /sync-upstream still works)
echo ""
echo -e "${BOLD}Project visibility:${NC}"
echo -e "  ${CYAN}1)${NC} Public   ${DIM}(real fork via gh CLI — appears in DannFlow's Network graph)${NC}"
echo -e "  ${CYAN}2)${NC} Private  ${DIM}(mirror copy — no fork link, but /sync-upstream still works)${NC}"
read -p "Pick [1]: " visibility_choice < /dev/tty
visibility_choice=${visibility_choice:-1}
if [ "$visibility_choice" = "2" ] || [ "$visibility_choice" = "private" ]; then
    VISIBILITY="private"
else
    VISIBILITY="public"
fi
echo -e "${CYAN}→ Mode: ${BOLD}$VISIBILITY${NC}"

# ── 0b. Verify gh CLI is installed (required for both paths) ──────────────────
if ! command -v gh >/dev/null 2>&1; then
    echo ""
    echo -e "${RED}${BOLD}❌ GitHub CLI (gh) is required but not installed.${NC}"
    echo -e "${YELLOW}Install it first:${NC}"
    echo -e "  macOS:   ${CYAN}brew install gh${NC}"
    echo -e "  Linux:   see ${CYAN}https://github.com/cli/cli/blob/trunk/docs/install_linux.md${NC}"
    echo -e "  Windows: ${CYAN}winget install --id GitHub.cli${NC}"
    echo -e "\nThen run: ${CYAN}gh auth login${NC} and re-run this installer.\n"
    exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
    echo ""
    echo -e "${RED}${BOLD}❌ gh CLI is not authenticated.${NC}"
    echo -e "${YELLOW}Run:${NC} ${CYAN}gh auth login${NC} and re-run this installer.\n"
    exit 1
fi

echo -e "\n🚀 ${CYAN}Creating ${BOLD}$app_name${NC}${CYAN} in ${BOLD}$folder_name${NC}${CYAN} (${VISIBILITY})...${NC}"

# ── 1. Create local working copy from DannFlow ────────────────────────────────
# PUBLIC path: gh repo fork — real fork, both remotes auto-configured
# PRIVATE path: gh repo create --private + bare-clone mirror push
UPSTREAM_REPO="Danncode10/DannFlow"
UPSTREAM_URL="https://github.com/${UPSTREAM_REPO}.git"

if [ "$VISIBILITY" = "public" ]; then
    run_step "Fork DannFlow to your GitHub account and clone" \
        gh repo fork "$UPSTREAM_REPO" \
            --clone \
            --fork-name="$folder_name" \
            --remote-name=upstream
    fork_exit=$?
    if [ $fork_exit -ne 0 ]; then
        echo -e "\n${RED}${BOLD}Fatal: fork/clone failed. Cannot continue.${NC}"
        exit 1
    fi
    cd "$folder_name" || { echo -e "${RED}Cannot cd into $folder_name${NC}"; exit 1; }
else
    # PRIVATE path
    GH_USER=$(gh api user --jq .login)
    if [ -z "$GH_USER" ]; then
        echo -e "${RED}Could not resolve your GitHub username via gh CLI.${NC}"
        exit 1
    fi
    TARGET_REPO="${GH_USER}/${folder_name}"

    run_step "Create private repo ${TARGET_REPO} on GitHub" \
        gh repo create "$TARGET_REPO" --private --description "Private fork of DannFlow ($app_name)"

    # Bare-clone DannFlow and mirror-push to the new private repo
    BARE_DIR="/tmp/dannflow-bare-$$"
    run_step "Bare-clone DannFlow (preserves full history)" \
        git clone --bare "$UPSTREAM_URL" "$BARE_DIR"

    (cd "$BARE_DIR" && git push --mirror "https://github.com/${TARGET_REPO}.git")
    mirror_exit=$?
    STEP_NUM=$((STEP_NUM + 1))
    if [ $mirror_exit -eq 0 ]; then
        echo -e "  ${GREEN}✅ PASS — Mirror-push DannFlow history into ${TARGET_REPO}${NC}"
        PASS_COUNT=$((PASS_COUNT + 1))
        SUMMARY+=("${GREEN}✅${NC} [$STEP_NUM] Mirror-push DannFlow history into ${TARGET_REPO}")
    else
        echo -e "  ${RED}❌ FAIL — Mirror-push (exit $mirror_exit)${NC}"
        FAIL_COUNT=$((FAIL_COUNT + 1))
        FAILED_STEPS+=("[$STEP_NUM] Mirror-push (exit $mirror_exit)")
        SUMMARY+=("${RED}❌${NC} [$STEP_NUM] Mirror-push (exit $mirror_exit)")
        rm -rf "$BARE_DIR"
        exit 1
    fi
    rm -rf "$BARE_DIR"

    # Clone the new private repo locally as the working copy
    run_step "Clone your new private repo locally" \
        git clone "https://github.com/${TARGET_REPO}.git" "$folder_name"
    cd "$folder_name" || { echo -e "${RED}Cannot cd into $folder_name${NC}"; exit 1; }

    # Add DannFlow as upstream remote (gh fork did this automatically in public path)
    run_step "Add DannFlow as upstream remote" \
        git remote add upstream "$UPSTREAM_URL"
fi

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
# `gh repo fork` (public path) auto-configures upstream. Private path does it
# manually in step 1. This step just verifies the result so we fail loudly if
# something went wrong earlier.
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
