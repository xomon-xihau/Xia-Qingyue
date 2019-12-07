'use strict';
const { RichEmbed } = require('discord.js');

const myArray = ['Yes', 'No'];

const capitalize = s => s && s[0].toUpperCase() + s.slice(1);

module.exports = {
  name: 'yesorno',
  aliases: ['yn'],
  args: true,
  category: 'fun',
  cooldown: 60,
  description: 'Answer randomly in Yes or No',
  usage: '[question]',
  run: (client, message, args) => {
    // Get question
    let qs = args.join(' ').replace(/<.*>/, '');
    // Captalize first letter of question
    if (qs.match(/^[a-z]/)) {
      qs = capitalize(qs);
    }
    // Add ? mark
    if (qs.slice(-1) !== '?') {
      qs = `${qs}?`;
    }
    // Generate answer
    const ans = myArray[Math.floor(Math.random() * myArray.length)];
    // Send question with answer
    const embed = new RichEmbed()
      .setAuthor(qs, message.author.avatarURL)
      .setFooter(ans, client.user.displayAvatarURL);
    return message.channel.send(embed);
  },
};
