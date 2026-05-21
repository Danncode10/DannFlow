#!/bin/bash

# Color definitions
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

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

# 1. Prompt for App Name
read -p "Enter your App Name [My DannFlow App]: " app_name < /dev/tty
app_name=${app_name:-"My DannFlow App"}

# Derive slug for the folder name
folder_name=$(echo "$app_name" | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g' | sed 's/[^a-z0-9-]//g')

echo -e "\n🚀 ${CYAN}Creating $app_name in $folder_name...${NC}\n"

# 2. Clone the Repository
if git clone https://github.com/Danncode10/DannFlow "$folder_name"; then
    cd "$folder_name" || exit
    # Remove the installer script from the new project to avoid clutter
    rm install.sh
else
    echo -e "❌ ${RED}Failed to clone the repository.${NC}"
    exit 1
fi

# 3. Environment Setup
echo -e "📦 ${CYAN}Installing dependencies...${NC}"
npm install

echo -e "🔑 ${CYAN}Setting up environment variables...${NC}"
cp .env.example .env.local

# 4. Install Ruflo (global, once per machine) + register MCP server
# Ruflo is currently in BETA — the global install pins @latest so you always
# pull the freshest build. Run this BEFORE the per-project `init wizard`.
echo -e "🧠 ${CYAN}Installing Ruflo globally (beta)...${NC}"
if ! npm install -g ruflo@latest; then
    echo -e "${YELLOW}⚠️  Global ruflo install failed. You can retry later with:${NC}"
    echo -e "   ${YELLOW}npm install -g ruflo@latest${NC}"
fi

if command -v claude >/dev/null 2>&1; then
    echo -e "🔌 ${CYAN}Registering Ruflo MCP server with Claude Code...${NC}"
    claude mcp add ruflo -- npx ruflo@latest mcp start || \
        echo -e "${YELLOW}⚠️  Could not register ruflo MCP. Run manually:${NC} claude mcp add ruflo -- npx ruflo@latest mcp start"
else
    echo -e "${YELLOW}ℹ️  Claude Code CLI not found — skipping MCP registration.${NC}"
    echo -e "   After installing Claude Code, run: ${YELLOW}claude mcp add ruflo -- npx ruflo@latest mcp start${NC}"
fi

# 5. Per-project Ruflo init (swarms, hooks, agents)
echo -e "🌀 ${CYAN}Running Ruflo project init wizard...${NC}"
npx ruflo@latest init wizard || \
    echo -e "${YELLOW}⚠️  Ruflo init wizard did not finish. You can run it later with: npx ruflo@latest init wizard${NC}"

# 6. Trigger Guide Initialization
# This handles the branding and resetting of GIT history for the user.
echo -e "✨ ${CYAN}Running project initialization...${NC}"
chmod +x guide.sh
./guide.sh init "$app_name"

echo -e "\n${GREEN}${BOLD}Setup Complete!${NC}"
echo -e "Your project is ready in: ${CYAN}$folder_name${NC}"
echo -e "\nTo start developing:"
echo -e "  1. ${YELLOW}cd $folder_name${NC}"
echo -e "  2. ${YELLOW}npm run dev${NC}\n"
echo -e "Happy Vibe Coding! 🚢\n"
