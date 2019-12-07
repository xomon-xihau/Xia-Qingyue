'use strict';
const { reply } = require('../../functions.js');
module.exports = {
  name: 'help',
  description: 'Help Section',
  usage: 'help',
  cooldown: 30,
  run: async (_, message) => {
    const m = await message.channel.send('<https://pastebin.com/d7ZEM4EM>')
      .catch(error => {
        console.error(error);
        return reply(message, 'Something Went Wrong');
      });
    return m.delete(240000)
      .catch(error => {
        console.error(error);
        return reply(message, 'Something Went Wrong');
      });
  },
};
