const FS = require(`fs`);

module.exports = {
  name: `help`,
  description: `This command displays a list of all available commands and their descriptions.`,
  syntax: `--help`,

  // CODE BELOW THIS LINE

  execute(BOT, message, ARGS, DISCORD) {
    // STEP [01] -
    const COMMAND_FILES = FS.readdirSync(`./commands/`).filter((file) =>
      file.endsWith(`.js`)
    );

    // STEP [02] - Construct the text of the --help embed based on all the command's metadata.
    const EMBED_FIELDS = [];

    for (const FILE of COMMAND_FILES) {
      const COMMAND = require(`../commands/${FILE}`);

      let commandAliasesArray = [];
      let commandAliasesString = ``;

      if (COMMAND.aliases) {
        COMMAND.aliases.forEach((element) => {
          commandAliasesArray.push(element);
        });

        commandAliasesString = `\n**alias(es):** \`${commandAliasesArray.join(
          ` / `
        )}\``;
      }

      if (COMMAND.name) {
        switch (COMMAND.name) {
          case `help`:
          case `unknown`:
            continue;

          default:
            EMBED_FIELDS.push(
              `**• ${COMMAND.name.toUpperCase()}**${commandAliasesString}\n${
                COMMAND.description
              }\n**syntax:** \`${COMMAND.syntax}\`\n\n`
            );

            break;
        }
      } else {
        continue;
      }
    }

    // STEP [03] - Check how many embeds are necessary to cover all the text.

    var embedCharQuant = 0;

    for (let i = 0; i < EMBED_FIELDS.length; i++) {
      embedCharQuant += EMBED_FIELDS[i].length;
    }

    if (embedCharQuant > 2048) {
      var quociente = embedCharQuant / 2048;
      var resto = embedCharQuant % 2048;
    }

    quantEmbeds = Math.ceil(quociente);

    quantFieldEachEmbed = Math.floor(EMBED_FIELDS.length / quantEmbeds);
    quantFieldAreLeft = EMBED_FIELDS.length % quantEmbeds;

    const ARRAY_EMBED_DESCRIPTIONS = [];

    counter = 0;

    for (let i = 0; i < quantEmbeds; i++) {
      // Gives each embedDescription its due amount of fields.
      var embedDescription = ``;
      for (let ii = 0; ii < quantFieldEachEmbed; ii++) {
        embedDescription += EMBED_FIELDS[counter];
        counter++;
      }
      ARRAY_EMBED_DESCRIPTIONS.push(embedDescription);
    }

    for (let i = 0; i < quantFieldAreLeft; i++) {
      // Distributes the fields which were left out within the embedDescriptions that were construed above.
      ARRAY_EMBED_DESCRIPTIONS[i] += EMBED_FIELDS[counter];
      counter++;
    }

    // STEP [04] - Construct the --help EMBED messages.

    const HELP_EMBED_ARRAY = [];

    for (let i = 0; i < quantEmbeds; i++) {
      // Builds the EMBED message
      var HELP_EMBED = new DISCORD.MessageEmbed()
        .setColor(`BLURPLE`)
        .setTitle(
          `COMMAND LIST [${i + 1}/${quantEmbeds}] - ${BOT.user.username} BOT #${
            BOT.user.discriminator
          }`
        )
        .setDescription(ARRAY_EMBED_DESCRIPTIONS[i])
        .setFooter(
          `${BOT.user.username} BOT #${BOT.user.discriminator} - Always happy to be of service!`,
          `https://cdn.discordapp.com/avatars/824583769255051274/3482cdf346348b2be93ea9e7c575bdac.png?size=256`
        );
      // Adds the built embed to the EMBEDs array
      HELP_EMBED_ARRAY.push(HELP_EMBED);
    }

    // STEP [04] - Send the EMBED message.
    HELP_EMBED_ARRAY.forEach((element) => {
      message.channel.send(element);
    });
  },
};
