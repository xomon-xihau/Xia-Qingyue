'use strict';
const { Client, Collection } = require('discord.js');
const { config } = require('dotenv');
const { reply } = require('./functions.js');
const fs = require('fs');

// Declares our bot,
// the disableEveryone prevents the client to ping @everyone
const client = new Client({
  disableEveryone: true,
});

config({
  path: `${__dirname}/.env`,
});

// Prefix
const prefix = process.env.PREFIX;

// Collections
client.commands = new Collection();
client.aliases = new Collection();
const cooldowns = new Collection();

// Run the command loader
['command'].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});


// When the bot's online, what's in these brackets will be executed
client.on('ready', () => {
  console.log(`Hi, ${client.user.username} is now online!`);

  // Set the user presence
  // client.user.setPresence({
  //   status: 'dnd',
  //   game: {
  //     name: 'What ppl write.',
  //     type: 'WATCHING',
  //   },
  // });
});

// IDs of the guild in which bot command will work
const guildID = [
  '442546874793328640',
  '641317493474066452',
];

// When a message comes in, what's in these brackets will be executed
// eslint-disable-next-line require-await
client.on('message', async message => {
  // If the author's a bot, return
  // If the message was not sent in a server, return
  // If the message was from server in which you don't want bot command to work, return
  // If the message doesn't start with the prefix, return
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!guildID.includes(message.guild.id)) return;
  if (!message.content.startsWith(prefix)) return;

  // If message.member is uncached, cache it.
  // eslint-disable-next-line require-atomic-updates
  // if (!message.member) message.member = await message.guild.fetchMember(message);

  // Arguments and command variable
  // cmd is the first word in the message, aka the command
  // args is an array of words after the command
  // !say hello I am a bot
  // cmd == say (because the prefix is sliced off)
  // args == ["hello", "I", "am", "a", "bot"]
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

  // Get the command
  let command = client.commands.get(cmd);
  // If none is found, try to find it by alias
  if (!command) { command = client.commands.get(client.aliases.get(cmd)); }

  // Tell the user to provide argument for those cmd that needed it
  if (command.args && !args.length) {
    reply(message, 'You didn\'t provide any arguments');
    return;
  }

  if (command.ch && !command.ch.includes(message.channel.id)) {
    // eslint-disable-next-line consistent-return
    return reply(message, `This command works only in <#${command.ch.join('>, <#')}>`);
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 30) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      reply(message, `Plz wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
      return;
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  // If a command is finally found, run the command
  if (command) { command.run(client, message, args); }
});

const regrex = RegExp(/<@.*>/);

client.on('messageDelete', messageDelete => {
  if (regrex.test(messageDelete.content)) {
    const date = new Date();
    // eslint-disable-next-line max-len
    fs.appendFile('message.txt', `${messageDelete.content}・・${messageDelete.author.tag}・・${messageDelete.author.id}・・${date}\n`, err => {
      if (err) console.error(err);
    });
  }
});

client.on('messageUpdate', (oldMessage, newMessage) => {
  if (regrex.test(oldMessage.content) && !regrex.test(newMessage.content)) {
    const date = new Date();
    // eslint-disable-next-line max-len
    fs.appendFile('message.txt', `${oldMessage.content}・・${oldMessage.author.tag}・・${oldMessage.author.id}・・${date}\n`, err => {
      if (err) console.error(err);
    });
  }
});

// Login the bot
client.login(process.env.TOKEN);
