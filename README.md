# github management program

creates, deletes, and manages collaborators/repos

##requirements
- node.js v14+
- github access token with admin and repo permissions

##setup and run
1. clone repo\
   bash:
   git clone https://github.com/jasonxshetty/github-bot.git
   cd github-management
2. install dependencies\
    bash: npm install
3. create .env\
    bash: cp .env.example .env
4. edit "your_personal_access_token" to you token in .env file
5. compile typescript\
    bash: tsc
7. run\
    bash: node dist/GithubManagement.js
