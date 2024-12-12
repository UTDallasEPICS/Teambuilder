# `S.C.I.P.E.` "Skippy"

### Don't Forget To Check Out The Wiki For More Info!!
[https://github.com/AlexQuigley/S.C.I.P.E/wiki](https://github.com/AlexQuigley/S.C.I.P.E/wiki)

### Project Contributors:  
**[Lead Dev]** - _[Alex Quigley](https://github.com/AlexQuigley)_  
**[Senior Dev]** - _[Stephan Antonyuk](https://github.com/stepan-antonyuk)_  
**[Senior Dev]** - _[Bao Nguyen](https://github.com/bnguyen1212)_  

**[Instructor]** - _Jeanie Arid_  
**[Instructor]** - _Taz Nakonecznyj a.k.a. The Tazmanian Devil_  
**[Mentor]** - _Sagar Dhaduk_  

## Dev Installation & Setup
This is the basic installation needed to develop and run SCIPE 
1) **Install these dependencies:** (If having issues, follow the **_Setup Tutorial_** [^1] video)
```
# discord.js - Discord API for JavaScript
npm install discord.js

# nodemon - For auto-updating the bot instead of needing to re-start it all the time
npm install -g nodemon

# dotenv - For making environment variables, added security
npm install dotenv
```

2) **Clone the [SCIPE GitHub repository](https://github.com/AlexQuigley/S.C.I.P.E.git) to your computer.** Once done, add a new file called '.env' to use for storing IDs [^2]. Create three values as so:

***[NOTE]**: _If you are not planning on running SCIPE from your local machine then you can skip this step_  
```
TOKEN = <Bot Token>         
GUILD_ID = <Server ID>      
BOT_ID = <Bot ID>           
```

3) **Initalize package.json** by opening the VS code terminal and run `npm init -y`. This will build the package.json file, open it and make sure it looks just like this: 

***[NOTE]**: _If you already have the package.json file in your local repository then you can skip this step_ 
```
   {
     "name": "scipe",
     "version": "1.0.0",
     "description": "S.C.I.P.E.  Smart Computer Interface for Protocol Execution",
     "main": "src/index.js",
     "scripts": {
       "test": "echo \"Error: no test specified\" && exit 1"
     },
     "keywords": [],
     "author": "",
     "license": "ISC",
     "dependencies": {
       "discord.js": "^14.16.2",
       "dotenv": "^16.4.5"
     }
   }
```
4) Assuming everything is correct, the bot should startup when you run `npm run dev:bot` in the terminal. [^3] [^4]


[^1]: [**Setup Tutorial**](https://www.youtube.com/watch?v=KZ3tIGHU314)  
[^2]: NOTE: Getting the `TOKEN` and `BOT_ID` values require you to have admin access to a constructed bot via [Discord Dev](https://discord.com/developers/applications)  
The `TOKEN` value is taken from [Discord Dev](https://discord.com/developers/applications). You can find it located under the `Bot` tab.   
The `Guild_ID` can be found by right-clicking the Discord server's name and clicking `Copy Server ID`  
The `Bot_ID` can be found by right clicking the bot in discord and clicking `Copy User ID`. Alternatively it can also be found in the URL of the bot on [Discord Dev](https://discord.com/developers/applications)   
[^3]: If `nodemon` is returning an error, it means there is an error in the code, not that the setup is incorrect.  
[^4]: SCIPE will output: `SCIPE (Skippy)#7016 is online.` to the terminal when the bot is running correctly.  
