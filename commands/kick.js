module.exports = {
  name: `kick`,
  aliases: [`k`],
  description: `This command KICKS a user from the server.`,
  syntax: `--kick\` \`@user reason`,

  // CODE BELOW THIS LINE

  execute(BOT, message, ARGS, DISCORD) {
    // STEP [01] - Getting the kicking target.
    const KICKING_TARGET = message.mentions.users.first();

    // STEP [02] - Checking the user's permission(s).
    if (!message.member.hasPermission(`KICK_MEMBERS`))
      return message.channel.send(
        `Sorry, but you do not have permission to kick members!`
      );

    // STEP [03] - Checking the target's validity.
    if (!ARGS[0]) {
      return message.channel.send(
        `Please specify a member to be kicked!\n**syntax:** \`${this.syntax}\``
      );
    }

    if (!KICKING_TARGET) {
      return message.channel.send(
        `The specified user isn't valid and/or is not in the server!\n**syntax:** \`${this.syntax}\``
      );
    }

    // STEP [04] - Checking the target's permission(s) and solving permission conflict(s).
    let targetHasAdmin = message.guild
      .member(KICKING_TARGET)
      .hasPermission(`ADMINISTRATOR`);

    let targetHasKick = message.guild
      .member(KICKING_TARGET)
      .hasPermission(`KICK_MEMBERS`);

    if (targetHasAdmin) {
      return message.channel.send(
        `I do not have permission to kick this member!`
      );
    }

    if (!message.member.hasPermission(`ADMINISTRATOR`) && targetHasKick) {
      return message.channel.send(
        `You do not have permission to kick this member!`
      );
    }

    // STEP [05] - Getting things ready for kicking the target.
    let reason = ARGS.slice(1).join(` `);
    if (!reason) {
      reason = `No reason given`;
    }

    const KICKING_TARGET_ID = message.guild.members.cache.get(
      KICKING_TARGET.id
    );

    const KICKED_EMBED = new DISCORD.MessageEmbed()
      .setColor(`#a01a40`)
      .setTitle(`\`NOTICE: YOU HAVE BEEN KICKED\``)
      .setDescription(
        `You have been **KICKED** from **${message.guild.name}**.\n`
      )
      .addFields({
        name: `\`REASON:\``,
        value: `\`${reason.toUpperCase()}​\``,
      })
      .setFooter(
        `Make sure to follow them rules next time, bucko!`,
        `https://cdn.discordapp.com/avatars/824583769255051274/3482cdf346348b2be93ea9e7c575bdac.png?size=256`
      );

    // STEP [06] - Building the asynchronous KICK function.

    const KICK = async (
      BOT,
      message,
      ARGS,
      DISCORD,
      KICKING_TARGET_ID,
      reason,
      KICKED_EMBED
    ) => {
      try {
        await KICKING_TARGET_ID.kick(reason);
        message.channel.send(
          `The user ${KICKING_TARGET_ID} was succesfully **KICKED**.`
        );

        try {
          await KICKING_TARGET_ID.send(KICKED_EMBED);
          message.channel.send(
            `\`[UPDATE]: The user has been successfully informed of their kicking.\``
          );
        } catch (err) {
          message.channel.send(
            `\`[UPDATE]: I was unable to inform the user of their kicking.\``
          );
        }
      } catch (err) {
        message.channel.send(
          `I was unable to kick ${KICKING_TARGET_ID}.\nMake sure my role is in a higher position than theirs.`
        );
      }
    };

    // STEP [07] - Kicking the target.
    KICK(BOT, message, ARGS, DISCORD, KICKING_TARGET_ID, reason, KICKED_EMBED);
  },
};
