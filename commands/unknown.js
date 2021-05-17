const FS = require(`fs`);

module.exports = {
  name: `unknown`,
  description: `This is the bot's automated response to the typing of an unrecognized command.`,

  // CODE BELOW THIS LINE

  execute(BOT, message, ARGS, DISCORD) {
    // STEP [01] - Check if there's any input and, if THERE IS, store it in a new variable

    if (message.content.slice(process.env.PREFIX.length).length === 0) {
      return;
    } else {
      messageContent = message.content.slice(process.env.PREFIX.length);
      if (hasSpace(messageContent)) {
        if (hasNewLine(message.content)) {
          return;
        }
        hasCommand(messageContent.trim().split(`\n`)[0].split(` `)[0]);
      } else {
        var unrecognizedCommand = messageContent.split(`\n`)[0].split(` `)[0];
        if (unrecognizedCommand.length <= 15) {
          message.channel.send(
            `I'm sorry, but \`--${unrecognizedCommand}\` is not a recognized command!\nType \`--help\` for a list of available commands!`
          );
        } else {
          message.channel.send(
            `I'm sorry, but the input value is not a recognized command!\nType \`--help\` for a list of available commands!`
          );
        }
      }
    }

    // APPENDIX A - Function library
    function hasNewLine(text) {
      if (text.search(`\n`) == -1) {
        return false;
      } else return true;
    }

    function hasSpace(text) {
      if (text != text.trim()) {
        return true;
      } else return false;
    }

    function hasCommand(commandName) {
      const COMMAND_FILES = FS.readdirSync(`./commands/`).filter((file) =>
        file.endsWith(`.js`)
      );

      for (const FILE of COMMAND_FILES) {
        const COMMAND = require(`../commands/${FILE}`);
        if (COMMAND.name === commandName && commandName !== `unknown`) {
          return message.channel.send(
            `I'm sorry, did you call?\nPlease check for unwanted spaces before calling a command!`
          );
        } else continue;
      }
    }
  },
};
