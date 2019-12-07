'use strict';
const { config } = require('dotenv');
config({
  path: `${__dirname}/.env`,
});

const omdb = process.env.OMDB;
const { RichEmbed } = require('discord.js');
const fetch = require('node-fetch');
const { reply, shorten } = require('../../functions.js');
const { stringify } = require('querystring');

const capitalize = s => s && s[0].toUpperCase() + s.slice(1);

module.exports = {
  name: 'omdb',
  aliases: ['movie'],
  cooldown: 30,
  args: true,
  ch: ['564972484152262656'],
  category: 'info',
  description: 'Get Movie Info',
  run: async (_, message, args) => {
    const query = stringify({ t: args.join(' '), apikey: omdb });
    const res = await fetch(`http://www.omdbapi.com/?${query}`).catch(error => {
      console.error(error);
      return reply(message, 'Something Went Wrong');
    });
    const status = res.status;
    if (status === 200) {
      const data = await res.json();
      if (data.Response !== 'False') {
        const link = `https://www.imdb.com/title/${data.imdbID}`;
        const footer = `${capitalize(data.Type)}・⭐ ${data.imdbRating}・🗳️ ${data.imdbVotes}`;
        const embed = new RichEmbed()
          .setTitle(data.Title)
          .setURL(link)
          .setDescription(shorten(data.Plot))
          .setFooter(footer);
        if (data.Poster !== 'N/A') {
          embed.setThumbnail(data.Poster);
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
    return reply(message, 'Something Went Wrong');
  },
};
