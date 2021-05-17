module.exports = {
  name: `delrole`,
  aliases: [`-r`, `dr`, `delr`, `-role`],
  description: `This command deletes a specified role (one at a time!).`,
  syntax: `--delrole\` \`rolename\` **or** \`@role`,

  execute(BOT, message, ARGS, DISCORD) {
    // STEP [00] - Checks if the command caller has permission to manage roles.
    if (!message.member.hasPermission(`MANAGE_ROLES`)) {
      return message.channel.send(
        `Sorry, but you do not have permission to delete roles!`
      );
    }

    // STEP [01] - Checks if the user has specified at least one role.
    if (ARGS.length == 0) {
      return message.channel.send(
        `Please, specify a role to be deleted!\n**syntax:** \`${this.syntax}\``
      );
    }

    // STEP [02] - Checks if the user has either MENTIONED or NAMED a role.
    var roleIs;
    var mentionedRole = message.mentions.roles.first();

    if (mentionedRole) {
      roleIs = `mentioned`;
    } else {
      roleIs = `named`;
    }

    // STEP [02] - Formats the user's input adequately.

    if (roleIs == `mentioned`) {
      const REGEX_UNIQUE_MENTION = new RegExp(/^(<@&\d{18}>)$/);
      if (ARGS.length >= 1) {
        ARGS[0] = ARGS[0].trim();
        if (!REGEX_UNIQUE_MENTION.test(ARGS.join(``))) {
          // If there isn't ONLY one unique ROLE ID.
          return message.channel.send(
            `Please, make sure to follow the command's syntax carefully!\n**syntax:** \`${this.syntax}\``
          );
        }
      }
    }

    if (roleIs === `named`) {
      var roleName = ARGS.join(` `).trim();
    }

    // STEP [03] - Checks if there is a corresponding role and deletes it

    if (roleIs === `mentioned`) {
      let role = mentionedRole;
      const ROLE_NAME = role.name;
      if (role.managed) {
        return message.channel.send(
          `I'm sorry, but the ${role} is **managed by an external application**, therefore **I cannot delete it**.`
        );
      } else {
        role.delete();
        return message.channel.send(`The role \`"${ROLE_NAME}"\` was deleted!`);
      }
    }

    if (roleIs === `named`) {
      let role = message.guild.roles.cache.find(
        (role) => role.name.toLowerCase() === roleName.toLowerCase()
      );
      if (role === undefined) {
        message.channel.send(
          `I'm sorry, but I wasn't able to find the \`"${roleName}"\` role.\nIn any case, make sure you're getting the command's syntax right!\n**syntax:** \`${this.syntax}\``
        );
      } else {
        const ROLE_NAME = role.name;
        if (role.managed) {
          return message.channel.send(
            `I'm sorry, but the ${role} is **managed by an external application**, therefore **I cannot delete it**.`
          );
        } else {
          role.delete();
          return message.channel.send(
            `The role \`"${ROLE_NAME}"\` was deleted!`
          );
        }
      }
    }
  },
};
