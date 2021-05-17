module.exports = (DISCORD, BOT, message) => {
  const PREFIX = process.env.PREFIX;

  // If the message does not start with the predetermined PREFIX or if its author is the BOT itself, DO NOTHING.
  if (!message.content.startsWith(PREFIX) || message.author.bot) return;

  const ARGS = message.content.slice(PREFIX.length).split(/ +/);
  const CMD = ARGS.shift().toLowerCase();

  const COMMAND =
    BOT.commands.get(CMD) ||
    BOT.commands.find(
      (commandFile) => commandFile.aliases && commandFile.aliases.includes(CMD)
    );

  if (COMMAND) {
    COMMAND.execute(BOT, message, ARGS, DISCORD);
  } else {
    BOT.commands.get(`unknown`).execute(BOT, message, ARGS, DISCORD);
  }
};
