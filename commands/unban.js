module.exports = {
  name: `unban`,
  aliases: [`unb`, `ub`],
  description: `This command UNBANS a user from the server.`,
  syntax: `--unban\` \`userID reason`,

  // CODE BELOW THIS LINE

  execute(BOT, message, ARGS, DISCORD) {
    //  -----------------------------
    // [01] - Checking PERMISSION(s):

    if (!message.member.hasPermission(`BAN_MEMBERS`)) {
      return message.channel.send(
        `Sorry, but you do not have permission to unban members!`
      );
    }

    // -----------------------------
    // [02] - Variables and checking the list of banned members:

    let reason = ARGS.slice(1).join(` `);
    const UNBANNING_TARGET_ID = ARGS[0];

    message.guild.fetchBans().then((bans) => {
      if (bans.size == 0) {
        return message.channel.send(
          `There is no one currently banned in this server.`
        );
      }

      if (!ARGS[0]) {
        return message.channel.send(
          `Please specify a member to be unbanned!\n**syntax:** \`${this.syntax}\``
        );
      }
      // -----------------------------
      // [03] - Checking the syntax

      if (!reason) {
        reason = `No reason given`;
      }

      if (isNaN(ARGS[0])) {
        return message.channel.send(
          `The input ID is not a number!\n**syntax:** \`${this.syntax}\`\n\nTo get a user's ID, first go to \`settings > appearance > advanced\` and make sure you have \`developer mode\` active. Then, right click a user's name in discord and click \`copy ID\`.`
        );
      }

      // -----------------------------
      // [04] - Unbanning the target

      message.guild.fetchBans().then(async (bans) => {
        let bannedMember = bans.find(
          (bannedFinder) => bannedFinder.user.id == UNBANNING_TARGET_ID
        );
        if (!bannedMember) {
          return message.channel.send(
            `The user <@${UNBANNING_TARGET_ID}> is not currently banned.`
          );
        }

        await message.guild.members
          .unban(bannedMember.user, reason)
          .then(() => {
            try {
              message.channel.send(
                `The user <@${UNBANNING_TARGET_ID}> was successfully unbanned.`
              );
            } catch {
              message.channel.send(`I was unable to unban the user.`);
            }
          });
      });
    });
  },
};
