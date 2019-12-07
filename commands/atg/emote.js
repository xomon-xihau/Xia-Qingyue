'use strict';
const { reply, readFile } = require('../../functions.js');
module.exports = {
  name: 'emote',
  aliases: ['em', 'emt'],
  args: true,
  cooldown: 60,
  category: 'atg',
  description: 'Emotes',
  usage: '[emote]',
  run: async (_, message, args) => {
    let data = await readFile('./json_files/emote.json')
      .catch(error => {
        console.error(error);
        return reply(message, 'Something Went Wrong');
      });

    data = JSON.parse(data);
    if (typeof data[args[0]] !== 'undefined') {
      const m = await message.channel.send({ files: [data[args[0]]] })
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
    const field = {
      'Available arguments': Object.keys(data).join('・'),
      Cooldown: `${module.exports.cooldown} second(s)`,
    };
    return reply(message, 'There is no such args', field);
  },
};
