module.exports = {
  name: `addrole`,
  aliases: [`+r`, `ar`, `addr`, `+role`],
  description: `This command adds one or multiple roles to the server.`,
  syntax: `--addrole\` \`rolename / rolename / [...]`,

  execute(BOT, message, ARGS, DISCORD) {
    // STEP [00] - Checks if the command caller has permission to manage roles.
    if (!message.member.hasPermission(`MANAGE_ROLES`)) {
      return message.channel.send(
        `Sorry, but you do not have permission to create roles!`
      );
    }

    // STEP [01] - Receives user's input and formats it adequately.
    let ARGSstr = ARGS.join(` `);
    let rolesArray = ARGSstr.split(`/`);

    for (let i = 0; i < rolesArray.length; i++) {
      rolesArray[i] = rolesArray[i].trim();
    }

    // STEP [02] - Checks if the user has input AT LEAST one role.
    if (ARGS.length === 0) {
      return message.channel.send(
        `Please, name at least one role that is to be created!\n**syntax:** \`${this.syntax}\``
      );
    }

    // STEP [03] - Creates the roles with the specified names.
    for (let i = 0; i < rolesArray.length; i++) {
      if (rolesArray[i] !== ``) {
        message.guild.roles
          .create({
            data: {
              name: rolesArray[i],
            },
          })
          .then((role) =>
            message.channel.send(
              `The role \`"${rolesArray[i]}"\` has been succesfully created.`
            )
          )
          .catch((err) => message.channel.send(err));
      }
    }
  },
};
