module.exports = {
  name: `ban`,
  aliases: [`b`],
  description: `This command BANS a user from the server.`,
  syntax: `--ban\` \`@user reason`,

  // CODE BELOW THIS LINE

  execute(BOT, message, ARGS, DISCORD) {
    // STEP [01] - Getting the banning target.
    const BANNING_TARGET = message.mentions.users.first();

    // STEP [02] - Checking the user's permission(s).
    if (!message.member.hasPermission(`BAN_MEMBERS`))
      return message.channel.send(
        `Sorry, but you do not have permission to ban members!`
      );

    // STEP [03] - Checking the banning target's validity.
    if (!ARGS[0]) {
      return message.channel.send(
        `Please specify a member to be banned!\n**syntax:** \`${this.syntax}\``
      );
    }

    if (!BANNING_TARGET) {
      return message.channel.send(
        `The specified user isn't valid and/or is not in the server!\n**syntax:** \`${this.syntax}\``
      );
    }

    // STEP [04] - Checking the banning target's permission(s) and solving permission conflict(s).
    let targetHasAdmin = message.guild
      .member(BANNING_TARGET)
      .hasPermission(`ADMINISTRATOR`);

    let targetHasBan = message.guild
      .member(BANNING_TARGET)
      .hasPermission(`BAN_MEMBERS`);

    if (targetHasAdmin) {
      return message.channel.send(
        `I do not have permission to kick this member!`
      );
    }

    if (!message.member.hasPermission(`ADMINISTRATOR`) && targetHasBan) {
      return message.channel.send(
        `You do not have permission to kick this member!`
      );
    }

    // STEP [05] - Getting things ready for banning the target.
    let reason = ARGS.slice(1).join(` `);
    if (!reason) {
      reason = `No reason given`;
    }

    const BANNING_TARGET_ID = message.guild.members.cache.get(
      BANNING_TARGET.id
    );

    const BANNED_EMBED = new DISCORD.MessageEmbed()
      .setColor(`#a01a40`)
      .setTitle(`\`NOTICE: YOU HAVE BEEN BANNED\``)
      .setDescription(
        `You have been indefinitely **BANNED** from the channel **${message.guild.name}**.`
      )
      .addFields({
        name: `REASON:`,
        value: `\`${reason.toUpperCase()}​\``,
      })
      .setFooter(
        `Please note that it is impossible for me to inform you of any future unbanning.`,
        `https://cdn.discordapp.com/avatars/824583769255051274/3482cdf346348b2be93ea9e7c575bdac.png?size=256`
      );

    // STEP [06] - Building the asynchronous BAN function

    const BAN = async (
      BOT,
      message,
      ARGS,
      DISCORD,
      BANNING_TARGET_ID,
      reason,
      BANNED_EMBED
    ) => {
      try {
        await BANNING_TARGET_ID.ban({ reason: reason });
        message.channel.send(
          `The user ${BANNING_TARGET_ID} was succesfully **BANNED**.`
        );

        try {
          await BANNING_TARGET_ID.send(BANNED_EMBED);
          message.channel.send(
            `\`[UPDATE]: The user has been successfully informed of their ban.\``
          );
        } catch (err) {
          message.channel.send(
            `\`[UPDATE]: I was unable to inform the user of their ban.\``
          );
        } finally {
          message.channel.send(
            `\`[NOTE]: It is impossible for me to inform the user of any eventual unbanning.\``
          );
        }
      } catch (err) {
        message.channel.send(
          `I was unable to ban ${BANNING_TARGET_ID}.\nMake sure my role is in a higher position than theirs.`
        );
      }
    };

    // STEP [07] - Banning the target.
    BAN(BOT, message, ARGS, DISCORD, BANNING_TARGET_ID, reason, BANNED_EMBED);
  },
};
