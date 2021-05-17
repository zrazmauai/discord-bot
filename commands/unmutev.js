module.exports = {
  name: `unmutev`,
  aliases: [`unmutevoice`, `unmvoice`, `umvoice`, `unmv`, `umv`],
  description: `Command to mute a unique mentioned user`,
  syntax: `--unmutev\` \`@user`,

  async execute(BOT, message, ARGS, DISCORD) {
    const USER = message.mentions.users.first();

    //Verifies if the user has permission to mute a member
    if (!message.member.hasPermission(`MUTE_MEMBERS`))
      return message.channel.send(
        `Sorry, but you don't have the permission to unmute members!`
      );

    //Verifies if the command caller mentioned a user in his message

    if (!USER) {
      return message.channel.send(
        `Please, inform a member (which is currently active in a voice chat) to be unmuted!\n**syntax:** \`${this.syntax}\``
      );
    }

    const MEMBER = message.guild.member(USER);

    if (!MEMBER) {
      return message.channel.send(
        "The user mentioned is currently not a member of this server!"
      );
    }

    MEMBER.voice.setMute(false).catch((err) => {
      message.channel.send(
        `Unmuting failed. Are you sure the mentioned user is currently in a voice chat?`
      );
    });
  },
};
