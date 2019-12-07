'use strict';
const { RichEmbed } = require('discord.js');
const fs = require('fs');
module.exports = {
  promptMessage: async (message, author, time, validReactions) => {
    // We put in the time as seconds, with this it's being transfered to MS
    time *= 1000;

    // For every emoji in the function parameters, react in the good order.
    // eslint-disable-next-line no-await-in-loop
    for (const reaction of validReactions) await message.react(reaction);

    // Only allow reactions from the author,
    // and the emoji must be in the array we provided.
    const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;

    // And ofcourse, await the reactions
    return message
      .awaitReactions(filter, { max: 1, time: time })
      .then(collected => collected.first() && collected.first().emoji.name);
  },
  qt: msg => `\`\`\`${msg}\`\`\``,
  reply: (message, text, field = {}) => {
    let embed = new RichEmbed()
      .setAuthor(message.author.username, message.author.avatarURL)
      .setDescription(text);
    if (Object.entries(field).length) {
      Object.keys(field).forEach(key => {
        embed.addField(key, field[key], true);
      });
    }
    return message.channel.send(embed)
      .then(msg => msg.delete(20000))
      .catch(err => console.error(err));
  },
  // eslint-disable-next-line require-await
  readFile: async path => new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  }),
  shorten: (text, maxLen = 100) => text.length > maxLen ? `${text.substr(0, maxLen - 3)}...` : text,
};
