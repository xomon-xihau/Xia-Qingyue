'use strict';
const { RichEmbed } = require('discord.js');
const { promptMessage, reply } = require('../../functions.js');

const chooseArr = ['🗻', '📰', '✂'];

const getResult = (me, user) => {
  if (
    (me === '🗻' && user === '✂') ||
    (me === '📰' && user === '🗻') ||
    (me === '✂' && user === '📰')
  ) {
    return 'You won!';
  } else if (me === user) {
    return "It's a tie!";
  } else {
    return 'You lost!';
  }
};

module.exports = {
  name: 'rps',
  category: 'fun',
  cooldown: 60,
  description: 'Rock Paper Scissors game. React to one of the emojis to play the game.',
  usage: 'rps',
  run: async (client, message) => {
    // Send game instruction
    const embed = new RichEmbed()
      .setAuthor(message.author.username, message.author.avatarURL)
      .setFooter(message.guild.me.displayName, client.user.displayAvatarURL)
      .setDescription('Add a reaction to one of these emojis to play the game!')
      .setTimestamp();
    const m = await message.channel.send(embed)
      .catch(error => {
        console.error(error);
        return reply(message, 'Something Went Wrong');
      });
    // Add reaction and wait 30s for him to react
    const reacted = await promptMessage(m, message.author, 20, chooseArr)
      .catch(error => {
        console.error(error);
        return reply(message, 'Something Went Wrong');
      });
    // Delete message if user didn't react
    if (reacted === undefined) {
      return m.delete();
    }
    // Continue, if user react
    // Get result and clear reactions
    const botChoice = chooseArr[Math.floor(Math.random() * chooseArr.length)];
    const result = getResult(reacted, botChoice);
    // Send result
    embed
      .setDescription(`${result}\n${reacted} vs ${botChoice}`);
    await m.edit(embed)
      .catch(error => {
        console.error(error);
        return reply(message, 'Something Went Wrong');
      });
    // Delete message
    return m.delete(5000)
      .catch(error => {
        console.error(error);
        return reply(message, 'Something Went Wrong');
      });
  },
};
