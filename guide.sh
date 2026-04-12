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
    echo -e "Run any of the following commands to configure your project:\n"
    
    echo -e "  ${GREEN}./guide.sh env${NC}       - Set up environment variables (.env.local)"
    echo -e "  ${GREEN}./guide.sh supabase${NC}  - Configure Supabase, Auth, and SMTP"
    echo -e "  ${GREEN}./guide.sh vibe${NC}      - Connect AI Agents (MCPs/Cursor/Antigravity)"
    echo -e "  ${GREEN}./guide.sh security${NC}  - Setup Gmail security notifications"
    echo -e "  ${GREEN}./guide.sh ready${NC}     - Commit your fresh DannFlow project"
    echo ""
    echo -e "Example: ${YELLOW}./guide.sh env${NC}"
    echo ""
}

# Env Command
show_env() {
    show_header
    echo -e "${BOLD}🌍 Environment Setup${NC}\n"
    echo -e "1. Copy the example file if you haven't already:"
    echo -e "   ${CYAN}cp .env.example .env.local${NC}\n"
    echo -e "2. Get your Supabase keys from ${YELLOW}Project Settings > Data API${NC}"
    echo -e "   - NEXT_PUBLIC_SUPABASE_URL"
    echo -e "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo -e "   - SUPABASE_SERVICE_ROLE_KEY\n"
    echo -e "3. Customize your branding:"
    echo -e "   - NEXT_PUBLIC_SITE_NAME=${YELLOW}\"Your App Name\"${NC}"
    echo -e "   - NEXT_PUBLIC_GITHUB_URL=${YELLOW}\"https://github.com/your-username\"${NC}"
    echo ""
}

# Supabase Command
show_supabase() {
    show_header
    echo -e "${BOLD}⚡ Supabase & Free Auth Emails${NC}\n"
    echo -e "Supabase limits free auth emails. We bypass this using Gmail SMTP:\n"
    echo -e "1. Create an ${YELLOW}App Password${NC} in your Google Account (Security > 2-Step Verification)."
    echo -e "2. Go to Supabase > Auth > Providers > Email."
    echo -e "3. Scroll to ${CYAN}SMTP Settings${NC} and enable it:"
    echo -e "   - Host: ${YELLOW}smtp.gmail.com${NC}"
    echo -e "   - Port: ${YELLOW}465${NC}"
    echo -e "   - Username: ${YELLOW}your-gmail@gmail.com${NC}"
    echo -e "   - Password: ${YELLOW}your-16-char-app-password${NC}"
    echo -e "4. Go to ${CYAN}Email Templates${NC} and turn ON 'Reset Password'."
    echo ""
}

# Vibe Command
show_vibe() {
    show_header
    echo -e "${BOLD}🤖 AI Agent Integration (Vibe Coding)${NC}\n"
    echo -e "DannFlow is designed for the Trinity Model (Eyes, Blueprint, Action)."
    echo -e "Ensure your AI (Antigravity/Cursor) has these MCPs active:\n"
    echo -e "  ${CYAN}1. Supabase MCP${NC} - For reading live schema and executing SQL."
    echo -e "  ${CYAN}2. GitHub MCP${NC}   - For branching, PRs, and history context."
    echo -e "  ${CYAN}3. Terminal MCP${NC} - For running 'npm run checkpoint' backups.\n"
    echo -e "Rule of thumb: Point your AI to ${YELLOW}AGENTS.md${NC} as the master instruction file."
    echo -e "Never let the AI put DB logic in UI components. UI is dumb. ${YELLOW}src/services/${NC} is smart."
    echo ""
}

# Security Command
show_security() {
    show_header
    echo -e "${BOLD}🔒 Security Notifications Setup${NC}\n"
    echo -e "DannFlow has built-in Re-Authentication. If a user changes their password,"
    echo -e "they should receive an email alert.\n"
    echo -e "1. Go to Supabase Dashboard > Auth > ${CYAN}Email Templates${NC}."
    echo -e "2. Find the ${YELLOW}Password Change${NC} template."
    echo -e "3. Enable it."
    echo -e "4. This utilizes your Gmail SMTP setup to send free security alerts."
    echo ""
}

# Ready Command (Git commit)
show_ready() {
    show_header
    echo -e "${BOLD}🚀 Initialize Your DannFlow Project${NC}\n"
    echo -e "Ready to start coding? Run these exact commands to disconnect from the"
    echo -e "DannFlow template repository and start your own fresh Git history:\n"
    
    echo -e "${CYAN}rm -rf .git${NC}"
    echo -e "${CYAN}git init${NC}"
    echo -e "${CYAN}git add .${NC}"
    echo -e "${CYAN}git commit -m \"🚀 project: Dannflow was used here - Initializing high-performance architecture\"${NC}"
    echo ""
    echo -e "Happy shipping! 🚢"
    echo ""
}

# Routing logic
case "$1" in
    env)      show_env ;;
    supabase) show_supabase ;;
    vibe)     show_vibe ;;
    security) show_security ;;
    ready)    show_ready ;;
    *)        show_main ;;
esac
