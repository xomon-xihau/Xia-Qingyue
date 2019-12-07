'use strict';
const fetch = require('node-fetch');
const { reply, qt } = require('../../functions.js');
const { stringify } = require('querystring');

const capitalize = s => s && s[0].toUpperCase() + s.slice(1);

module.exports = {
  name: 'jokes',
  aliases: ['joke'],
  args: true,
  category: 'fun',
  cooldown: 60,
  description: 'Get Random Jokes',
  usage: '[FirstName] [LastName]',
  run: async (_, message, args) => {
    if (args.length !== 2) {
      return reply(message, 'Please provide firstname and lastname.\nExample: --jokes John Doe');
    }
    const [firstname, lastname] = args;
    const query = stringify({ firstName: capitalize(firstname), lastName: capitalize(lastname) });

    const res = await fetch(`http://api.icndb.com/jokes/random?${query}`)
      .catch(error => {
        console.error(error);
        return reply(message, 'Something Went Wrong');
      });

    const status = res.status;
    if (status === 200) {
      const { value } = await res.json()
        .catch(error => {
          console.error(error);
          return reply(message, 'Something Went Wrong');
        });
      if (value !== undefined) {
        return message.channel.send(qt(value.joke.replace(/&quot;/g, '"')));
      }
    }
    return reply(message, 'Something Went Wrong');
  },
};
