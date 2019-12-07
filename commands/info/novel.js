'use strict';
const { RichEmbed } = require('discord.js');
const fetch = require('node-fetch');
const { reply, shorten } = require('../../functions.js');
const { stringify } = require('querystring');
const cheerio = require('cheerio');

module.exports = {
  name: 'novel',
  aliases: ['nu'],
  cooldown: 30,
  args: true,
  category: 'info',
  description: 'Get Novel Info',
  run: async (_, message, args) => {
    const query = stringify({ s: args.join(' ') });
    const res = await fetch(`https://www.novelupdates.com/?${query}`).catch(error => {
      console.error(error);
      return reply(message, 'Something Went Wrong');
    });
    const status = res.status;
    if (status === 200) {
      const html = await res.text();
      if (!html.match(/search_body_nu/)) {
        return reply(message, 'Not Found');
      }
      const $ = cheerio.load(html);
      const img = $('.search_img_nu').first().find('img')
        .attr('src');
      const title = $('.search_title').first().text()
        .trim();
      const link = $('.search_title').first().find('a')
        .attr('href');
      const text = $('.search_body_nu').clone().children()
        .remove()
        .end()
        .text()
        .trim();
      const stat = [];
      $('.search_stats').first().find('.ss_desk')
        .each((_index, elem) => {
          stat.push($(elem).text().trim());
        });
      const footer = stat.join('・');
      const embed = new RichEmbed()
        .setTitle(title)
        .setURL(link)
        .setThumbnail(img)
        .setDescription(shorten(text))
        .setFooter(footer);
      return message.channel.send(embed);
    }
    return reply(message, 'Not Found');
  },
};

