<div id="logo" align="center">
  <a href="https://github.com/emilkrebs/Nitrado-Bot" target="_blank" rel="noopener noreferrer">
	  <img width="256" alt="Nitrado-Bot Logo" src="https://user-images.githubusercontent.com/68400102/171499841-642a53a2-e00d-4688-9637-c993a86a8161.png">
	</a>
  <h3>
    Controll your Nitrado Gameserver
  </h3>
</div>


<div id="badges" align="center">
  
   [![Build](https://github.com/emilkrebs/Nitrado-Bot/actions/workflows/build.yml/badge.svg)](https://github.com/emilkrebs/Nitrado-Bot/actions/workflows/build.yml)
   [![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/emilkrebs/Nitrado-Bot)

</div>

<hr>

This Bot lets you and others start your Nitrado Gameserver from Discord. 

I am using this Discord Bot to start a ARK Server.

# Getting started
- Install [node.js](https://nodejs.org/en/)
- If you don't already have a Discord Bot, create one [here](https://discord.com/developers/applications/)
- Clone the repository using `git clone https://github.com/emilkrebs/nitrado-bot.git`
- Create a `config.json` file that looks like this:
```json
{
    "token":"your-bot-token",
    "nitrado_token":"your-nitrado-access-token",
    "nitrado_id":"your-nitrado-serviceid"
}
```
- `npm i` to install all required dependencies
- `npm run start` to start the bot
