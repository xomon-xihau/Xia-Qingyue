'use strict';
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const { reply } = require('../../functions.js');

module.exports = {
  name: 'ab',
  args: true,
  cooldown: 30,
  category: 'atg',
  description: 'Get abbreviations',
  usage: '[string]',
  run: async (_, message, args) => {
    const res = await fetch('https://ni-tian-xie-shen-against-the-gods.fandom.com/wiki/Against_the_Gods_Wiki:Data');
    const status = res.status;
    if (status === 200) {
      const html = await res.text()
        .catch(error => {
          console.error(error);
          return reply(message, 'Something Went Wrong');
        });
      const arg = args[0].trim().toUpperCase();
      const $ = cheerio.load(html);
      let val = false;
      $('td').each((_index, elem) => {
        if ($(elem).text().trim() === arg) {
          val = $(elem).next('td').text()
            .trim();
          return false;
        }
        return true;
      });
      if (val) {
        return message.channel.send(val);
      }
      return reply(message, 'Not Found');
    }
    return reply(message, 'Something Went Wrong');
  },
};
