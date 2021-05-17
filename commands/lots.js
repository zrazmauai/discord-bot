module.exports = {
  name: `lots`,
  aliases: [`l`],
  description: `This command selects a random member from amidst a pool. Tantamount to drawing lots.`,
  syntax: `--lots\` \`@user1 @user2 @user3 [...]`,

  // CODE BELOW THIS LINE

  execute(BOT, message, ARGS, DISCORD) {
    const SAMPLE_SIZE = message.mentions.members.size;

    switch (SAMPLE_SIZE) {
      case 0:
        return message.channel.send(
          `Please specify a list of members from which one's to be drawn!\n**syntax:** \`${this.syntax}\``
        );

      case 1:
        return message.channel.send(
          `Please specify at least **TWO** members!\n**syntax:** \`${this.syntax}\``
        );

      default:
        const ARRAY = message.mentions.members.array();

        var selectedUserIndex = Math.random() * SAMPLE_SIZE;
        if (selectedUserIndex - SAMPLE_SIZE >= 0.5) {
          selectedUserIndex = Math.ceil(selectedUserIndex);
        } else selectedUserIndex = Math.floor(selectedUserIndex);

        message.channel.send(
          `The chosen user was: ${ARRAY[selectedUserIndex]}`
        );

        break;
    }
  },
};
