'use strict';
const { config } = require('dotenv');
config({
  path: `${__dirname}/.env`,
});

const yandex = process.env.YANDEX;
const { RichEmbed } = require('discord.js');
const fetch = require('node-fetch');
const { reply } = require('../../functions.js');
const { stringify } = require('querystring');

module.exports = {
  name: 'ytl',
  description: 'Translate text to english',
  cooldown: 60,
  args: false,
  category: 'info',
  run: async (_, message, args) => {
    const query = stringify({ key: yandex, text: args.join(' ') });
    const res = await fetch(`https://translate.yandex.net/api/v1.5/tr.json/translate?lang=en&${query}`).catch(error => {
      console.error(error);
      return reply(message, 'Something Went Wrong');
    });
    const status = res.status;
    if (status === 200) {
      const { text } = await res.json();
      const embed = new RichEmbed()
        .setAuthor(message.author.username, message.author.avatarURL)
        .setDescription(text);
      const m = await message.channel.send(embed)
        .catch(error => {
          console.error(error);
          return reply(message, 'Something Went Wrong');
        });
      return m.delete(120000)
        .catch(error => {
          console.error(error);
          return reply(message, 'Something Went Wrong');
        });
    }
    return reply(message, 'Something Went Wrong');
  },
};
