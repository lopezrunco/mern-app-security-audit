## Heroku

- Go to the Heroku dashboard.
- Create the app in the desired region.
- Navigate to the deploy methods (deploy tab).
- Select GitHub.
- Choose the repository to deploy and connect it.
- Select the branch for automatic deployment.
- Enable automatic deployment.

### Configure Environment Variables
- Go to the settings tab.
- Navigate to the "Config Vars" section.
- Click on "Reveal Config Vars."
- Add all the environment variables listed in the readme, EXCEPT the `PORT` variable.

### Initial Deployment
- You can push to the desired branch.
- Click the "Manual Deploy" button.
