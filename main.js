const DISCORD = require(`discord.js`);
require(`dotenv`).config();
const BOT = new DISCORD.Client();

BOT.commands = new DISCORD.Collection();
BOT.events = new DISCORD.Collection();

[`command-handler`, `event-handler`].forEach((handler) => {
  require(`./handlers/${handler}`)(BOT, DISCORD);
});

BOT.login(process.env.BOT_TOKEN);
