'use strict';
module.exports = {
  name: 'mtime',
  aliases: ['time'],
  category: 'info',
  cooldown: 10,
  description: 'Returns Shanghai\'s time',
  usage: 'mtime',
  run: (_, message) => {
    const date = new Date();
    const time = date.toLocaleTimeString('en-US', { timeZone: 'Asia/Shanghai' });
    return message.channel.send(time);
  },
};
