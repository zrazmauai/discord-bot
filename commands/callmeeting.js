module.exports = {
  name: `callmeeting`,
  aliases: [`cmeet`, `callmeet`, `cmeeting`, `cm`, `call`],
  description: `Calls a meeting.`,
  syntax: `--callmeeting\` **condition:** \`(whilst replying to a --callmeeting embed!)`,

  execute(BOT, message, ARGS, DISCORD) {
    // STEP [01] - Make sure the user is replying to a message.
    if (!message.reference) {
      return message.channel.send(
        `Remember: you must be replying to a message!\n**syntax:** \`${this.syntax}\``
      );
    }

    // STEP [02] - Get the ID of the message to which the user is replying.
    const ORIGINAL_MESSAGE_ID = message.reference.messageID;

    // STEP [03] - Fetch for the message to which the user replied.
    message.channel.messages
      .fetch(ORIGINAL_MESSAGE_ID)
      .then((originalMessage) => {
        if (!originalMessage) {
          return message.channel.send(
            `I'm sorry, but I couldn't read the data of the message to which you've replied.`
          );
        } else {
          // STEP [04] - If the message is found and readable, check if it is a --schedulemeet EMBED.
          if (
            originalMessage.embeds.length == 1 &&
            originalMessage.embeds[0].type == `rich` &&
            originalMessage.embeds[0].title ==
              `ATTENDANCE CHECK - NEW MEETING` &&
            originalMessage.author.bot
          ) {
            // STEP [05] - If the original message is found to be VALID, get all positive reactions.
            // code

            const REACTIONS_ARRAY = originalMessage.reactions.cache.array();

            // STEP [07] - Create the EMBED to send each user.

            const CALLED_MEETING_EMBED = new DISCORD.MessageEmbed()
              .setTitle(`A MEETING HAS BEEN CALLED!`)
              .setColor(`RED`)
              .setDescription(`${originalMessage.embeds[0].description}`) // Two ZERO-WIDTH WHITESPACE CHARACTERS
              .setFooter(`Called by ${message.author.tag} • Don't be late!`);

            // STEP [08] - Send the above EMBED to each user that has reacted positively.
            REACTIONS_ARRAY.forEach((element) => {
              if (element.emoji.name === `✅`) {
                element.users.fetch().then((collection) => {
                  collection.forEach((collectedUser) => {
                    if (collectedUser != originalMessage.author) {
                      collectedUser.send(CALLED_MEETING_EMBED);
                    }
                  });
                });
              }
            });
          } else {
            // callback STEP [05] - If the original message is NOT VALID, inform the user.
            return message.channel.send(
              `Please, you must reply to a valid message!\n**syntax:** \`${this.syntax}\``
            );
          }
        }
      });

    return;

    if (!ORIGINAL_MESSAGE) {
      return message.channel.send(
        `I'm sorry, but I couldn't read the data of the message to which you've replied.`
      );
    } else {
      // return console.log(ORIGINAL_MESSAGE);
    }
  },
};
