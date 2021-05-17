module.exports = {
  name: `schedulemeeting`,
  aliases: [`smeet`, `schedulemeet`, `smeeting`, `sm`, `schedule`],
  description: `Schedules a meeting.`,
  syntax: `--schedulemeeting description`,

  async execute(BOT, message, ARGS, DISCORD) {
    // STEP [00] - Checks for any input; If there's none, inform the user.
    if (ARGS.length == 0) {
      return message.channel.send(
        `Please, you must provide a description for the meeting!\n**syntax:** \`${this.syntax}\``
      );
    }

    // STEP [01] - Get the user's input and formats it adequately.
    let meetDesc = ARGS.join(` `).trim();

    // STEP [02] - Constructs the meeting EMBED.
    const SCHEDULED_MEETING_EMBED = new DISCORD.MessageEmbed()
      .setTitle(`ATTENDANCE CHECK - NEW MEETING`)
      .setColor(`BLURPLE`)
      .setDescription(`📅​ ​ ​ ${meetDesc}`) // Two ZERO-WIDTH WHITESPACE CHARACTERS
      .setFooter(
        `Called by ${message.author.tag} • Make sure to confirm your presence below.`
      );

    // STEP [03] - Send the meeting EMBED and provide its reactions.
    let embedReact = await message.channel.send(SCHEDULED_MEETING_EMBED);
    await embedReact.react(`✅`); // Reacts with "✅".
    await embedReact.react(`❌`); // Reacts with "❌".
  },
};
