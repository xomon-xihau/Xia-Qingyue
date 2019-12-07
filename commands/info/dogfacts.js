'use strict';
const { RichEmbed } = require('discord.js');
const fetch = require('node-fetch');
const { reply } = require('../../functions.js');

module.exports = {
  name: 'dogfacts',
  description: 'Dog\'s Fact',
  cooldown: 30,
  args: false,
  category: 'info',
  run: async (_, message) => {
    const res = await fetch('https://dog-api.kinduff.com/api/facts').catch(error => {
      console.error(error);
      return reply(message, 'Something Went Wrong');
    });
    const status = res.status;
    if (status === 200) {
      const { facts } = await res.json();
      const embed = new RichEmbed()
        .setTitle('Dog Facts')
        .setDescription(facts[0]);
      return message.channel.send(embed);
    }
    return reply(message, 'Something Went Wrong');
  },
};
