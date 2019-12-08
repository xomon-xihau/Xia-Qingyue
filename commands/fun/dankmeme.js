'use strict';
const fetch = require('node-fetch');
const { reply } = require('../../functions.js');

module.exports = {
  name: 'dankmeme',
  args: false,
  category: 'fun',
  cooldown: 60,
  description: 'Get Random Meme from /r/dank_meme',
  usage: 'dankmeme',
  run: async (_, message) => {
    if(message.channel.id === '564559476510949386') {
      return reply(`This command can be use only in <#${message.channel.id}`);
    }
    const res = await fetch('https://www.reddit.com/r/dank_meme.json')
      .catch(error => {
        console.error(error);
        return reply(message, 'Something Went Wrong');
      });

    const status = res.status;
    console.log(status);
    if (status === 200) {
      const { data } = await res.json()
        .catch(error => {
          console.error(error);
          return reply(message, 'Something Went Wrong');
        });
      const child = data.children;
      const post = child[Math.floor(Math.random() * child.length)];
      const meme = post.data.url;
      return message.channel.send({ files: [meme] });
    }
    return reply(message, 'Something Went Wrong');
  },
};
