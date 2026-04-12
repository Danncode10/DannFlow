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

# 4. Trigger Guide Initialization
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
