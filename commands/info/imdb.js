'use strict';
const { RichEmbed } = require('discord.js');
const fetch = require('node-fetch');
const { reply, shorten } = require('../../functions.js');
const { stringify } = require('querystring');
const cheerio = require('cheerio');

if (!String.prototype.replaceLast) {
  // eslint-disable-next-line func-names
  String.prototype.replaceLast = function(find, replace) {
    const index = this.lastIndexOf(find);
    if (index >= 0) {
      return this.substring(0, index) + replace + this.substring(index + find.length);
    }
    return this.toString();
  };
}

module.exports = {
  name: 'imdb',
  aliases: ['movie'],
  cooldown: 30,
  args: true,
  category: 'info',
  description: 'Get Movie Info',
  run: async (_, message, args) => {
    const query = stringify({ q: args.join(' ') });
    let res = await fetch(`https://www.imdb.com/find?${query}`).catch(error => {
      console.error(error);
      return reply(message, 'Something Went Wrong');
    });
    let status = res.status;
    if (status === 200) {
      let html = await res.text();
      let $ = cheerio.load(html);
      const link = $('.findList').find('a').first()
        .attr('href');
      if (link) {
        res = await fetch(`https://www.imdb.com${link}`).catch(error => {
          console.error(error);
          return reply(message, 'Something Went Wrong');
        });
        status = res.status;
        if (status === 200) {
          html = await res.text();
          $ = cheerio.load(html);
          const title = $('.title_wrapper').find('h1').text()
            .trim();
          const img = $('.poster').find('img').attr('src');
          const text = $('.summary_text').text()
            .trim();
          const rating = $('.ratingValue').find('strong').attr('title')
            .trim();
          const embed = new RichEmbed()
            .setTitle(title)
            .setURL(`https://www.imdb.com${link}`)
            .setDescription(shorten(text))
            .setFooter(`IMDb: ⭐ ${rating}`);
          if (img) {
            embed.setThumbnail(img);
          }
          if (message.channel.id === '564972484152262656') {
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
        return reply(message, 'Not Found');
      }
      return reply(message, 'Not Found');
    }
    return reply(message, 'Something Went Wrong');
  },
};
