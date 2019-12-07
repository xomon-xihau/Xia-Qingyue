'use strict';
const { exec } = require('child_process');
const { RichEmbed } = require('discord.js');
module.exports = {
  name: 'ghostping',
  description: 'Get who ghost pinged u recently',
  cooldown: 30,
  run: async (_, message) => {
    await exec(`grep '<@${message.author.id}>' message.txt | tail -n 1`, (err, stdout) => {
      if (err) return console.log(err);
      if (stdout) {
        const data = stdout.split('・・');
        const exampleEmbed = new RichEmbed()
          .setColor('#002733')
          .setAuthor(message.author.username, message.author.avatarURL)
          .addField('Message', data[0])
          .addField('Name with Tag', data[1])
          .addField('ID', data[2])
          .addField('Date', data[3]);
        return message.channel.send({ embed: exampleEmbed })
          .then(msg => msg.delete(40000))
          .catch(error => console.error(error));
      } else {
        return message.reply('No data found.')
          .then(msg => msg.delete(40000))
          .catch(error => console.error(error));
      }
    });
  },
};
