module.exports = {
  name: `stats`,
  aliases: [`stts`],
  description: `This command displays the server's data.`,
  syntax: `--stats`,

  execute(BOT, message, ARGS, DISCORD) {
    //necessario instalar a biblioteca "dateformat".

    let dateformat = require("dateformat");

    // começo coletando algumas informações e armazenando elas em variaveis para depois montar a mensagem que sera enviada.
    let icon = message.guild.iconURL({ size: 2048 }); // foto do servidor

    let region = {
      // identifico a possivel região do servidor
      brazil: "Brazil",
      "eu-central": "Central Europe",
      singapore: "Singapore",
      london: "London",
      russia: "Russia",
      japan: "Japan",
      hongkong: "Hongkong",
      sydney: "Sydney",
      "us-central": "U.S. Central",
      "us-east": "U.S. East",
      "us-south": "U.S. South",
      "us-west": "U.S. West",
      "eu-west": "Western Europe",
    };

    // Membros
    let member = message.guild.members;
    let offline = member.cache.filter(
        (m) => m.user.presence.status === "offline"
      ).size, //quantidade de membros offline
      online = member.cache.filter((m) => m.user.presence.status === "online")
        .size, // quantidade de membros online
      robot = member.cache.filter((m) => m.user.bot).size, //quantidade de bots
      total = message.guild.memberCount; //total de membros

    // Canais
    let channels = message.guild.channels;
    let text = channels.cache.filter((r) => r.type === "text").size, //quantidade de canais de texto
      vc = channels.cache.filter((r) => r.type === "voice").size, //quantidade de canais de voz
      category = channels.cache.filter((r) => r.type === "category").size, //quantidade de categorias
      totalchan = channels.cache.size; //total de canais

    // Região
    let location = region[message.guild.region]; //região do servidor armazenada em uma variavel

    // Data
    let x = Date.now() - message.guild.createdAt; // "Date.now()" me da um valor em mile segundos, subtraio pela data de criação
    let h = Math.floor(x / 86400000); // converto o valor de x em mile segundos para dias por isso divido por 86400000
    let created = dateformat(message.guild.createdAt); // data em que foi criado o servidor

    // Onde a mensagem e montada
    const embed = new DISCORD.MessageEmbed()
      .setColor(`BLURPLE`) // corzinha da caixa de mensagem
      .setTimestamp(new Date()) // formato de hora
      .setThumbnail(icon) // mostro na mensagem o icone do servidor.
      .setTitle(message.guild.name, icon)
      .addField("ID:", `\`${message.guild.id}\``) // mostra o ID do servidor
      .addField("Region:", location) // mostra a região do servidor
      .addField("Date Created:", `${created} \n- **${h}** day(s) ago`) // mostra a data de criação do servidor e a quanto tempo ele existe
      .addField("Owner:", `\`${message.guild.owner.user.tag}\``) // mostra o dono do servidor
      .addField(
        `Members - [${total}]`,
        `Online: ${online} \nOffline: ${offline} \nBots: ${robot}`
      ) //mostra alguns dados sobre os membros
      .addField(
        `Channels - [${totalchan}]`,
        `Text: ${text} \nVoice: ${vc} \nCategories: ${category}`
      ); //mostra alguns dados sobre os canais
    message.channel.send(embed);
  },
};
