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

# Main Menu
show_main() {
    show_header
    echo -e "${BOLD}Getting Started Guide${NC}\n"
    echo -e "Follow these steps in order to configure your project:\n"
    
    echo -e "  ${BOLD}Step 0:${NC} ${GREEN}./guide.sh init${NC}      - ${YELLOW}${BOLD}RUN ONCE:${NC} Rebrand app & ${RED}RESET GIT HISTORY${NC}"
    echo -e "  ${BOLD}Step 1:${NC} ${GREEN}./guide.sh env${NC}       - Set up environment variables (.env.local)"
    echo -e "  ${BOLD}Step 2:${NC} ${GREEN}./guide.sh vibe${NC}      - Connect AI Agents (MCPs/Cursor/Antigravity)"
    echo -e "  ${BOLD}Step 3:${NC} ${GREEN}./guide.sh supabase${NC}  - Configure Supabase, Auth, and SMTP"
    echo -e "  ${BOLD}Step 4:${NC} ${GREEN}./guide.sh security${NC}  - Setup Gmail security notifications"
    echo -e "  ${BOLD}Step 5:${NC} ${GREEN}./guide.sh ready${NC}     - Commit your fresh DannFlow project"
    echo ""
    echo -e "Example: ${YELLOW}./guide.sh init${NC}"
    echo ""
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
    
    echo -e "${BOLD}3. Site Branding${NC}"
    echo -e "   - ${CYAN}NEXT_PUBLIC_SITE_NAME${NC}: Your app's display name."
    echo -e "   - ${CYAN}NEXT_PUBLIC_SITE_URL${NC}: Set to ${YELLOW}http://localhost:3000${NC} for now.\n"
    
    echo -e "📖 See ${BLUE}docs/production-features.md${NC} for more details on env vars."
    echo ""
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
    echo -e "   Enable 2-Step Verification in Google, then generate an ${YELLOW}App Password${NC}."
    echo -e "   This gives you a 16-character code (e.g., xxxx yyyy zzzz wwww).\n"
    
    echo -e "${BOLD}4. SMTP Config${NC}"
    echo -e "   Go to ${CYAN}Supabase > Auth > Notifications > Email${NC} and enable SMTP:"
    echo -e "   - Host: ${YELLOW}smtp.gmail.com${NC} | Port: ${YELLOW}465${NC}"
    echo -e "   - User: ${YELLOW}yourname@gmail.com${NC}"
    echo -e "   - Password: ${YELLOW}(the 16-char code)${NC}\n"
    
    echo -e "${BOLD}5. Email Templates${NC}"
    echo -e "   In the same section under 'Templates', ensure ${CYAN}Reset Password${NC} is ON.\n"
    
    echo -e "📖 Detailed walkthrough: ${BLUE}docs/production-features.md#6-email-authentication-gmail-smtp${NC}"
    echo ""
}

# Vibe Command
show_vibe() {
    show_header
    echo -e "${BOLD}🤖 AI-Native Development (Vibe Coding)${NC}\n"
    echo -e "DannFlow isn't just a UI; it's a workflow built on the ${CYAN}Trinity Model${NC}:"
    echo -e "  - ${BOLD}The Eyes (Types)${NC}: Auto-generated TypeScript mirroring your DB."
    echo -e "  - ${BOLD}The Blueprint (SQL)${NC}: Snapshots for disaster recovery & agents."
    echo -e "  - ${BOLD}The Action (Services)${NC}: Pure business logic away from the UI.\n"
    
    echo -e "${BOLD}Required Agent Tools (MCPs):${NC}"
    echo -e "  1. ${YELLOW}Supabase MCP${NC}  - Grants AI the ability to see and edit your DB."
    echo -e "  2. ${YELLOW}GitHub MCP${NC}    - Allows AI to handle PRs and history context."
    echo -e "  3. ${YELLOW}Terminal MCP${NC}  - For 'npm run checkpoint' automation.\n"
    
    echo -e "🚩 Rule: Always point your agent (Cursor/Antigravity) to ${CYAN}AGENTS.md${NC} first.\n"
    
    echo -e "${BOLD}Automation Commands:${NC}"
    echo -e "  - ${GREEN}npm run update-types${NC} : Refreshes ${CYAN}src/types/supabase.ts${NC} with live DB schema."
    echo -e "  - ${GREEN}npm run checkpoint${NC}   : Snapshots your DB to ${CYAN}supabase/backups/${NC} for AI context.\n"

    echo -e "${BOLD}Verify Connection:${NC}"
    echo -e "Copy and paste this to your AI to confirm the tools are linked:"
    echo -e "  ${CYAN}\"Hey, do a Vibe Check: List my Supabase tables, check my current Git branch, and verify if we have a scripts folder.\"${NC}\n"

    echo -e "📖 Read the Methodology: ${BLUE}docs/methodology.md${NC} and ${BLUE}docs/the-holy-trinity.md${NC}"
    echo ""
}

# Security Command
show_security() {
    show_header
    echo -e "${BOLD}🔒 Security Notifications & Re-Auth${NC}\n"
    echo -e "DannFlow includes a high-security flow for password changes, requiring"
    echo -e "the user's current password to be verified before any update.\n"
    
    echo -e "${BOLD}Setup Steps:${NC}"
    echo -e "1. Ensure your ${CYAN}Gmail SMTP${NC} is active (run ./guide.sh supabase)."
    echo -e "2. Go to ${YELLOW}Supabase > Auth > Email Templates > Password Change${NC}."
    echo -e "3. Toggle it ON. This sends a free alert whenever a security update occurs.\n"
    
    echo -e "💡 This utilizes the re-authentication logic in ${CYAN}src/services/auth.ts${NC}."
    echo -e "📖 Security breakdown: ${BLUE}docs/production-features.md#security-notifications${NC}"
    echo ""
}

# Ready Command
show_ready() {
    show_header
    echo -e "${BOLD}🚀 Ready for Launch? Checkbox:${NC}\n"
    
    echo -e " [ ] ${CYAN}Branding${NC}: App name and GitHub URLs set in .env.local"
    echo -e " [ ] ${CYAN}Auth Setup${NC}: Gmail SMTP configured and templates enabled"
    echo -e " [ ] ${CYAN}AI Sync${NC}: Supabase MCP connected for Vibe Coding"
    echo -e " [ ] ${CYAN}Snapshot${NC}: Ran 'npm run checkpoint' to save DB state\n"
    
    echo -e "Ready to start coding? Disconnect from the template and start your own legacy:\n"
    echo -e "👉 Run ${YELLOW}./guide.sh init${NC} (This will reset your Git history!)\n"
    
    echo -e "📖 Deployment and Next Steps: ${BLUE}docs/backups-and-sync.md${NC}"
    echo -e "Happy shipping! 🚢"
    echo ""
}

# Init Command
show_init() {
    show_header
    echo -e "${RED}${BOLD}⚠️  CRITICAL: RUN ONLY ONCE${NC}"
    echo -e "${RED}This command will rebrand your project and PERMANENTLY REMOVE${NC}"
    echo -e "${RED}all existing Git history to start your own fresh repository.${NC}\n"
    
    echo -e "${BOLD}🚀 Project Rebranding & Initialization${NC}"
    read -p "Enter your App Name [my-app]: " input_name
    app_name=${input_name:-"my-app"}

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
    git commit -m "this projects initialized Dannflow" > /dev/null
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
    init)     show_init ;;
    env)      show_env ;;
    supabase) show_supabase ;;
    vibe)     show_vibe ;;
    security) show_security ;;
    ready)    show_ready ;;
    *)        show_main ;;
esac
