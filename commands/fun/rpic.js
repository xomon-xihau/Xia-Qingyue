'use strict';
const { RichEmbed } = require('discord.js');
const fetch = require('node-fetch');
const { reply } = require('../../functions.js');

const pics = {
  neko: '',
  kiss: 'kissed',
  hug: 'hugged',
  pat: 'patted',
  cuddle: '',
  tickle: '',
  poke: 'poked',
  slap: 'slapped',
  smug: '',
  feed: '',
  baka: '',
  fox_girl: '',
  wallpaper: '',
};

module.exports = {
  name: 'rpic',
  aliases: ['rp'],
  args: true,
  category: 'fun',
  cooldown: 60,
  description: 'Get Random Pics',
  usage: '[args]',
  run: async (_, message, args) => {
    if (args[0] in pics) {
      const res = await fetch(`https://nekos.life/api/v2/img/${args[0]}`)
        .catch(error => {
          console.error(error);
          return reply(message, 'Something Went Wrong');
        });

      const status = res.status;
      if (status === 200) {
        const { url } = await res.json()
          .catch(error => {
            console.error(error);
            return reply(message, 'Something Went Wrong');
          });
        if (url !== undefined) {
          if (args[1] !== undefined && pics[args[0]] !== '') {
            const embed = new RichEmbed()
              .setImage(url);
            embed.setDescription(`${message.author.username} ${pics[args[0]]} ${args[1]}`);
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
          const m = await message.channel.send({ files: [url] })
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
      }
      return reply(message, 'Something Went Wrong');
    }
    const field = {
      'Available arguments': Object.keys(pics).join('・'),
      Cooldown: `${module.exports.cooldown} second(s)`,
    };
    return reply(message, 'There is no such args', field);
  },
};
