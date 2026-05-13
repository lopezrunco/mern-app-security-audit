### Step-by-step guide to install and run the API

```sh
# Connect to the server via SSH
# ssh USERNAME@SERVER_ADDRESS -p SSH_PORT
ssh USERNAME@127.0.0.1 -p 1022

# Update OS dependencies
sudo apt update

# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Logout of the VM and log in again for NVM to work

# Install node with nvm (alternatives below)

# Latest version (option 1)
nvm install node

# LTS version (option 2)
nvm install --lts

# Install pm2
npm install pm2@latest -g

# Clone the app on the server / alternatively, copy it

# Use GitHub personal access token as password https://github.com/settings/tokens

# Install dependencies
npm i

# Generate or copy the .env file with the corresponding values

# Get the command for automatic app restart
pm2 startup

# Copy and execute the command provided above

# Run the app with pm2
pm2 start src/api.js

# Freeze so pm2 remembers to restart apps automatically
pm2 save

# Install Nginx server
sudo apt install nginx

# Check Nginx status
sudo systemctl status nginx

# Clear the content of the default file and paste the contents of nginx.conf
sudo nano /etc/nginx/sites-available/default

# Reload Nginx configuration
sudo systemctl reload nginx

```

### Utils

```sh
# Copy files from the local machine to a remote server
scp -P 1022 .env USERNAME@127.0.0.1:PATH_ON_SERVER

# PM2 Monitor
pm2 monit

# Display the absolute path of the current location
pwd
```

## More info
- https://pm2.keymetrics.io/docs/usage/startup/