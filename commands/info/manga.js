'use strict';
const { RichEmbed } = require('discord.js');
const fetch = require('node-fetch');
const { reply, shorten } = require('../../functions.js');
const { stringify } = require('querystring');

const capitalize = s => s && s[0].toUpperCase() + s.slice(1);

module.exports = {
  name: 'manga',
  cooldown: 30,
  args: true,
  category: 'info',
  description: 'Get Manga Info',
  run: async (_, message, args) => {
    const query = stringify({ 'filter[text]': args.join(' ') });
    const res = await fetch(`https://kitsu.io/api/edge/manga?${query}`).catch(error => {
      console.error(error);
      return reply(message, 'Something Went Wrong');
    });
    const status = res.status;
    if (status === 200) {
      const { data } = await res.json();
      if (data.length) {
        const manga = data[0].attributes;
        const link = `https://kitsu.io/manga/${manga.slug}`;
        const footer = `${capitalize(manga.status)}・❤️ ${manga.popularityRank}・⭐ ${manga.ratingRank}`;
        const embed = new RichEmbed()
          .setTitle(manga.canonicalTitle)
          .setURL(link)
          .setThumbnail(manga.posterImage.original.replace(/\?.*/, ''))
          .setDescription(shorten(manga.synopsis))
          .setFooter(footer);
        return message.channel.send(embed);
      }
      return reply(message, 'Not Found');
    }
    return reply(message, 'Something Went Wrong');
  },
};
