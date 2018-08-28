sudo gnome-terminal -e 'docker-compose up'
if ! type "poi" > /dev/null; then
    sudo npm install poi -g
fi
if ! type "nodemon" > /dev/null; then
    sudo npm install nodemon -g
fi
sudo npm install
sudo gnome-terminal -e 'nodemon'
sudo gnome-terminal -e 'npm run hotreload'