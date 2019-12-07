'use strict';
const { RichEmbed } = require('discord.js');
const fetch = require('node-fetch');
const { reply } = require('../../functions.js');

module.exports = {
  name: 'catfacts',
  description: 'Cat\'s Fact',
  cooldown: 30,
  args: false,
  ch: ['581962707704741918'],
  category: 'info',
  run: async (_, message) => {
    const res = await fetch('https://catfact.ninja/fact/').catch(error => {
      console.error(error);
      return reply(message, 'Something Went Wrong');
    });
    const status = res.status;
    if (status === 200) {
      const { fact } = await res.json();
      const embed = new RichEmbed()
        .setTitle('Cat Facts')
        .setDescription(fact);
      if (message.channel.id === '581962707704741918') {
        return message.channel.send(embed);
      }
      const m = await message.channel.send(embed)
        .catch(error => {
          console.error(error);
          return reply(message, 'Something Went Wrong');
        });
      return m.delete(240000)
        .catch(error => {
          console.error(error);
          return reply(message, 'Something Went Wrong');
        });
    }
    return reply(message, 'Something Went Wrong');
  },
};
