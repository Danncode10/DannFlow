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
    echo -e "${BOLD}⚡ Supabase & SMTP Automation${NC}\n"
    
    echo -e "${BOLD}1. Project Creation${NC}"
    echo -e "   - Go to ${CYAN}Supabase Dashboard${NC} and click 'New Project'."
    echo -e "   - Set your ${YELLOW}Project Name${NC} and a secure ${YELLOW}Database Password${NC}."
    echo -e "   - ${RED}${BOLD}WARNING (Free Tier):${NC} Supabase allows only ${BOLD}2 active projects${NC}."
    echo -e "     If you already have 2, you must ${YELLOW}pause or delete${NC} one before creating this.\n"

    echo -e "${BOLD}2. AI Orchestration (Vibe Coding)${NC}"
    echo -e "   If your Supabase MCP is connected, copy and paste this to your agent:"
    echo -e "   ${CYAN}\"I've created a new Supabase project. Ask me for the Project Reference ID. Once provided, execute this protocol:\n\n1. Target: Connect to the new project via Supabase MCP.\n2. Execution: Locate the latest .sql backup in supabase/backups/. Read its content and execute it against the new project.\n3. Verification (MANDATORY): Immediately after execution, run an MCP command to list all tables and functions in the public schema.\n4. Report: Compare the results with the DannFlow architecture requirements.\n\nDo not report success until you can physically see the 'profiles' table and 'handle_new_user' function in the live database. If the list is empty, troubleshoot the connection and try again.\"${NC}\n"

    echo -e "${BOLD}3. Google App Password (SMTP)${NC}"
    echo -e "   - Enable 2-Step Verification in Google."
    echo -e "   - Generate an ${YELLOW}App Password${NC} at ${CYAN}myaccount.google.com/apppasswords${NC}."
    echo -e "   - This gives you a 16-character code.\n"
    
    echo -e "${BOLD}4. SMTP Config${NC}"
    echo -e "   Go to ${CYAN}Authentication > Email > SMTP Settings${NC}:"
    echo -e "   - Enable ${YELLOW}Enable custom SMTP${NC} to ON."
    echo -e "   - Host: ${YELLOW}smtp.gmail.com${NC} | Port: ${YELLOW}465${NC}"
    echo -e "   - User: ${YELLOW}yourname@gmail.com${NC}"
    echo -e "   - Password: ${YELLOW}(the 16-char code)${NC}\n"
    
    echo -e "${BOLD}5. URL Configuration${NC}"
    echo -e "   Go to ${CYAN}Authentication > URL Configuration${NC}:"
    echo -e "   - ${BOLD}Site URL${NC}: Set to your live production domain."
    echo -e "   - ${BOLD}Redirect URLs${NC}: Add ${YELLOW}http://localhost:3000/**${NC} (local development)."
    echo -e "   - ${BOLD}Redirect URLs${NC}: Add ${YELLOW}https://yourdomain.com/**${NC} (production).\n"
    
    echo -e "📖 Detailed walkthrough: ${BLUE}docs/dannflow_docs/production-features.md#6-email-authentication-gmail-smtp${NC}"
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

# Security Command
show_security() {
    show_header
    echo -e "${BOLD}🔒 Security Notifications & Re-Auth${NC}\n"
    echo -e "DannFlow has a high-security password change flow: the user must verify their"
    echo -e "current password before any update is allowed. A Gmail notification is sent"
    echo -e "automatically on every successful password change.\n"
    echo -e "  ${YELLOW}⚠️  Requires:${NC} Gmail SMTP active (Step 1 — ./guide.sh supabase)\n"

    echo -e "${BOLD}1. Enable Email Templates${NC}"
    echo -e "   Go to ${CYAN}Supabase Dashboard → Authentication → Email → Email Templates${NC}"
    echo -e "   Enable these two templates:\n"
    echo -e "   ${GREEN}✓ Reset Password${NC}   — Sends password reset link via your Gmail SMTP"
    echo -e "   ${GREEN}✓ Password Changed${NC} — Notifies user when password is updated\n"

    echo -e "${BOLD}2. Confirm Email Sending is ON${NC}"
    echo -e "   Go to ${CYAN}Authentication → Providers → Email${NC}:"
    echo -e "   - ${BOLD}Enable Email Provider${NC} → ${GREEN}ON${NC}"
    echo -e "   - ${BOLD}Confirm Email${NC}         → ${GREEN}ON${NC} (users must verify email on signup)"
    echo -e "   - ${BOLD}Secure Email Change${NC}   → ${GREEN}ON${NC} (re-confirm when email changes)\n"

    echo -e "${BOLD}3. How the Re-Auth Gate Works${NC}"
    echo -e "   ${CYAN}src/services/auth.ts${NC} → ${CYAN}updatePassword()${NC}"
    echo -e "   1. User enters current password in the Security tab"
    echo -e "   2. A silent ${CYAN}signInWithPassword${NC} verifies identity"
    echo -e "   3. If correct → ${CYAN}updateUser${NC} sets the new password"
    echo -e "   4. Gmail sends a 'Password Changed' alert to the user's inbox"
    echo -e "   5. If wrong current password → error shown, no change made\n"

    echo -e "${BOLD}4. Test the Full Flow${NC}"
    echo -e "   1. Run ${CYAN}npm run dev${NC} and log in"
    echo -e "   2. Go to Dashboard → Settings → Security tab"
    echo -e "   3. Enter wrong current password → should show error"
    echo -e "   4. Enter correct current password + new password → should succeed"
    echo -e "   5. Check inbox — 'Password Changed' email should arrive via Gmail\n"

    echo -e "📖 Full breakdown: ${BLUE}docs/dannflow_docs/production-features.md#security-notifications${NC}"
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

# UI Command
show_ui() {
    show_header
    echo -e "${BOLD}🎨 Brand Theme & Color System${NC}\n"
    echo -e "DannFlow uses ${CYAN}Tailwind v4 CSS variables${NC} for theming."
    echo -e "Edit ${YELLOW}src/app/globals.css${NC} inside the ${CYAN}@theme {}${NC} block to match your brand.\n"

    echo -e "${BOLD}Key Tokens to Customize:${NC}"
    echo -e "  ${CYAN}--color-primary${NC}             - Your brand's main action color (buttons, links)"
    echo -e "  ${CYAN}--color-primary-foreground${NC}  - Text on top of primary (usually white)"
    echo -e "  ${CYAN}--color-background${NC}          - Page background"
    echo -e "  ${CYAN}--color-foreground${NC}          - Default body text"
    echo -e "  ${CYAN}--color-card${NC}                - Card/panel background"
    echo -e "  ${CYAN}--color-card-foreground${NC}     - Text inside cards"
    echo -e "  ${CYAN}--color-secondary${NC}           - Muted backgrounds, chips, badges"
    echo -e "  ${CYAN}--color-border${NC}              - Dividers, input borders\n"

    echo -e "${BOLD}Current Defaults (DannFlow Blue):${NC}"
    echo -e "  primary:     ${BLUE}#2563eb${NC} (blue-600)"
    echo -e "  background:  #ffffff (white)"
    echo -e "  foreground:  #020617 (slate-950)\n"

    echo -e "${BOLD}Example — Change to a green brand:${NC}"
    echo -e "  ${CYAN}--color-primary: #16a34a;${NC}   /* green-600 */"
    echo -e "  ${CYAN}--color-primary-foreground: #ffffff;${NC}\n"

    echo -e "${RED}${BOLD}⚠️  RULE:${NC} Always use semantic tokens in components (e.g. ${CYAN}bg-primary${NC}, ${CYAN}text-foreground${NC})."
    echo -e "         NEVER hardcode hex, rgba, or raw Tailwind palette colors in JSX.\n"

    echo -e "📖 Full UI system guide: ${BLUE}docs/dannflow_docs/ui-system.md${NC}"
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
