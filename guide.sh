#!/bin/bash

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# ASCII Art Header
show_header() {
    clear
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
    echo -e "${CYAN}The AI-Native Next.js SaaS Starter for Vibe Coding${NC}\n"
}

# Run a step by index (0-based)
run_step() {
    case "$1" in
        0) show_supabase ;;
        1) show_env ;;
        2) show_vibe ;;
        3) show_security ;;
        4) show_ui ;;
        5) show_ready ;;
        6) show_deploy ;;
    esac
}

# Interactive Main Menu
show_main() {
    local labels=(
        "Step 1: Create Supabase project, Auth, and SMTP"
        "Step 2: Set up environment variables (.env.local)"
        "Step 3: Connect AI Agents (MCPs/Cursor/Antigravity)"
        "Step 4: Setup Gmail security notifications"
        "Step 5: Customize your brand theme & colors"
        "Step 6: Final checklist & rebrand (resets Git history)"
        "Step 7: Deploy to Vercel (Production)"
    )
    local count=${#labels[@]}
    local selected=0

    while true; do
        show_header
        echo -e "${BOLD}Getting Started Guide${NC}"
        echo -e "Use ${CYAN}↑ ↓${NC} to navigate  ${GREEN}Enter${NC} to open  ${YELLOW}q${NC} to quit\n"

        for i in "${!labels[@]}"; do
            if [ "$i" -eq "$selected" ]; then
                echo -e "  ${GREEN}${BOLD}› ${labels[$i]}${NC}"
            else
                echo -e "    ${labels[$i]}"
            fi
        done

        echo ""
        echo -e "Other helpful commands:"
        echo -e "  ${CYAN}npm run dev${NC}          - Start development server"
        echo -e "  ${CYAN}npm run update-types${NC} - Sync TypeScript types with Supabase"
        echo -e "  ${CYAN}npm run checkpoint${NC}   - Take a DB schema snapshot (SQL)"

        # Read keypress
        IFS= read -rsn1 key < /dev/tty
        if [[ "$key" == $'\x1b' ]]; then
            read -rsn2 key < /dev/tty
            case "$key" in
                '[A') # Up arrow
                    ((selected--))
                    [ "$selected" -lt 0 ] && selected=$((count - 1))
                    ;;
                '[B') # Down arrow
                    ((selected++))
                    [ "$selected" -ge "$count" ] && selected=0
                    ;;
            esac
        elif [[ "$key" == '' ]]; then # Enter
            run_step "$selected"
        elif [[ "$key" == 'q' || "$key" == 'Q' ]]; then
            clear
            break
        fi
    done
}

# Env Command
show_env() {
    show_header
    echo -e "${BOLD}🌍 Environment Configuration${NC}\n"
    echo -e "Your ${CYAN}.env.local${NC} file holds your secrets. It is ignored by Git to"
    echo -e "keep your credentials safe. Never share this file.\n"
    
    echo -e "${BOLD}1. Initialize File${NC}"
    echo -e "   Run: ${CYAN}cp .env.example .env.local${NC}\n"
    
    echo -e "${BOLD}2. Database Credentials${NC}"
    echo -e "   Find these in ${YELLOW}Supabase > Project Settings > Data API${NC}:"
    echo -e "   - ${CYAN}NEXT_PUBLIC_SUPABASE_URL${NC}       (The API endpoint)"
    echo -e "   - ${CYAN}NEXT_PUBLIC_SUPABASE_ANON_KEY${NC}  (Client-side key)"
    echo -e "   - ${CYAN}SUPABASE_SERVICE_ROLE_KEY${NC}      (Admin key - KEEP SECRET)\n"
    
    echo -e "${BOLD}3. Site Branding & SEO${NC}"
    echo -e "   - ${CYAN}NEXT_PUBLIC_SITE_NAME${NC}: Your app's display name."
    echo -e "   - ${CYAN}NEXT_PUBLIC_SITE_URL${NC}: Set to ${YELLOW}http://localhost:3000${NC} for now."
    echo -e "   - ${CYAN}NEXT_PUBLIC_GITHUB_URL${NC}: Link to your main repository.\n"
    
    echo -e "${BOLD}4. Rate Limiting (Upstash Redis)${NC}"
    echo -e "   Required for server-side protection. Get these from ${CYAN}console.upstash.com${NC}:"
    echo -e "   - ${CYAN}UPSTASH_REDIS_REST_URL${NC}"
    echo -e "   - ${CYAN}UPSTASH_REDIS_REST_TOKEN${NC}\n"

    echo -e "📖 See ${BLUE}docs/dannflow_docs/production-features.md${NC} for more details on env vars."
    step_footer
}

# Supabase Command
show_supabase() {
    show_header
    echo -e "${BOLD}⚡ Supabase Setup${NC}\n"

    # Auto-create .env.local if missing
    if [ ! -f .env.local ]; then
        echo -e "${YELLOW}⚠️  .env.local not found.${NC}\n"
        ask_yes_no "Create .env.local from .env.example now?"
        if [ "$?" -eq 0 ]; then
            if [ -f .env.example ]; then
                cp .env.example .env.local
                echo -e "  ✅ ${GREEN}.env.local created.${NC} Open it and fill in your credentials as you go.\n"
            else
                echo -e "  ${RED}❌ .env.example not found. Check your project files.${NC}\n"
            fi
        else
            echo -e "  ${YELLOW}Skipped. You can run: ${CYAN}cp .env.example .env.local${NC} anytime.\n"
        fi
    else
        echo -e "  ✅ ${GREEN}.env.local already exists.${NC}\n"
    fi

    echo -e "${BOLD}1. Project Creation${NC}"
    echo -e "   - Go to ${CYAN}supabase.com/dashboard${NC} and click ${YELLOW}New Project${NC}."
    echo -e "   - Set your ${YELLOW}Project Name${NC} and a secure ${YELLOW}Database Password${NC}. Save the password!"
    echo -e "   - ${RED}${BOLD}WARNING (Free Tier):${NC} Supabase allows only ${BOLD}2 active projects${NC}."
    echo -e "     If you already have 2, ${YELLOW}pause or delete${NC} one first.\n"

    echo -e "${BOLD}2. Get Your Credentials${NC}"
    echo -e "   Go to ${CYAN}Project Settings > Data API${NC}:"
    echo -e "   - Copy ${CYAN}NEXT_PUBLIC_SUPABASE_URL${NC}      → your API endpoint"
    echo -e "   - Copy ${CYAN}NEXT_PUBLIC_SUPABASE_ANON_KEY${NC} → client-side key"
    echo -e "   - Copy ${CYAN}SUPABASE_SERVICE_ROLE_KEY${NC}     → admin key (keep secret)"
    echo -e "   Paste these into your ${CYAN}.env.local${NC} file (Step 2).\n"

    echo -e "${BOLD}3. URL Configuration${NC}"
    echo -e "   Go to ${CYAN}Authentication > URL Configuration${NC}:"
    echo -e "   - ${BOLD}Site URL${NC}:      Set to your live production domain (or localhost for now)."
    echo -e "   - ${BOLD}Redirect URLs${NC}: Add ${YELLOW}http://localhost:3000/**${NC}"
    echo -e "   - ${BOLD}Redirect URLs${NC}: Add ${YELLOW}https://yourdomain.com/**${NC} (after deploy)\n"

    echo -e "${BOLD}4. AI Orchestration — Apply Schema (Vibe Coding)${NC}"
    echo -e "   Once your Supabase MCP is connected (Step 3), paste this to your AI:\n"
    echo -e "   ${CYAN}\"I've created a new Supabase project. Ask me for the Project"
    echo -e "   Reference ID. Once provided:"
    echo -e "   1. Connect to the project via Supabase MCP."
    echo -e "   2. Find the latest .sql file in supabase/backups/ and apply it."
    echo -e "   3. MANDATORY: list all tables and functions in the public schema."
    echo -e "   4. Confirm the 'profiles' table and 'handle_new_user' function exist."
    echo -e "   Do not report success until you can see them in the live DB.\"${NC}\n"

    echo -e "💡 Gmail SMTP setup is in ${CYAN}Step 4 → ./guide.sh security${NC}"
    echo -e "📖 Full walkthrough: ${BLUE}docs/dannflow_docs/production-features.md${NC}"
    step_footer
}

# Yes/No selector — returns 0 for Yes, 1 for No
ask_yes_no() {
    local question="$1"
    local selected=0
    while true; do
        printf "\n  ${BOLD}%s${NC}\n" "$question"
        if [ "$selected" -eq 0 ]; then
            printf "    ${GREEN}${BOLD}› Yes${NC}\n      No\n"
        else
            printf "      Yes\n    ${GREEN}${BOLD}› No${NC}\n"
        fi
        IFS= read -rsn1 key < /dev/tty
        if [[ "$key" == $'\x1b' ]]; then
            read -rsn2 key < /dev/tty
            [[ "$key" == '[A' || "$key" == '[B' ]] && ((selected = 1 - selected))
        elif [[ "$key" == '' ]]; then
            printf "\033[4A\033[0J"
            if [ "$selected" -eq 0 ]; then
                echo -e "  ${BOLD}$question${NC} → ${GREEN}Yes${NC}\n"
            else
                echo -e "  ${BOLD}$question${NC} → ${YELLOW}No${NC}\n"
            fi
            return $selected
        fi
        printf "\033[4A\033[0J"
    done
}

# Step footer — press g to return to menu, q to quit
step_footer() {
    echo -e "${CYAN}────────────────────────────────────────${NC}"
    echo -e "  ${YELLOW}g${NC} → Back to menu   ${YELLOW}q${NC} → Quit"
    IFS= read -rsn1 key < /dev/tty
    if [[ "$key" == 'g' || "$key" == 'G' ]]; then
        show_main
    elif [[ "$key" == 'q' || "$key" == 'Q' ]]; then
        clear
        exit 0
    fi
}

# Vibe Command
show_vibe() {
    local vibe_options=("Setup MCPs (run wizard)" "View setup instructions")
    local vibe_selected=0

    while true; do
        show_header
        echo -e "${BOLD}🤖 Step 3 — Connect AI Agents${NC}\n"
        echo -e "MCPs give your AI live access to your database and GitHub."
        echo -e "Without them, your AI is guessing. With them, it ${GREEN}knows${NC}.\n"
        echo -e "Use ${CYAN}↑ ↓${NC} to navigate  ${GREEN}Enter${NC} to select  ${YELLOW}g${NC} → menu  ${YELLOW}q${NC} → quit\n"

        for i in "${!vibe_options[@]}"; do
            if [ "$i" -eq "$vibe_selected" ]; then
                echo -e "  ${GREEN}${BOLD}› ${vibe_options[$i]}${NC}"
            else
                echo -e "    ${vibe_options[$i]}"
            fi
        done

        IFS= read -rsn1 key < /dev/tty
        if [[ "$key" == $'\x1b' ]]; then
            read -rsn2 key < /dev/tty
            case "$key" in
                '[A') ((vibe_selected--)); [ "$vibe_selected" -lt 0 ] && vibe_selected=1 ;;
                '[B') ((vibe_selected++)); [ "$vibe_selected" -gt 1 ] && vibe_selected=0 ;;
            esac
        elif [[ "$key" == '' ]]; then
            break
        elif [[ "$key" == 'g' || "$key" == 'G' ]]; then
            show_main; return
        elif [[ "$key" == 'q' || "$key" == 'Q' ]]; then
            clear; exit 0
        fi
    done

    # Option 1: Instructions only
    if [ "$vibe_selected" -eq 1 ]; then
        show_header
        echo -e "${BOLD}🤖 MCP Setup Instructions${NC}\n"
        echo -e "${BOLD}What you need:${NC}"
        echo -e "  ${YELLOW}Supabase token${NC}  → supabase.com → Account (top right) → Access Tokens → Generate"
        echo -e "  ${YELLOW}GitHub token${NC}    → github.com/settings/tokens → Generate new token (classic)"
        echo -e "              Scopes: ${CYAN}repo${NC}, ${CYAN}read:org${NC}\n"
        echo -e "${BOLD}Antigravity:${NC}"
        echo -e "  Chats → MCP Servers → Manage MCP Servers → View Raw Config → paste ${CYAN}mcpServers${NC} block\n"
        echo -e "${BOLD}Claude Code:${NC}"
        echo -e "  Run: ${CYAN}claude mcp add-json supabase-mcp-server --scope user '{...}'${NC}"
        echo -e "  ${CYAN}--scope user${NC} = applies to all your projects globally\n"
        echo -e "${BOLD}MCP Management:${NC}"
        echo -e "  ${CYAN}claude mcp list${NC}                        — list all MCPs + status"
        echo -e "  ${CYAN}claude mcp remove supabase-mcp-server${NC}  — remove Supabase MCP"
        echo -e "  ${CYAN}claude mcp remove github-mcp-server${NC}    — remove GitHub MCP\n"
        echo -e "Run ${CYAN}./guide.sh 3${NC} and select ${GREEN}Setup MCPs${NC} to configure automatically."
        step_footer
        return
    fi

    # Option 0: Wizard
    show_header
    echo -e "${BOLD}🤖 MCP Setup Wizard${NC}\n"
    echo -e "${BOLD}Step 1 — Get your tokens before continuing${NC}"
    echo -e "  ${YELLOW}Supabase${NC} → supabase.com → Account (top right) → Access Tokens → Generate new token"
    echo -e "  ${YELLOW}GitHub${NC}   → github.com/settings/tokens → Generate new token (classic)"
    echo -e "           Scopes needed: ${CYAN}repo${NC}, ${CYAN}read:org${NC}\n"

    read -p "  Paste your Supabase Access Token: " supabase_token < /dev/tty
    echo ""
    read -p "  Paste your GitHub Personal Access Token: " github_token < /dev/tty
    echo ""

    if [ -z "$supabase_token" ] || [ -z "$github_token" ]; then
        echo -e "${RED}❌ Both tokens are required. Run ./guide.sh 3 again when ready.${NC}"
        return
    fi

    # Optional: limit Supabase MCP to one project
    project_ref_flag=""
    ask_yes_no "Limit Supabase AI access to this project only? (Recommended)"
    if [ "$?" -eq 0 ]; then
        echo -e "  ${YELLOW}Find your Project Ref:${NC} Supabase Dashboard → Project Settings → General → Reference ID"
        read -p "  Paste your Project Reference ID: " project_ref < /dev/tty
        echo ""
        if [ -n "$project_ref" ]; then
            project_ref_flag="--project-ref $project_ref"
            echo -e "  ✅ ${GREEN}Supabase MCP will only access project: ${CYAN}$project_ref${NC}\n"
        else
            echo -e "  ${YELLOW}⚠️  Skipped — AI will have access to all your Supabase projects.${NC}\n"
        fi
    else
        echo -e "  ${YELLOW}⚠️  AI will have access to ALL your Supabase projects.${NC}\n"
    fi

    # Detect node/npx paths
    node_path=$(which node 2>/dev/null || echo "/opt/homebrew/bin/node")
    npx_path=$(which npx 2>/dev/null || echo "/opt/homebrew/bin/npx")

    ask_yes_no "Are you using Antigravity?"
    use_antigravity=$?

    ask_yes_no "Are you using Claude Code?"
    use_claude=$?

    if [ "$use_antigravity" -eq 1 ] && [ "$use_claude" -eq 1 ]; then
        echo -e "${YELLOW}⚠️  No tools selected. Run ./guide.sh 3 again and select at least one.${NC}"
        return
    fi

    # Build Supabase args array (with optional --project-ref)
    supabase_args_json="\"$npx_path\",\"-y\",\"@supabase/mcp-server-supabase@latest\",\"--access-token\",\"$supabase_token\""
    supabase_args_sh=("$npx_path" "-y" "@supabase/mcp-server-supabase@latest" "--access-token" "$supabase_token")
    if [ -n "$project_ref" ]; then
        supabase_args_json+=",\"--project-ref\",\"$project_ref\""
        supabase_args_sh+=("--project-ref" "$project_ref")
    fi

    echo -e "${BOLD}Configuring your tools...${NC}\n"

    # --- Antigravity ---
    if [ "$use_antigravity" -eq 0 ]; then
        supabase_args_formatted=$(printf '        "%s"' "${supabase_args_sh[@]}" | sed 's/""$//' | tr '\0' '\n')
        args_block=""
        for arg in "${supabase_args_sh[@]}"; do
            args_block+="        \"$arg\","$'\n'
        done
        args_block="${args_block%,$'\n'}"

        cat > mcp.json << MCPEOF
{
  "_readme": "Antigravity: Chats → MCP Servers → Manage MCP Servers → View Raw Config → paste the mcpServers block below",
  "mcpServers": {
    "supabase-mcp-server": {
      "command": "$node_path",
      "args": [
$args_block
      ],
      "env": {
        "PATH": "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
      }
    },
    "github-mcp-server": {
      "command": "$node_path",
      "args": [
        "$npx_path",
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "$github_token",
        "PATH": "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
      }
    }
  }
}
MCPEOF
        echo -e "  ✅ ${GREEN}mcp.json created with your tokens${NC}"
        echo -e "     ${BOLD}Next:${NC} Antigravity → Chats → MCP Servers → Manage MCP Servers → View Raw Config"
        echo -e "     Paste the ${CYAN}mcpServers${NC} block from ${CYAN}mcp.json${NC}\n"
    fi

    # --- Claude Code ---
    if [ "$use_claude" -eq 0 ]; then
        if ! command -v claude &>/dev/null; then
            echo -e "  ${RED}❌ 'claude' CLI not found.${NC} Install it from ${CYAN}claude.ai/code${NC} first.\n"
        else
            supabase_json="{\"command\":\"$node_path\",\"args\":[$supabase_args_json],\"env\":{\"PATH\":\"/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin\"}}"
            github_json="{\"command\":\"$node_path\",\"args\":[\"$npx_path\",\"-y\",\"@modelcontextprotocol/server-github\"],\"env\":{\"GITHUB_PERSONAL_ACCESS_TOKEN\":\"$github_token\",\"PATH\":\"/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin\"}}"

            if claude mcp add-json supabase-mcp-server --scope user "$supabase_json" 2>/dev/null; then
                echo -e "  ✅ ${GREEN}Supabase MCP added to Claude Code${NC}"
            else
                echo -e "  ${RED}❌ Failed to add Supabase MCP to Claude Code${NC}"
            fi

            if claude mcp add-json github-mcp-server --scope user "$github_json" 2>/dev/null; then
                echo -e "  ✅ ${GREEN}GitHub MCP added to Claude Code${NC}"
            else
                echo -e "  ${RED}❌ Failed to add GitHub MCP to Claude Code${NC}"
            fi

            echo ""
            echo -e "  ${BOLD}Verify:${NC} ${CYAN}claude mcp list${NC}"
            echo -e "  Both servers should show ${GREEN}✓ Connected${NC}."
            echo -e "  If not, re-run ${CYAN}./guide.sh 3${NC} and check your tokens.\n"
        fi
    fi

    echo -e "${BOLD}MCP Management Commands:${NC}"
    echo -e "  ${CYAN}claude mcp list${NC}                        — see all connected MCPs + status"
    echo -e "  ${CYAN}claude mcp remove supabase-mcp-server${NC}  — remove Supabase MCP"
    echo -e "  ${CYAN}claude mcp remove github-mcp-server${NC}    — remove GitHub MCP"
    echo -e "  ${CYAN}./guide.sh 3${NC}                           — re-run this wizard to reconfigure\n"

    echo -e "${BOLD}Verify your setup — paste this to your AI:${NC}\n"
    echo -e "  ${CYAN}\"Vibe Check: List all tables in my Supabase public schema,"
    echo -e "  check my current Git branch, and confirm the supabase/backups/"
    echo -e "  folder exists. Report what you find for each.\"${NC}\n"
    echo -e "${BOLD}Always start sessions with:${NC}"
    echo -e "  ${CYAN}\"Read AGENTS.md before doing anything.\"${NC}\n"
    echo -e "${BOLD}Automation commands:${NC}"
    echo -e "  ${GREEN}npm run update-types${NC}  — Syncs src/types/supabase.ts with live DB schema"
    echo -e "  ${GREEN}npm run checkpoint${NC}    — Snapshots DB schema to supabase/backups/\n"
    echo -e "📖 ${BLUE}docs/dannflow_docs/mcp-setup.md${NC}"
    step_footer
}

# Security — test account signup via Supabase API
test_auth_account() {
    show_header
    echo -e "${BOLD}🧪 Test Account — Signup via Terminal${NC}\n"

    # Load .env.local
    if [ ! -f .env.local ]; then
        echo -e "${RED}❌ .env.local not found. Run ./guide.sh 2 first.${NC}"
        step_footer; return
    fi

    local url key
    url=$(grep -E "^NEXT_PUBLIC_SUPABASE_URL=" .env.local | cut -d '=' -f2- | tr -d '"' | tr -d "'")
    key=$(grep -E "^NEXT_PUBLIC_SUPABASE_ANON_KEY=" .env.local | cut -d '=' -f2- | tr -d '"' | tr -d "'")

    if [ -z "$url" ] || [ -z "$key" ]; then
        echo -e "${RED}❌ Supabase credentials missing in .env.local. Fill them in first.${NC}"
        step_footer; return
    fi

    echo -e "Connected to: ${CYAN}$url${NC}\n"

    local sec_options=("Signup (create new account)" "Login (test existing account)")
    local sec_sel=0
    while true; do
        for i in "${!sec_options[@]}"; do
            [ "$i" -eq "$sec_sel" ] && echo -e "  ${GREEN}${BOLD}› ${sec_options[$i]}${NC}" || echo -e "    ${sec_options[$i]}"
        done
        IFS= read -rsn1 k < /dev/tty
        if [[ "$k" == $'\x1b' ]]; then
            read -rsn2 k < /dev/tty
            [[ "$k" == '[A' || "$k" == '[B' ]] && ((sec_sel = 1 - sec_sel))
        elif [[ "$k" == '' ]]; then break
        elif [[ "$k" == 'q' || "$k" == 'Q' ]]; then clear; exit 0
        fi
        printf "\033[2A\033[0J"
    done
    echo ""

    read -p "  Email: " test_email < /dev/tty
    read -sp "  Password: " test_pass < /dev/tty
    echo -e "\n"

    if [ -z "$test_email" ] || [ -z "$test_pass" ]; then
        echo -e "${RED}❌ Email and password are required.${NC}"
        step_footer; return
    fi

    local endpoint action
    if [ "$sec_sel" -eq 0 ]; then
        endpoint="$url/auth/v1/signup"
        action="Signup"
    else
        endpoint="$url/auth/v1/token?grant_type=password"
        action="Login"
    fi

    echo -e "  ${YELLOW}Running $action...${NC}\n"
    local response
    response=$(curl -s -X POST "$endpoint" \
        -H "apikey: $key" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$test_email\",\"password\":\"$test_pass\"}")

    if echo "$response" | grep -q '"access_token"'; then
        echo -e "  ✅ ${GREEN}$action successful!${NC}"
        if [ "$sec_sel" -eq 0 ]; then
            echo -e "  📧 Check ${CYAN}$test_email${NC} for a confirmation email (if email confirm is ON)."
        else
            echo -e "  🔑 Got access token — auth is working correctly."
        fi
    elif echo "$response" | grep -q '"error"'; then
        local msg
        msg=$(echo "$response" | grep -o '"message":"[^"]*"' | cut -d'"' -f4)
        echo -e "  ${RED}❌ $action failed:${NC} $msg"
        echo -e "  Check your Supabase credentials and project settings."
    else
        echo -e "  ${RED}❌ Unexpected response:${NC}"
        echo "$response"
    fi
    echo ""
    step_footer
}

# Security Command
show_security() {
    local sec_options=("View instructions" "Setup Gmail SMTP" "Test account (signup/login)")
    local sec_sel=0

    while true; do
        show_header
        echo -e "${BOLD}🔒 Step 4 — Security & Gmail Notifications${NC}\n"
        echo -e "Password change re-auth, Gmail security alerts, and auth email setup.\n"
        echo -e "Use ${CYAN}↑ ↓${NC} to navigate  ${GREEN}Enter${NC} to select  ${YELLOW}g${NC} → menu  ${YELLOW}q${NC} → quit\n"
        for i in "${!sec_options[@]}"; do
            [ "$i" -eq "$sec_sel" ] && echo -e "  ${GREEN}${BOLD}› ${sec_options[$i]}${NC}" || echo -e "    ${sec_options[$i]}"
        done
        IFS= read -rsn1 key < /dev/tty
        if [[ "$key" == $'\x1b' ]]; then
            read -rsn2 key < /dev/tty
            case "$key" in
                '[A') ((sec_sel--)); [ "$sec_sel" -lt 0 ] && sec_sel=2 ;;
                '[B') ((sec_sel++)); [ "$sec_sel" -gt 2 ] && sec_sel=0 ;;
            esac
        elif [[ "$key" == '' ]]; then break
        elif [[ "$key" == 'g' || "$key" == 'G' ]]; then show_main; return
        elif [[ "$key" == 'q' || "$key" == 'Q' ]]; then clear; exit 0
        fi
    done

    # Test account
    if [ "$sec_sel" -eq 2 ]; then
        test_auth_account; return
    fi

    show_header

    # Gmail SMTP setup
    if [ "$sec_sel" -eq 1 ]; then
        echo -e "${BOLD}📧 Gmail SMTP Setup${NC}\n"
        echo -e "${BOLD}1. Create a Google App Password${NC}"
        echo -e "   - Go to ${CYAN}myaccount.google.com/security${NC}"
        echo -e "   - Enable ${YELLOW}2-Step Verification${NC} (required)"
        echo -e "   - Go to ${CYAN}myaccount.google.com/apppasswords${NC}"
        echo -e "   - App: ${YELLOW}Mail${NC} | Device: ${YELLOW}Other${NC} → name it 'Supabase'"
        echo -e "   - Copy the ${BOLD}16-character password${NC} generated\n"

        echo -e "${BOLD}2. Configure SMTP in Supabase${NC}"
        echo -e "   Go to ${CYAN}Authentication > Email > SMTP Settings${NC}:"
        echo -e "   - ${BOLD}Enable custom SMTP${NC} → ${GREEN}ON${NC}"
        echo -e "   - ${BOLD}Host${NC}:     ${YELLOW}smtp.gmail.com${NC}"
        echo -e "   - ${BOLD}Port${NC}:     ${YELLOW}465${NC}"
        echo -e "   - ${BOLD}User${NC}:     ${YELLOW}yourname@gmail.com${NC}"
        echo -e "   - ${BOLD}Password${NC}: ${YELLOW}the 16-char app password${NC} (NOT your Gmail password)\n"

        echo -e "${BOLD}3. Verify It Works${NC}"
        echo -e "   Go to ${CYAN}Authentication > Email > Email Templates${NC}"
        echo -e "   Click ${YELLOW}Send test email${NC} — should arrive in your inbox within seconds."
        echo -e "   If it doesn't arrive, double-check the 16-char password and port.\n"

        echo -e "📖 ${BLUE}docs/dannflow_docs/production-features.md#6-email-authentication-gmail-smtp${NC}"
        step_footer; return
    fi

    # Instructions
    echo -e "${BOLD}🔒 Security Notifications & Re-Auth${NC}\n"
    echo -e "DannFlow has a high-security password change flow: the user must verify"
    echo -e "their current password before any update is allowed. A Gmail notification"
    echo -e "is sent automatically on every successful password change.\n"
    echo -e "  ${YELLOW}⚠️  Requires:${NC} Gmail SMTP active (choose 'Setup Gmail SMTP' above)\n"

    echo -e "${BOLD}1. Enable Email Templates${NC}"
    echo -e "   Go to ${CYAN}Supabase → Authentication → Email → Email Templates${NC}:"
    echo -e "   ${GREEN}✓ Reset Password${NC}   — sends reset link via Gmail SMTP"
    echo -e "   ${GREEN}✓ Password Changed${NC} — security alert on every password update\n"

    echo -e "${BOLD}2. Email Provider Settings${NC}"
    echo -e "   Go to ${CYAN}Authentication → Providers → Email${NC}:"
    echo -e "   - ${BOLD}Enable Email Provider${NC} → ${GREEN}ON${NC}"
    echo -e "   - ${BOLD}Confirm Email${NC}         → ${GREEN}ON${NC} (verify email on signup)"
    echo -e "   - ${BOLD}Secure Email Change${NC}   → ${GREEN}ON${NC} (re-confirm on email change)\n"

    echo -e "${BOLD}3. How the Re-Auth Gate Works${NC}"
    echo -e "   ${CYAN}src/services/auth.ts → updatePassword()${NC}"
    echo -e "   1. User enters current password in the Security tab"
    echo -e "   2. Silent ${CYAN}signInWithPassword${NC} verifies identity"
    echo -e "   3. If correct → ${CYAN}updateUser${NC} sets the new password"
    echo -e "   4. Gmail sends 'Password Changed' alert to inbox"
    echo -e "   5. Wrong current password → error shown, no change made\n"

    echo -e "${BOLD}4. Test the Full Flow${NC}"
    echo -e "   Run ${CYAN}npm run dev${NC}, log in, go to Dashboard → Settings → Security tab."
    echo -e "   Or use ${GREEN}./guide.sh 4${NC} → ${GREEN}Test account${NC} to test auth in this terminal.\n"

    echo -e "📖 ${BLUE}docs/dannflow_docs/production-features.md#security-notifications${NC}"
    step_footer
}

# Ready Command
show_ready() {
    show_header
    echo -e "${BOLD}🚀 Ready for Launch? Checkbox:${NC}\n"
    
    echo -e " [ ] ${CYAN}Branding${NC}: App name and GitHub URLs set in .env.local"
    echo -e " [ ] ${CYAN}Auth Setup${NC}: Gmail SMTP and URL Configuration applied"
    echo -e " [ ] ${CYAN}Personalize${NC}: Updated siteConfig in ${CYAN}src/lib/config.ts${NC}"
    echo -e " [ ] ${CYAN}AI Sync${NC}: Supabase MCP connected for Vibe Coding"
    echo -e " [ ] ${CYAN}Snapshot${NC}: Ran 'npm run checkpoint' to save DB state\n"
    
    echo -e "Ready to start coding? Disconnect from the template and start your own legacy:\n"
    echo -e "👉 Run ${YELLOW}./guide.sh init${NC} (This will reset your Git history!)\n"
    
    echo -e "📖 Deployment and Next Steps: ${BLUE}docs/dannflow_docs/backups-and-sync.md${NC}"
    echo -e "Happy shipping! 🚢"
    step_footer
}

# Deploy Command
show_deploy() {
    show_header
    echo -e "${BOLD}🚀 Vercel Deployment Guide${NC}\n"
    echo -e "Ready to show the world? Follow these steps to deploy on Vercel:\n"
    
    echo -e "${BOLD}1. Push to GitHub${NC}"
    echo -e "   - Create a new repository on GitHub."
    echo -e "   - Push your code: ${CYAN}git remote add origin ... && git push -u origin main${NC}\n"
    
    echo -e "${BOLD}2. Import to Vercel${NC}"
    echo -e "   - Go to ${CYAN}vercel.com${NC} and import your repository."
    echo -e "   - Add all environment variables from your ${YELLOW}.env.local${NC}."
    
    echo -e "${BOLD}3. Supabase Redirects (CRITICAL)${NC}"
    echo -e "   - Once deployed, copy your Vercel URL (e.g., ${YELLOW}https://my-app.vercel.app${NC})."
    echo -e "   - Go to ${CYAN}Supabase > Auth > URL Configuration${NC}."
    echo -e "   - Add your Vercel URL to the ${BOLD}Redirect URLs${NC}.\n"
    
    echo -e "📖 Full Production Guide: ${BLUE}docs/dannflow_docs/production-features.md#7-vercel-deployment${NC}"
    step_footer
}

# UI helpers
hex_to_rgb() {
    local hex="${1#'#'}"
    echo "$((16#${hex:0:2})) $((16#${hex:2:2})) $((16#${hex:4:2}))"
}

color_swatch() {
    local hex="$1" label="$2"
    local rgb r g b
    rgb=$(hex_to_rgb "$hex")
    read -r r g b <<< "$rgb"
    printf "  \033[48;2;%d;%d;%dm     \033[0m  %s  %s\n" "$r" "$g" "$b" "$hex" "$label"
}

read_css_token() {
    local token="$1"
    grep -E "^\s*${token}:" src/app/globals.css 2>/dev/null \
        | head -1 | sed 's/.*: *//;s/;.*//' | tr -d ' '
}

write_css_token() {
    local token="$1" value="$2"
    sed -i.bak "s|^\( *\)${token}:.*|\1${token}: ${value};|" src/app/globals.css
    rm -f src/app/globals.css.bak
}

# UI Command
show_ui() {
    local ui_options=("Ask AI for colors" "Setup UI colors" "See current colors" "Reset to DannFlow defaults")
    local ui_sel=0

    while true; do
        show_header
        echo -e "${BOLD}🎨 Step 5 — Brand Theme & Colors${NC}\n"
        echo -e "DannFlow uses Tailwind v4 CSS variables in ${CYAN}src/app/globals.css${NC}.\n"
        echo -e "Use ${CYAN}↑ ↓${NC} to navigate  ${GREEN}Enter${NC} to select  ${YELLOW}g${NC} → menu  ${YELLOW}q${NC} → quit\n"
        for i in "${!ui_options[@]}"; do
            [ "$i" -eq "$ui_sel" ] && echo -e "  ${GREEN}${BOLD}› ${ui_options[$i]}${NC}" || echo -e "    ${ui_options[$i]}"
        done
        IFS= read -rsn1 key < /dev/tty
        if [[ "$key" == $'\x1b' ]]; then
            read -rsn2 key < /dev/tty
            case "$key" in
                '[A') ((ui_sel--)); [ "$ui_sel" -lt 0 ] && ui_sel=3 ;;
                '[B') ((ui_sel++)); [ "$ui_sel" -gt 3 ] && ui_sel=0 ;;
            esac
        elif [[ "$key" == '' ]]; then break
        elif [[ "$key" == 'g' || "$key" == 'G' ]]; then show_main; return
        elif [[ "$key" == 'q' || "$key" == 'Q' ]]; then clear; exit 0
        fi
    done

    # --- Ask AI for colors ---
    if [ "$ui_sel" -eq 0 ]; then
        show_header
        echo -e "${BOLD}🤖 Ask AI for Color Suggestions${NC}\n"

        # Read project context
        local app_name description
        app_name=$(grep '"name"' package.json 2>/dev/null | head -1 | sed 's/.*"name": *"//;s/".*//')
        [ -z "$app_name" ] && app_name="my app"
        description=$(grep -A2 "^#" README.md 2>/dev/null | head -6 | tr '\n' ' ' | sed 's/[#*`]//g' | cut -c1-300)
        [ -z "$description" ] && description="a Next.js SaaS starter application"

        echo -e "Project: ${CYAN}$app_name${NC}"
        echo -e "Context: ${YELLOW}$description${NC}\n"

        local ai_prompt="You are a UI/brand designer. Based on this project: \"$app_name — $description\", suggest a complete color theme for a modern web app. Return ONLY these 13 lines with no extra text or explanation:\nPRIMARY: #hexcode\nPRIMARY_FOREGROUND: #hexcode\nBACKGROUND: #hexcode\nFOREGROUND: #hexcode\nCARD: #hexcode\nCARD_FOREGROUND: #hexcode\nMUTED: #hexcode\nMUTED_FOREGROUND: #hexcode\nSECONDARY: #hexcode\nSECONDARY_FOREGROUND: #hexcode\nACCENT: #hexcode\nACCENT_FOREGROUND: #hexcode\nBORDER: #hexcode"

        # Tool picker
        local tool_opts=("Claude Code (auto-runs & applies)" "Antigravity (copy prompt to chat)")
        local tool_sel=0
        echo -e "Where should I ask?\n"
        while true; do
            for i in "${!tool_opts[@]}"; do
                [ "$i" -eq "$tool_sel" ] && echo -e "  ${GREEN}${BOLD}› ${tool_opts[$i]}${NC}" || echo -e "    ${tool_opts[$i]}"
            done
            IFS= read -rsn1 k < /dev/tty
            if [[ "$k" == $'\x1b' ]]; then
                read -rsn2 k < /dev/tty
                [[ "$k" == '[A' || "$k" == '[B' ]] && ((tool_sel = 1 - tool_sel))
            elif [[ "$k" == '' ]]; then break
            elif [[ "$k" == 'q' || "$k" == 'Q' ]]; then clear; exit 0
            fi
            printf "\033[2A\033[0J"
        done
        echo ""

        # Antigravity: show prompt to copy
        if [ "$tool_sel" -eq 1 ]; then
            echo -e "${BOLD}Copy this prompt into Antigravity chat:${NC}\n"
            echo -e "${CYAN}──────────────────────────────────────────────────${NC}"
            echo -e "$ai_prompt"
            echo -e "${CYAN}──────────────────────────────────────────────────${NC}\n"
            echo -e "When the AI replies, come back and use ${GREEN}Setup UI colors${NC}"
            echo -e "to enter the hex codes manually with live swatches.\n"
            step_footer; return
        fi

        # Claude Code: run automatically
        if ! command -v claude &>/dev/null; then
            echo -e "${RED}❌ 'claude' CLI not found.${NC} Install from ${CYAN}claude.ai/code${NC}\n"
            step_footer; return
        fi

        echo -e "${YELLOW}Asking Claude for color suggestions...${NC}\n"
        local response
        response=$(claude -p "$ai_prompt" 2>/dev/null)

        if [ -z "$response" ]; then
            echo -e "${RED}❌ No response from Claude. Check your connection.${NC}\n"
            step_footer; return
        fi

        echo -e "${BOLD}Claude suggests:${NC}\n"

        local suggest_labels=("PRIMARY" "PRIMARY_FOREGROUND" "BACKGROUND" "FOREGROUND" "CARD" "CARD_FOREGROUND" "MUTED" "MUTED_FOREGROUND" "SECONDARY" "SECONDARY_FOREGROUND" "ACCENT" "ACCENT_FOREGROUND" "BORDER")
        local css_tokens=("--color-primary" "--color-primary-foreground" "--color-background" "--color-foreground" "--color-card" "--color-card-foreground" "--color-muted" "--color-muted-foreground" "--color-secondary" "--color-secondary-foreground" "--color-accent" "--color-accent-foreground" "--color-border")
        local suggested_vals=()
        local valid=0

        for label in "${suggest_labels[@]}"; do
            local val
            val=$(echo "$response" | grep -i "^${label}:" | head -1 | sed 's/.*: *//' | tr -d ' \r\n')
            [[ "$val" != \#* ]] && val="#$val"
            if [[ "$val" =~ ^#[0-9a-fA-F]{6}$ ]]; then
                suggested_vals+=("$val")
                color_swatch "$val" "$label"
                valid=1
            else
                suggested_vals+=("")
                echo -e "  ${YELLOW}⚠️  $label: could not parse${NC}"
            fi
        done
        echo ""

        if [ "$valid" -eq 0 ]; then
            echo -e "${RED}❌ Could not parse any colors from Claude's response.${NC}\n"
            echo -e "Raw response:\n$response\n"
            step_footer; return
        fi

        ask_yes_no "Apply these colors to src/app/globals.css?"
        if [ "$?" -eq 0 ]; then
            for i in "${!css_tokens[@]}"; do
                [ -n "${suggested_vals[$i]}" ] && write_css_token "${css_tokens[$i]}" "${suggested_vals[$i]}"
            done
            echo -e "\n  ✅ ${GREEN}Colors applied!${NC} Run ${CYAN}npm run dev${NC} to preview your new theme.\n"
        else
            echo -e "  ${YELLOW}Cancelled — nothing written.${NC}\n"
        fi
        step_footer; return
    fi

    # --- See current colors (interactive picker) ---
    if [ "$ui_sel" -eq 2 ]; then
        local cur_tokens=(
            "--color-primary:Primary (brand color — buttons, links)"
            "--color-primary-foreground:Primary foreground (text on primary)"
            "--color-background:Page background"
            "--color-foreground:Body text"
            "--color-card:Card / panel background"
            "--color-card-foreground:Card text"
            "--color-muted:Muted background (subtle areas)"
            "--color-muted-foreground:Muted text (secondary labels)"
            "--color-secondary:Secondary background (chips, badges)"
            "--color-secondary-foreground:Secondary text"
            "--color-accent:Accent / hover highlight"
            "--color-accent-foreground:Accent text"
            "--color-border:Borders and dividers"
            "--color-destructive:Error / delete color"
            "--color-ring:Focus ring"
        )
        local cur_sel=0
        local cur_count=${#cur_tokens[@]}

        while true; do
            show_header
            echo -e "${BOLD}🎨 Current Theme Colors${NC}\n"
            echo -e "From ${CYAN}src/app/globals.css${NC}  —  ${CYAN}↑ ↓${NC} navigate  ${GREEN}Enter${NC} to edit  ${YELLOW}g${NC} → menu  ${YELLOW}q${NC} → quit\n"
            for i in "${!cur_tokens[@]}"; do
                local entry="${cur_tokens[$i]}"
                local ctoken="${entry%%:*}"
                local clabel="${entry#*:}"
                local cval
                cval=$(read_css_token "$ctoken")
                local swatch_str
                if [[ "$cval" =~ ^#[0-9a-fA-F]{6}$ ]]; then
                    local cr=$((16#${cval:1:2}))
                    local cg=$((16#${cval:3:2}))
                    local cb=$((16#${cval:5:2}))
                    swatch_str="\033[48;2;${cr};${cg};${cb}m   \033[0m ${cval}"
                else
                    swatch_str="${cval}"
                fi
                if [ "$i" -eq "$cur_sel" ]; then
                    echo -e "  ${GREEN}${BOLD}› ${swatch_str}  ${clabel}${NC}"
                else
                    echo -e "    ${swatch_str}  ${clabel}"
                fi
            done
            echo ""
            IFS= read -rsn1 ckey < /dev/tty
            if [[ "$ckey" == $'\x1b' ]]; then
                read -rsn2 ckey < /dev/tty
                case "$ckey" in
                    '[A') ((cur_sel--)); [ "$cur_sel" -lt 0 ] && cur_sel=$((cur_count - 1)) ;;
                    '[B') ((cur_sel++)); [ "$cur_sel" -ge "$cur_count" ] && cur_sel=0 ;;
                esac
            elif [[ "$ckey" == '' ]]; then
                local eentry="${cur_tokens[$cur_sel]}"
                local etoken="${eentry%%:*}"
                local elabel="${eentry#*:}"
                local ecurrent
                ecurrent=$(read_css_token "$etoken")
                echo -e "${BOLD}Editing: ${CYAN}$elabel${NC}"
                [[ "$ecurrent" =~ ^#[0-9a-fA-F]{6}$ ]] && color_swatch "$ecurrent" "current"
                while true; do
                    printf "New hex (e.g. #16a34a) or blank to cancel: "
                    IFS= read -r einput < /dev/tty
                    einput=$(echo "$einput" | tr -d ' ')
                    [[ -z "$einput" ]] && break
                    [[ "$einput" != \#* ]] && einput="#$einput"
                    if [[ "$einput" =~ ^#[0-9a-fA-F]{6}$ ]]; then
                        color_swatch "$einput" "→ will be set"
                        ask_yes_no "Apply $einput to $etoken?"
                        if [ "$?" -eq 0 ]; then
                            write_css_token "$etoken" "$einput"
                            echo -e "  ✅ ${GREEN}Updated!${NC}\n"
                        else
                            echo -e "  ${YELLOW}Cancelled.${NC}\n"
                        fi
                        break
                    else
                        echo -e "  ${RED}Invalid hex. Use format #rrggbb${NC}"
                    fi
                done
            elif [[ "$ckey" == 'g' || "$ckey" == 'G' ]]; then show_main; return
            elif [[ "$ckey" == 'q' || "$ckey" == 'Q' ]]; then clear; exit 0
            fi
        done
        return
    fi

    # --- Reset to defaults ---
    if [ "$ui_sel" -eq 3 ]; then
        show_header
        echo -e "${BOLD}🔄 Reset to DannFlow Defaults${NC}\n"
        ask_yes_no "This will overwrite your current theme. Continue?"
        if [ "$?" -eq 0 ]; then
            write_css_token "--color-primary" "#6C47FF"
            write_css_token "--color-primary-foreground" "#ffffff"
            write_css_token "--color-background" "#0A0A0F"
            write_css_token "--color-foreground" "#F0EEFF"
            write_css_token "--color-card" "#13131F"
            write_css_token "--color-card-foreground" "#F0EEFF"
            write_css_token "--color-muted" "#1A1A2E"
            write_css_token "--color-muted-foreground" "#9490B5"
            write_css_token "--color-secondary" "#1A1A2E"
            write_css_token "--color-secondary-foreground" "#F0EEFF"
            write_css_token "--color-accent" "#1E1640"
            write_css_token "--color-accent-foreground" "#F0EEFF"
            write_css_token "--color-border" "#2E2A4A"
            write_css_token "--color-destructive" "#ef4444"
            write_css_token "--color-destructive-foreground" "#ffffff"
            write_css_token "--color-input" "#2E2A4A"
            write_css_token "--color-ring" "#6C47FF"
            write_css_token "--color-popover" "#13131F"
            write_css_token "--color-popover-foreground" "#F0EEFF"
            echo -e "  ✅ ${GREEN}Reset to DannFlow defaults.${NC}\n"
            color_swatch "#6C47FF" "primary"
            color_swatch "#0A0A0F" "background"
            color_swatch "#F0EEFF" "foreground"
            color_swatch "#13131F" "card"
            color_swatch "#9490B5" "muted-foreground"
        else
            echo -e "  ${YELLOW}Cancelled.${NC}\n"
        fi
        step_footer; return
    fi

    # --- Setup UI colors ---
    show_header
    echo -e "${BOLD}🎨 Setup UI Colors${NC}\n"
    echo -e "Pick your colors at ${CYAN}coolors.co${NC} or ${CYAN}tailwindcss.com/docs/customizing-colors${NC}"
    echo -e "Copy a hex code (e.g. ${YELLOW}#16a34a${NC}) and paste it below.\n"
    echo -e "${RED}⚠️  Rule:${NC} Always use semantic tokens in components — never hardcode hex in JSX.\n"

    local color_tokens=("--color-primary" "--color-primary-foreground" "--color-background" "--color-foreground" "--color-card" "--color-card-foreground" "--color-muted" "--color-muted-foreground" "--color-secondary" "--color-secondary-foreground" "--color-accent" "--color-accent-foreground" "--color-border")
    local color_labels=("Primary brand color (buttons, links)" "Text on primary (usually white)" "Page background" "Body text" "Card / panel background" "Card text" "Muted background (subtle areas)" "Muted text (secondary labels)" "Secondary bg (chips, badges)" "Secondary text" "Accent / hover highlight" "Accent text" "Borders and dividers")
    local color_defaults=("#6C47FF" "#ffffff" "#0A0A0F" "#F0EEFF" "#13131F" "#F0EEFF" "#1A1A2E" "#9490B5" "#1A1A2E" "#F0EEFF" "#1E1640" "#F0EEFF" "#2E2A4A")
    local new_tokens=()
    local new_vals=()

    local i
    for i in "${!color_tokens[@]}"; do
        local token="${color_tokens[$i]}"
        local label="${color_labels[$i]}"
        local default="${color_defaults[$i]}"
        local current
        current=$(read_css_token "$token")
        [ -z "$current" ] && current="$default"

        echo -e "${BOLD}$label${NC}"
        [[ "$current" =~ ^#[0-9a-fA-F]{6}$ ]] && color_swatch "$current" "current"
        read -p "  Enter hex (press Enter to keep current): " input < /dev/tty
        input=$(echo "$input" | tr -d ' ')
        if [ -n "$input" ]; then
            [[ "$input" != \#* ]] && input="#$input"
            if [[ "$input" =~ ^#[0-9a-fA-F]{6}$ ]]; then
                new_tokens+=("$token")
                new_vals+=("$input")
                color_swatch "$input" "→ will be set"
            else
                echo -e "  ${RED}❌ Invalid hex — skipped.${NC}"
            fi
        else
            echo -e "  ${YELLOW}Kept:${NC} $current"
        fi
        echo ""
    done

    if [ "${#new_tokens[@]}" -eq 0 ]; then
        echo -e "${YELLOW}No changes made.${NC}\n"
        step_footer; return
    fi

    ask_yes_no "Apply these colors to src/app/globals.css?"
    if [ "$?" -eq 0 ]; then
        for i in "${!new_tokens[@]}"; do
            write_css_token "${new_tokens[$i]}" "${new_vals[$i]}"
        done
        echo -e "\n  ✅ ${GREEN}Colors updated in src/app/globals.css${NC}"
        echo -e "  Run ${CYAN}npm run dev${NC} to preview your new theme.\n"
    else
        echo -e "  ${YELLOW}Cancelled — no changes written.${NC}\n"
    fi

    echo -e "📖 ${BLUE}docs/dannflow_docs/ui-system.md${NC}"
    step_footer
}

# Init Command
show_init() {
    local passed_name="$1"
    
    show_header
    echo -e "${RED}${BOLD}⚠️  CRITICAL: RUN ONLY ONCE${NC}"
    echo -e "${RED}This command will rebrand your project and PERMANENTLY REMOVE${NC}"
    echo -e "${RED}all existing Git history to start your own fresh repository.${NC}\n"
    
    echo -e "${BOLD}🚀 Project Rebranding & Initialization${NC}"
    
    if [ -n "$passed_name" ]; then
        app_name="$passed_name"
        echo -e "Using App Name: ${GREEN}${BOLD}$app_name${NC}"
    else
        read -p "Enter your App Name [my-app]: " input_name < /dev/tty
        app_name=${input_name:-"my-app"}
    fi

    # Format for package.json (lowercase, dashes for spaces)
    pkg_name=$(echo "$app_name" | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g' | sed 's/[^a-z0-9-]//g')

    echo -e "\nConfiguring your project...\n"

    # 1. Update .env.local
    if [ -f .env.local ]; then
        # Use cross-platform sed strategy
        sed -i.bak -e "s/^NEXT_PUBLIC_SITE_NAME=.*/NEXT_PUBLIC_SITE_NAME=\"$app_name\"/" .env.local
        rm -f .env.local.bak
        echo -e "✅ Updated ${CYAN}.env.local${NC} NEXT_PUBLIC_SITE_NAME"
    else
        echo -e "⚠️ ${YELLOW}.env.local not found. Run 'cp .env.example .env.local' first.${NC}"
    fi

    # 2. Update package.json
    if [ -f package.json ]; then
        sed -i.bak -e "s/\"name\": \".*\"/\"name\": \"$pkg_name\"/" package.json
        rm -f package.json.bak
        echo -e "✅ Updated ${CYAN}package.json${NC} name to '$pkg_name'"
    fi

    # 3. Update config.ts fallback
    if [ -f src/lib/config.ts ]; then
        sed -i.bak -e "s/name: process.env.NEXT_PUBLIC_SITE_NAME || \".*\"/name: process.env.NEXT_PUBLIC_SITE_NAME || \"$app_name\"/" src/lib/config.ts
        rm -f src/lib/config.ts.bak
        echo -e "✅ Updated ${CYAN}src/lib/config.ts${NC} name fallback"
    fi

    # 4. Reset Git History
    echo -e "📦 ${YELLOW}Resetting Git History...${NC}"
    rm -rf .git
    git init > /dev/null
    git add .
    git commit -m "DannFlow: Initialized fresh repository and rebranded project" > /dev/null
    echo -e "✅ Git history reset and project initialized"

    # 5. Rename Folder (Last step)
    current_dir_name=$(basename "$PWD")
    if [ "$current_dir_name" != "$pkg_name" ]; then
        echo -e "📂 Renaming folder from '${YELLOW}$current_dir_name${NC}' to '${GREEN}$pkg_name${NC}'..."
        if mv "$PWD" "../$pkg_name" 2>/dev/null; then
            cd "../$pkg_name"
            echo -e "✅ Folder renamed to '${CYAN}$pkg_name${NC}'"
        else
            echo -e "❌ ${RED}Failed to rename folder. It might be in use by another process.${NC}"
        fi
    fi

    echo -e "\n${GREEN}Initialization complete!${NC} Your app is now named ${BOLD}$app_name${NC}."
    echo -e "🚀 ${CYAN}Starting development server...${NC}"
    echo -e "${YELLOW}Note: Configure your Supabase keys in .env.local to fix 'fetch failed' errors.${NC}\n"
    
    npm run dev
}

# Routing logic
case "$1" in
    init)     show_init "$2" ;;
    env|2)    show_env ;;
    supabase|1) show_supabase ;;
    vibe|3)   show_vibe ;;
    security|4) show_security ;;
    ui|5)     show_ui ;;
    ready|6)  show_ready ;;
    deploy|7) show_deploy ;;
    *)        show_main ;;
esac
