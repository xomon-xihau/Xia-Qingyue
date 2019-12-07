'use strict';
const { reply, readFile } = require('../../functions.js');
module.exports = {
  name: 'atgp',
  aliases: ['ap'],
  args: true,
  cooldown: 60,
  category: 'fun',
  description: 'ATG Pics',
  usage: '[pic]',
  run: async (_, message, args) => {
    let data = await readFile('./json_files/atgp.json')
      .catch(error => {
        console.error(error);
        return reply(message, 'Something Went Wrong');
      });

    data = JSON.parse(data);
    let randomItem = false;
    if (typeof data[args[0]] !== 'undefined') {
      const myArray = data[args[0]];
      if (args.length > 1 && !isNaN(args[1]) && args[1] <= myArray.length && args[1] > 0) {
        randomItem = myArray[Math.floor(args[1]) - 1];
      }
      if (!randomItem) {
        randomItem = myArray[Math.floor(Math.random() * myArray.length)];
      }
      const m = await message.channel.send({ files: [randomItem] })
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
