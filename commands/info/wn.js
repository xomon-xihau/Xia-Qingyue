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
  name: 'wn',
  cooldown: 30,
  args: true,
  category: 'info',
  description: 'Get Novel Info',
  run: async (_, message, args) => {
    const query = stringify({ keywords: args.join(' ') });
    const res = await fetch(`https://www.webnovel.com/search?${query}`).catch(error => {
      console.error(error);
      return reply(message, 'Something Went Wrong');
    });
    const status = res.status;
    if (status === 200) {
      const html = await res.text();
      const $ = cheerio.load(html);
      const check = $('.result-books-container').find('p').first()
        .text()
        .trim();
      if (check === 'No results for your search.') {
        return reply(message, 'Not Found');
      }
      const link = $('a[data-report-eid="qi_A_bookcover"]').first().attr('href');
      const title = $('a[data-report-eid="qi_A_bookcover"] > strong').first().text()
        .trim();
      const img = $('a[data-report-eid="qi_A_bookcover"] > img').first().attr('src');
      const text = $('ul p[class="fs16 c_000 g_ells"]').first().text()
        .trim();
      const embed = new RichEmbed()
        .setTitle(title)
        .setURL(`http:${link}`)
        .setThumbnail(`http:${img.replace(/\?.*/, '')}`)
        .setDescription(shorten(text));
      return message.channel.send(embed);
    }
    return reply(message, 'Not Found');
  },
};
