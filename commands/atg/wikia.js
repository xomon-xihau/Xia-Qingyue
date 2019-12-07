'use strict';
const fetch = require('node-fetch');
const { reply } = require('../../functions.js');
const { stringify } = require('querystring');
const { RichEmbed } = require('discord.js');
const cheerio = require('cheerio');

module.exports = {
  name: 'wikia',
  aliases: ['wiki', 'aw', 'atgw'],
  cooldown: 30,
  args: true,
  description: 'Get Wikia link',
  usage: '[search]',
  run: async (_, message, args) => {
    const query = stringify({ query: args.join(' '), limit: 1 });
    const res = await fetch(`https://ni-tian-xie-shen-against-the-gods.fandom.com/api/v1/Search/List?${query}`)
      .catch(error => {
        console.error(error);
        return reply(message, 'Something Went Wrong');
      });
    const status = res.status;
    if (status === 200) {
      const json = await res.json()
        .catch(error => {
          console.error(error);
          return reply(message, 'Something Went Wrong');
        });
      const { items } = json;
      if (items.length) {
        const $ = cheerio.load(items[0].snippet);
        const embed = new RichEmbed()
          .setURL(items[0].url)
          .setTitle(items[0].title)
          .setDescription(`${$.text().trim()}...`);
        return message.channel.send(embed);
      }
      return reply(message, 'Not Found');
    }
    return reply(message, 'Something Went Wrong');
  },
};
