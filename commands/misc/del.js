'use strict';
const { reply } = require('../../functions.js');
module.exports = {
  name: 'del',
  description: 'delete message',
  usage: '[msg-id]',
  cooldown: 5,
  args: true,
  run: async (_, message, args) => {
    const perm = ['641307666089639947', '443823999529779201'];
    if (!perm.includes(message.author.id)) return;
    const m = await message.channel.fetchMessage(args[0])
      .catch(error => {
        console.error(error);
        return reply(message, 'Something Went Wrong');
      });
    m.delete()
      .catch(error => {
        console.error(error);
        return reply(message, 'Something Went Wrong');
      });
  },
};
