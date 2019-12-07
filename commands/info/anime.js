'use strict';
const { RichEmbed } = require('discord.js');
const fetch = require('node-fetch');
const { reply, shorten } = require('../../functions.js');
const { stringify } = require('querystring');

const capitalize = s => s && s[0].toUpperCase() + s.slice(1);

module.exports = {
  name: 'anime',
  aliases: ['kitsu'],
  cooldown: 30,
  args: true,
  category: 'info',
  description: 'Get Anime Info',
  run: async (_, message, args) => {
    const query = stringify({ 'filter[text]': args.join(' ') });
    const res = await fetch(`https://kitsu.io/api/edge/anime?${query}`).catch(error => {
      console.error(error);
      return reply(message, 'Something Went Wrong');
    });
    const status = res.status;
    if (status === 200) {
      const { data } = await res.json();
      if (data.length) {
        const anime = data[0].attributes;
        const link = `https://kitsu.io/anime/${anime.slug}`;
        // eslint-disable-next-line max-len
        const footer = `${capitalize(anime.status)}・${anime.episodeCount} ep(s)・❤️ ${anime.popularityRank}・⭐ ${anime.ratingRank}`;
        const embed = new RichEmbed()
          .setTitle(anime.canonicalTitle)
          .setURL(link)
          .setThumbnail(anime.posterImage.original.replace(/\?.*/, ''))
          .setDescription(shorten(anime.synopsis))
          .setFooter(footer);
        if (message.channel.id === '562804349831741481') {
          return message.channel.send(embed);
        }
        return message.channel.send(embed);
      }
      return reply(message, 'Not Found');
    }
    return reply(message, 'Something Went Wrong');
  },
};
