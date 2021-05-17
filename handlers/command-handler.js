const FS = require(`fs`);

module.exports = (BOT, DISCORD) => {
  const COMMAND_FILES = FS.readdirSync(`./commands/`).filter((file) =>
    file.endsWith(`.js`)
  );

  for (const FILE of COMMAND_FILES) {
    const COMMAND = require(`../commands/${FILE}`);
    if (COMMAND.name) {
      BOT.commands.set(COMMAND.name, COMMAND);
    } else {
      continue;
    }
  }
};
