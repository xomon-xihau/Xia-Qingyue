'use strict';
const { config } = require('dotenv');
config({
  path: `${__dirname}/.env`,
});

const yandex = process.env.YANDEX;
const fetch = require('node-fetch');
const { reply, qt } = require('../../functions.js');
const cheerio = require('cheerio');
const { stringify } = require('querystring');

module.exports = {
  name: 'chap',
  args: false,
  cooldown: 30,
  category: 'atg',
  ch: ['566710843232878610'],
  description: 'Get latest chap title',
  run: async (_, message) => {
    let res = await fetch('http://book.zongheng.com/book/408586.html')
      .catch(error => {
        console.error(error);
        return reply(message, 'Something Went Wrong');
      });
    let status = res.status;
    if (status === 200) {
      const html = await res.text();
      const $ = cheerio.load(html);
      const title = $('.tit').find('a').text();
      const num = title.match(/(\d+)/)[0];
      const name = title.replace(/第.*章/g, '').trim();
      let time = $('.time').text().trim()
        .split('· ')[1].trim();
      let yt = '';
      const query = stringify({ key: yandex, text: time });
      res = await fetch(`https://translate.yandex.net/api/v1.5/tr.json/translate?lang=en&${query}`)
        .catch(error => {
          console.error(error);
        });
      status = res.status;
      if (status === 200) {
        const { text } = await res.json()
          .catch(error => {
            console.error(error);
          });
        if (text !== undefined) {
          yt = `(TL: ${text})`;
        }
      }
      time = `${time} ${yt}`;
      const send = `Chapter Number: ${num}\nChapter Name: ${name}\nReleased: ${time}`;
      return message.channel.send(qt(send.trim()));
    }
    return reply(message, 'Something Went Wrong');
  },
};
