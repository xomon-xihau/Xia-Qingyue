'use strict';

const myArray = [
  'Pathetic worm, you dare try to talk to this King....',
  'Ah, pathetic mortals, like frogs lusting after a swan\'s flesh...',
  'You don’t even deserve to be bloodstains on this King\'s sword.',
  'Hah? You think you\'re special?',
  'So I heard you talking about this King... pathetic...',
  'Heh. Are you a man or a worm? Useless.',
  'Haha, you think this King is beautiful? Why don\'t you stop thinking with your lower half you beast...',
  'Stupid. Idiotic. Worthless. Waste of my breath.',
  'Your martial arts is really nice. I’ll call you over to perform if this King ever needs a laugh.',
  'Your head would make a really good paper weight. Nevermind, your head is empty.',
  'This King shall slaughter your entire clan!',
  'You think this King farts? Ha, even if I did you\'re not worthy of smelling it.',
  'This King wants to insult you, but I’d rather not waste my breath on it.',
  'Yawn.... this King wants to be entertained, but you monkeys will not do.',
  'You think you understand this King? You act like my life is written in a book, idiot.',
  'Sigh, if this King had to weigh your worth in profound crystals, this King would have negative profound crystals.',
  'Did this King ask for your opinion?',
  'Yun Che? He\'s pathetic sure, but not as pathetic as you.',
  'World Piercer? You\'re not worthy of mentioning that word you ant.',
  'World-Defying Heavenly Manual? You know too much, die.',
];

module.exports = {
  name: 'insult',
  cooldown: 30,
  catrgory: 'fun',
  description: 'Insult a user',
  usage: '[name | ping]',
  args: true,
  run: (_, message, args) => {
    const randomItem = myArray[Math.floor(Math.random() * myArray.length)];
    const name = args.join(' ');
    return message.channel.send(`\`To ${name}:\` ${randomItem}`);
  },
};
