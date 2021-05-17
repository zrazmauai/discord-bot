module.exports = {
  name: `takerole`,
  aliases: [`tr`, `taker`, `trole`],
  description: `This command removes one or more existing roles from one or more users.`,
  syntax: `--takerole\` \`@user1 @user2 [...]\` \`/\` \`@role1 @role2 [...]\` **or** \`rolename1 / rolename2 / [...]`,

  // CODE BELOW THIS LINE

  execute(BOT, message, ARGS, DISCORD) {
    // STEP [00] - Checks if the command caller has the necessary permissions to manage the server's roles.
    if (!message.member.hasPermission(`MANAGE_ROLES`)) {
      return message.channel.send(
        `Sorry, but you do not have permission to manage roles!`
      );
    }

    // STEP [01] - Gets the user's input and formats it adequately.

    const FORMATTED_ARGS = formatARGS(ARGS);

    // STEP [02] - Makes sure the user hasn't left a field empty nor misplaced a "/".

    for (let i = 0; i < FORMATTED_ARGS.length; i++) {
      if (
        FORMATTED_ARGS[i] === `` ||
        FORMATTED_ARGS[i] === ` ` ||
        FORMATTED_ARGS[i] === null ||
        FORMATTED_ARGS[i] === undefined
      ) {
        return message.channel.send(
          `Sorry, but there seems to be something wrong! Make sure to follow the command's syntax correctly!\n**syntax:** \`${this.syntax}\`\n\n**note:**\n\`Make sure there are no empty spaces nor any misplaced "/" (forward-slashes).\``
        );
      }
    }

    // STEP [03] - Checks if the user has input either names or mentions.
    var rolesAre;
    var mentionedRole = message.mentions.roles.first();

    if (mentionedRole) {
      rolesAre = `mentioned`;
    } else {
      rolesAre = `named`;
    }

    // STEP [04] - Makes sure the user is properly following the command's syntax and adequately warns them of any error.

    if (!checkSyntaxRoles(FORMATTED_ARGS, rolesAre)) {
      return message.channel.send(
        `Sorry, but there seems to be something wrong! Make sure to follow the command's syntax correctly!\n**syntax:** \`${this.syntax}\`\n\n**note:** The "roles" field must either contain:\n\` • ONLY names (separated by forward-slashes); \`\n\` • ONLY mentions (unseparated).               \``
      );
    }

    if (!checkSyntaxUsers(FORMATTED_ARGS) && FORMATTED_ARGS.length > 1) {
      return message.channel.send(
        `Sorry, but there seems to be something wrong! Make sure to follow the command's syntax correctly!\n**syntax:** \`${this.syntax}\`\n\n**note:**\n\`The "users" field must contain ONLY user mentions!\``
      );
    }

    if (FORMATTED_ARGS.length < 2) {
      return message.channel.send(
        `Sorry, but there seems to be something wrong! Make sure to follow the command's syntax correctly!\n**syntax:** \`${this.syntax}\``
      );
    }

    // STEP [05] - Constructs the arrays of USERS and of ROLES objects according to the command caller's input.

    const USERS_ARRAY = message.mentions.users.array();
    const ROLES_ARRAY = [];

    if (rolesAre === `mentioned`) {
      message.mentions.roles
        .array()
        .forEach((element) => ROLES_ARRAY.push(element));
    }

    if (rolesAre === `named`) {
      var unrecognizedRoles = [];

      for (let i = 1; i < FORMATTED_ARGS.length; i++) {
        ROLES_ARRAY[i - 1] = message.guild.roles.cache.find(
          (role) =>
            role.name.toLowerCase() === FORMATTED_ARGS[i].trim().toLowerCase()
        );

        if (ROLES_ARRAY[i - 1] === undefined) {
          unrecognizedRoles.push(FORMATTED_ARGS[i].trim());
        }
      }
    }

    // STEP [06] - Makes sure there aren't any duplicates in the "users" field.

    let counter = 0;
    var userMentions = FORMATTED_ARGS[0].split(`<`);

    userMentions.shift();

    for (let i = 0; i < userMentions.length; i++) {
      userMentions[i] = formatID(userMentions[i].trim());
    }

    for (let i = 0; i < userMentions.length; i++) {
      for (let ii = 0; ii < userMentions.length; ii++) {
        if (userMentions[i] == userMentions[ii] && i != ii) {
          return message.channel.send(
            `Please, make sure there are no duplicate user mentions!`
          );
        }
      }
    }

    // STEP [07] - Makes sure there are no duplicates in the roles field.

    if (rolesAre === `mentioned`) {
      var roleMentions = FORMATTED_ARGS[1].split(`<`);
      roleMentions.shift();

      for (let i = 0; i < roleMentions.length; i++) {
        roleMentions[i] = formatID(roleMentions[i].trim());
      }

      for (let i = 0; i < roleMentions.length; i++) {
        for (let ii = 0; ii < roleMentions.length; ii++) {
          if (roleMentions[i] == roleMentions[ii] && i != ii) {
            return message.channel.send(
              `Please, make sure there are no duplicate role mentions!`
            );
          }
        }
      }
    }

    if (rolesAre === `named`) {
      var roleMentions = [];

      for (let i = 1; i < FORMATTED_ARGS.length; i++) {
        roleMentions[i - 1] = FORMATTED_ARGS[i];
      }

      for (let i = 0; i < roleMentions.length; i++) {
        for (let ii = 0; ii < roleMentions.length; ii++) {
          if (roleMentions[i] == roleMentions[ii] && i != ii) {
            return message.channel.send(
              `Please, make sure there are no duplicate role mentions!`
            );
          }
        }
      }
    }

    // STEP [08] - Makes sure all of the mentioned users are members of the server.

    var aintMember = false;
    var member;
    const MEMBERS_ARRAY = [];

    for (let i = 0; i < userMentions.length; i++) {
      member = message.guild.members.resolve(`${userMentions[i]}`);
      if (!member) {
        return message.channel.send(
          `Please, make sure all of the mentioned users are currently members of the server!`
        );
      } else {
        MEMBERS_ARRAY.push(member);
      }
    }

    // STEP [09] - Verifies if all the roles that were NAMED were FOUND

    if (rolesAre === `named`) {
      if (unrecognizedRoles.length != 0) {
        message.channel.send(`Sorry, but I couldn't find following role(s):\n`);

        unrecognizedRoles.forEach((element) => {
          message.channel.send(`\`• "${element}"\``);
        });

        return message.channel.send(
          `Please, make sure to write the roles' names correctly!`
        );
      }
    }

    // STEP [10] - If there is more than one role with the same name on the server, ask the user to tag them instead.

    message.guild.roles.fetch();
    const ROLES_CACHE = message.guild.roles.cache.array();

    if (rolesAre === `named`) {
      for (let i = 1; i < FORMATTED_ARGS.length; i++) {
        ROLES_CACHE.forEach((element) => {
          let givenNameQuantity = 0;
          if (
            element.name.trim().toLowerCase() ===
            FORMATTED_ARGS[i].trim().toLowerCase()
          ) {
            givenNameQuantity++;
          }

          if (givenNameQuantity > 1) {
            return message.channel.send(
              `I'm sorry, but at least one of the roles' names entered corresponds to **more than one** role!\nIn this case, please make sure to **mention** them instead!\n**like this:** \`@rolename\` **|| note:** Remember to **pay attention** to which one you're mentioning!`
            );
          }
        });
      }
    }

    // STEP [11] - If any of the roles are application-managed, alert the user.

    for (let i = 0; i < ROLES_ARRAY.length; i++) {
      if (ROLES_ARRAY[i].managed) {
        return message.channel.send(
          `I'm sorry, but it seems at least one of the specified roles is **managed by an external application** and therefore **cannot be removed from any user.**`
        );
      }
    }

    // STEP [12] - Adds the specified roles to the mentioned users and keeps track of any errors.

    ROLES_ARRAY.forEach((roleElement) => {
      message.channel.send(`**${roleElement.name}:**`);
      for (let i = 0; i < USERS_ARRAY.length; i++) {
        if (
          !roleElement.members.find((member) => member.user === USERS_ARRAY[i])
        ) {
          message.channel.send(
            `The user ${USERS_ARRAY[i]} does not have the role ${roleElement}.`
          );
        } else {
          MEMBERS_ARRAY[i].roles.remove(roleElement).catch();
          message.channel.send(
            `The user ${USERS_ARRAY[i]} has been successfully removed from the role ${roleElement}.`
          );
        }
      }
    });

    // APPENDIX A: Function library.

    function formatARGS(array) {
      // Takes the user's input and formats it adequately.
      let ARGSstring = array.join(` `);
      let newARGSarray = ARGSstring.split(`/`);

      for (let i = 0; i < newARGSarray.length; i++) {
        newARGSarray[i] = newARGSarray[i].trim();
      }
      return newARGSarray;
    }

    function checkSyntaxUsers(array) {
      const REGEX_MENTIONS_ONLY = new RegExp(/^(\s*(<@!\d{18}>)\s*)+$/gm);

      if (REGEX_MENTIONS_ONLY.test(array[0])) {
        return true;
      } else {
        return false;
      }
    }

    function checkSyntaxRoles(array, rolesAre) {
      const REGEX_MENTIONS_ONLY = new RegExp(/^(\s*(<@&\d{18}>)\s*)+$/gm);
      const ROLE_REGEX_MENTIONS_ANY = new RegExp(/(.*(<@&\d{18}>).*)+/);
      const USER_REGEX_MENTIONS_ANY = new RegExp(/(.*(<@!\d{18}>).*)+/);

      for (let i = 1; i < array.length; i++) {
        if (USER_REGEX_MENTIONS_ANY.test(array[i])) return false;
      }

      if (array.length > 2) {
        // If the array length is greater than 2, NO mentions should be found from the second (index 1) element onwards.
        for (let i = 1; i < array.length; i++) {
          if (ROLE_REGEX_MENTIONS_ANY.test(array[i])) {
            console.log(`a`);
            return false;
          }
        }
      }

      if (array.length == 2) {
        // If the command caller mentions a user, types "/" but doesn't input any value from there onwards.
        if (rolesAre === `named`) {
          if (array[1] === ``) {
            return false;
          }
        }

        if (rolesAre === `mentioned`) {
          // If the array length is equal to 2, either ONLY mentions should be found in the second element (index 1) or ONLY .
          if (!REGEX_MENTIONS_ONLY.test(array[1])) {
            return false;
          }
        }
      }

      // If none of those is any problem, return TRUE.
      return true;
    }

    function formatID(rawID) {
      // Takes the input ID and returns it in a the correct format for .fetch()
      let treatedID = rawID.slice(2, -1);
      return treatedID;
    }
  },
};
