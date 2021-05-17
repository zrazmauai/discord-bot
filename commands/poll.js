module.exports = {
  name: `poll`,
  description: `This command creates a simple binary-choice poll in the channel in which it is created.`,
  syntax: `--poll\` \`question`,

  async execute(BOT, message, ARGS, DISCORD) {
    // STEP [01] - Gets the user's question.
    let pollDescription = ARGS.join(" ");

    // STEP [02] - Checks the command's syntax.
    if (pollDescription.length === 0) {
      return message.channel.send(
        `Please, specify a question!\n**syntax:** \`${this.syntax}\``
      );
    }
    // STEP [03] - Structures the poll's EMBED.
    const POLL_EMBED = new DISCORD.MessageEmbed()
      .setTitle(`POLL`)
      .setDescription(pollDescription)
      .setColor(`BLURPLE`)
      .setFooter(`poll by ${message.author.tag}`);

    // STEP [04] - Sends the poll's EMBED.
    let embedReact = await message.channel.send(POLL_EMBED);
    await embedReact.react(`👍`); // Reacts with "👍".
    await embedReact.react(`👎`); // Reacts with "👎".
  },
};
