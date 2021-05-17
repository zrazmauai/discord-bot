module.exports = {
  name: `del`,
  aliases: [`d`, `delete`],
  description: `This command deletes the last 1 - 99 messages on the channel in which it is called.`,
  syntax: `--del\` \`number`,

  // CODE BELOW THIS LINE

  async execute(BOT, message, ARGS, DISCORD) {
    // STEP [01] - Verifies if the user has permission to delete messages.
    if (!message.member.hasPermission(`MANAGE_MESSAGES`))
      return message.channel.send(
        `Sorry, but it seems you don't have permission to delete messages!`
      );

    // STEP [02] - Verifies if the user has input a valid number of messages to be deleted.

    if (!ARGS[0]) {
      return message.channel.send(
        `Sorry, but I must be informed how many messages to delete!\n**syntax:** \`${this.syntax}\``
      );
    }

    if (isNaN(ARGS[0])) {
      return message.channel.send(
        `Sorry, but it seems the input value is not a number!\n**syntax:** \`${this.syntax}\``
      );
    }

    if (ARGS[0] <= 0 || ARGS[0] > 99) {
      return message.channel.send(
        `Please input a valid number of messages!\n**Valid range:** \`1 - 99\``
      );
    }
    const DELETE_QUANTITY = parseInt(ARGS[0]) + 1;

    // STEP [03] - Deletes the messages.

    message.channel.messages
      .fetch({ limit: DELETE_QUANTITY })
      .then((messages) => checkDateAndDelete(DELETE_QUANTITY, messages))
      .catch(console.error);

    // APPENDIX: Function library.

    async function checkDateAndDelete(quantity, array) {
      var counter = 0;
      // Checks at what point (index) in the messages collection the messages start being 2week+ old.
      try {
        array.forEach((element) => {
          if (
            message.createdAt - element.createdAt >=
            14 * 24 * 60 * 60 * 1000
          ) {
            counter++;
          }
        });
      } finally {
        if (counter != 0) {
          message.channel.send(
            `Uh oh! It seems some targeted messages have been sent over 2 weeks ago.\nNo worries, I'll switch to force delete mode. Hold on, though, **this might take a while...**`
          );
          try {
            // Bulk deletes only those messages which aren't 2week+ old.
            message.channel.bulkDelete(quantity - counter);
          } finally {
            var newArray = array.last(counter);
            // Then deletes those messages which are 2week+ old.
            newArray.forEach((element) => {
              element.delete();
            });
          }
        } else {
          message.channel.bulkDelete(quantity);
        }
      }
    }

    //
  },
};
