const FS = require(`fs`);

module.exports = (BOT, DISCORD) => {
  const LOAD_DIR = (dirs) => {
    const EVENT_FILES = FS.readdirSync(`./events/${dirs}`).filter((file) =>
      file.endsWith(`.js`)
    );

    for (const FILE of EVENT_FILES) {
      const EVENT = require(`../events/${dirs}/${FILE}`);
      const EVENT_NAME = FILE.split(`.`)[0];
      BOT.on(EVENT_NAME, EVENT.bind(null, DISCORD, BOT));
    }
  };

  [`bot`, `guild`].forEach((e) => LOAD_DIR(e));
};
