echo -e "\033[0;37m╔══════════════════════════╗"
echo -e "\033[0;37m║\033[1;36mSwitching to branch master\033[0;37m║"
echo -e "\033[0;37m╚══════════════════════════╝"
git checkout master

echo -e "\033[0;37m╔══════════════════════════╗"
echo -e "\033[0;37m║\033[1;36m       Building app       \033[0;37m║"
echo -e "\033[0;37m╚══════════════════════════╝"
npm run build

echo -e "\033[0;37m╔══════════════════════════╗"
echo -e "\033[0;37m║\033[1;36mDeploying files to server \033[0;37m║"
echo -e "\033[0;37m╚══════════════════════════╝"
scp -i 'C:\jebacwindows\dlaPowerShella\ssh-key-2024-07-24.key' -r dist/* ubuntu@130.162.228.126:/var/www/html/beerdex/


echo -e "\033[0;37m╔══════════════════════════╗"
echo -e "\033[0;37m║\033[1;32m   Deploying Finished!    \033[0;37m║"
echo -e "\033[0;37m╚══════════════════════════╝"