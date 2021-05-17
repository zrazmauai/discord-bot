module.exports = {
  name: `mutev`,
  aliases: [`mutevoice`, `mvoice`, `mv`],
  description: `This command mutes the voice of any one user currently in a voice channel.`,
  syntax: `--mutev\` \`@user`,

  execute(BOT, message, ARGS, DISCORD) {
    const USER = message.mentions.users.first();

    //Verifies if the user has permission to mute a member
    if (!message.member.hasPermission(`MUTE_MEMBERS`))
      return message.channel.send(
        `Sorry, but you don't have the permission to mute members!`
      );

    //Verifies if the command caller mentioned a user in his message

    if (!USER) {
      return message.channel.send(
        `Please, inform a member (which is currently active in a voice chat) to be muted!\n**syntax:** \`${this.syntax}\``
      );
    }

    const MEMBER = message.guild.member(USER);

    if (!MEMBER) {
      return message.channel.send(
        `Im sorry, but the user mentioned is not currently a member of this server!`
      );
    }

    MEMBER.voice.setMute(true).catch((err) => {
      message.channel.send(
        `Muting failed. Are you sure the mentioned user is currently in a voice chat?`
      );
    });
  },
};
