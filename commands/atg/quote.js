'use strict';
const fetch = require('node-fetch');
const { reply, qt } = require('../../functions.js');
const cheerio = require('cheerio');
const { stringify } = require('querystring');

module.exports = {
  name: 'quote',
  aliases: ['qt'],
  args: true,
  cooldown: 60,
  category: 'atg',
  description: 'Get Quotes From Wikia',
  run: async (_, message, args) => {
    let res = await fetch('https://ni-tian-xie-shen-against-the-gods.fandom.com/wiki/Against_the_Gods_Wiki:Data')
      .catch(error => {
        console.error(error);
        return reply(message, 'Something Went Wrong');
      });

    let status = res.status;
    if (status === 200) {
      let html = await res.text()
        .catch(error => {
          console.error(error);
          return reply(message, 'Something Went Wrong');
        });
      let qry = args.join(' ');
      const arg = args[0].trim().toUpperCase();
      let $ = cheerio.load(html);
      let val = false;
      $('td').each((_index, elem) => {
        if ($(elem).text().trim() === arg) {
          val = $(elem).next('td').text()
            .trim();
          return false;
        }
        return true;
      });
      if (val) qry = val;
      const query = stringify({ query: qry, limit: 1 });
      res = await fetch(`https://ni-tian-xie-shen-against-the-gods.fandom.com/api/v1/Search/List?${query}`)
        .catch(error => {
          console.error(error);
          return reply(message, 'Something Went Wrong');
        });
      status = res.status;
      if (status === 200) {
        const json = await res.json()
          .catch(error => {
            console.error(error);
            return reply(message, 'Something Went Wrong');
          });
        const { items } = json;
        if (items.length) {
          const link = items[0].url;
          res = await fetch(`${link}/Quotes`)
            .catch(error => {
              console.error(error);
              return reply(message, 'Something Went Wrong');
            });
          status = res.status;
          if (status === 200) {
            html = await res.text()
              .catch(error => {
                console.error(error);
                return reply(message, 'Something Went Wrong');
              });
            // eslint-disable-next-line require-atomic-updates
            $ = cheerio.load(html);
            const quotes = [];
            $('table').has('i').each((_in, elem) => {
              const quote = $(elem).find('i').text()
                .trim();
              const by = $(elem).find('small').text()
                .trim()
                .replace(/\[.*\]/, '');
              const sup = $(elem).find('sup').find('a')
                .attr('href');
              const chap = $(sup).text().trim()
                .replace('↑ ', '');
              quotes.push({ quote: quote, by: by, chap: chap });
            });

            const result = quotes[Math.floor(Math.random() * quotes.length)];
            return message.channel.send(`${qt(result.quote)} ${result.by} (${result.chap})`);
          }
          return reply(message, 'Not Found');
        }
        return reply(message, 'Not Found');
      }
      return reply(message, 'Something Went Wrong');
    }
    return reply(message, 'Something Went Wrong');
  },
};
