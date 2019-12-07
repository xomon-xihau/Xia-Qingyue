'use strict';
const { reply } = require('../../functions.js');
module.exports = {
  name: 'mtime',
  aliases: ['time'],
  category: 'info',
  cooldown: 10,
  description: 'Returns Shanghai\'s time',
  usage: 'mtime',
  run: async (_, message) => {
    const date = new Date();
    const time = date.toLocaleTimeString('en-US', { timeZone: 'Asia/Shanghai' });
    const msg = await message.channel.send(time).catch(error => {
      console.error(error);
      return reply(message, 'Something Went Wrong');
    });
    msg.delete(10000).catch(error => {
      console.error(error);
      return reply(message, 'Something Went Wrong');
    });
  },
};
