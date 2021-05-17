module.exports = {
  name: `multipoll`,
  aliases: [`mpoll`, `mp`, `multip`],
  description: `This command creates a multiple-choice poll in the channel in which it is called.`,
  syntax: `--multipoll\` \`name / emoji1 / option1 / emoji2 / option2 [...]`,

  async execute(BOT, message, ARGS, DISCORD) {
    // STEP [00] - Creating functions

    function isEven(number) {
      if (number % 2 == 0) {
        return true;
      } else return false;
    }

    // STEP [01] - Receives the user's input and formats it adequately.

    let ARGSstr = ARGS.join(` `);
    let newArgs = ARGSstr.split(`/`);

    for (let i = 0; i < newArgs.length; i++) {
      newArgs[i] = newArgs[i].trim();
      if (newArgs[i] == ``) {
        newArgs[i] = `**[undefined]**`;
      }
    }

    const NEW_ARGS = newArgs;
    let ARGSsize = NEW_ARGS.length;

    // STEP [02] - Checks if there are sufficient arguments to make a multi-choice poll.

    if (ARGSsize < 5) {
      return message.channel.send(
        `Sorry, but there are insufficient arguments for me to make a poll.\nRemember: this command needs **at least** a name, two options and their respective emojis!\n**syntax:** \`${this.syntax}\``
      );
    }

    // STEP [03] - Creates a string for the user's better understanding of any possible errors and the MULTIPOLL_EMBED's title.

    let userDisplay = ``;

    let title = `${NEW_ARGS[0]}`;
    let indexODD = 0;
    let indexEVEN = 0;
    userDisplay += `**Your input:**\n\`title:\` ${title} `;

    if (!isEven(ARGSsize - 1)) {
      ARGSsize++;
    }

    for (let i = 1; i < ARGSsize; i++) {
      {
        if (!isEven(i)) {
          userDisplay += `**||** \`emoji${i - indexODD}:\` ${NEW_ARGS[i]} `;
          indexODD++;
        } else {
          if (NEW_ARGS[i] == undefined) {
            userDisplay += ` **-** \`option${
              i - indexEVEN - 1
            }:\` **[undefined]** `;
            indexEVEN++;
          } else {
            userDisplay += ` **-** \`option${i - indexEVEN - 1}:\` ${
              NEW_ARGS[i]
            } `;
            indexEVEN++;
          }
        }
      }
    }

    const ERROR_MESSAGE = `Please, check the syntax! Something is not in place!\nRemember: Use only discord's default emojis!\n**syntax:** \`--multipoll name option1 emoji1 option2 emoji2 [...]\`\n\n${userDisplay}`;

    if (NEW_ARGS[ARGSsize - 1] == undefined) {
      return message.channel.send(ERROR_MESSAGE);
    }

    // STEP [04] - Checks the syntax (is everything in its correct order?) and create the MULTIPOLL_EMBED's description string.

    let description = ``;

    for (let i = 1; i < ARGSsize; i++) {
      if (!isEven(i)) {
        if (/\p{Extended_Pictographic}/u.test(NEW_ARGS[i])) {
          // subSTEP [03a] - Checks for emojis if [i] is and ODD number.
          description += `${NEW_ARGS[i]} - `; // if it is, adds it adequately formatted to the description string.
        } else {
          return message.channel.send(
            // if it isn't, informs the user of the error and displays the received input.
            ERROR_MESSAGE
          );
        }
      } else {
        if (NEW_ARGS[i] == `**[undefined]**`)
          return message.channel.send(ERROR_MESSAGE);
        description += `\`${NEW_ARGS[i]}\`\n\n`;
      }
    }

    // STEP [05] - Checks if there aren't any duplicates;

    const DUPLICATES_WARNING = `Uh oh! Looks like we have some duplicates in our poll!\n\`Remember:\` **all emojis and options must be unique.**\n\n${userDisplay}`;

    for (let i = 1; i < ARGSsize; i++) {
      for (let ii = 1; ii < ARGSsize; ii++) {
        if (isEven(i) && isEven(ii)) {
          if (NEW_ARGS[i] == NEW_ARGS[ii] && i != ii) {
            return message.channel.send(DUPLICATES_WARNING);
          }
        } else if (!isEven(i) && !isEven(ii)) {
          if (NEW_ARGS[i] == NEW_ARGS[ii] && i != ii) {
            return message.channel.send(DUPLICATES_WARNING);
          }
        }
      }
    }

    // STEP [06] - Makes the EMBED message for the multiple choice poll.

    const MULTIPOLL_EMBED = new DISCORD.MessageEmbed()
      .setTitle(`Poll: \`${title}\``)
      .setColor(`BLURPLE`)
      .setDescription(description)
      .setFooter(`poll by ${message.author.tag}`);

    let embedMessage = await message.channel.send(MULTIPOLL_EMBED);

    for (let i = 1; i < ARGSsize; i++) {
      if (!isEven(i)) {
        await embedMessage.react(NEW_ARGS[i]);
      }
    }
  },
};
