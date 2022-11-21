const express = require('express');
const app = express();
const port = 3000;
var lastSentMessageTimestamp = performance.now();
var lastMecoSpamTimestamp = performance.now();
var lastAnswer = "";
var bannedUserIds = ["229085888091652097", "185950410521968640"]
var personalAnswers = {
  "doja": ["U beat me whilst fully wbuffed in the retard raid, here's ur reward https://cdn.discordapp.com/attachments/924354712118100018/1008428756223930509/20220803_003826.jpg",
    "LOL KEEP BRAGGING ABOUT BEATING AN OFFTANK WHILST U HAD FULL WBUFFS U FUCKING TRASHCAN, I'LL FUCK U LIKE I FUCK YAAA MUM 😛",
    "I'm gonna depart now tho, got meters to top and bitches to fuck, later trashcan, thanks for making me nut.. i'll venmo u the cash",
    "LOL, I was wiping my ass with u up to the point where I died, I had DMF and DMT, U HAD FULL WBUFFS TRASHCAN, SIT DOWN"],
  "flynn": ["show bald head",
    "ur actively griefing with ur bald head, go grow sum hair u hairless rat"],
  "tunasubgg": ["I've lost respect for you fish after reading that.",
    "Gg fish, ya'll beat a child in a 20 year old body"],
  "homeostasis": ["You look like u eat wheaties everyday for breakfast, muscles ain't gonna save you from me running yo ass over🚬🚬🚬🚬",
    "Bend over big boy, I like em thicccc"]
}
var keywordsAnswers = {
  "pasta": 'Free consumes, busy at work and fucking hoes on the daily is the reason I run with pasta gang atm',
  "consumes": 'Free consumes, busy at work and fucking hoes on the daily is the reason I run with pasta gang atm',
  "bald": 'he’s bald, he’s BALD',
  "deez": 'I can\'t help but be upset over this, they literally can\'t clear content without us, but they are gonna drive away the little population they have?? like how about you try and help the guy you shitter, you wana sit there and label half ur guild bad, look in the mirror. now he\'s got nothing to say, typical Deez',
  "meco": 'Go do yoga meco'
}
var mortyAnswer = [
  'Sit down child, go compare our logs, then talk big game pussy',
  'Meters topped, have a shitty night losers',
  'Keep griefing you fucking losers',
  'You fucking vagina',
  'Don\'t worry about nothin\', the hoes been on mah poonstick',
  'I want you all to know I hate this fucking guild, I truly fucking hate this guild, I fucking do, this, I fucking hate every second of this fucking raid tonight. Dogshit bro. Dogshit fucking raid. I hate it. Bro there was so much time to fucking heal me bro. No it\'s not, it\'s fucking garbage bro, it\'s fucking garbage.',
  'Virgin? I\'m too busy getting puuuuuusssssseh, sorry losers',
  'Sorry I couldn\'t reply to this gold sooner, too busy sniffing cocaine off this hookers ass',
  'your momma been in mah bed boi, she suckin\' mah toes',
  'Ow you guys don\'t know what a poonstick is right?',
  'Buddy don\'t even start the fucking shit when me, your literally sitting here being a pest to our guild, watch your fucking tone.',
  'thanks for the comedy, but i got a bunch of loot to get and meters to top, have a shitty night losers:)',
  'I\'m just pissed, I join the discord to chill and they are sitting there talking bare shit about someone who helps their raid so fucking much, they have no respect, it\'s a corrupt guild, their officiers suck at everything, but i agree, that\' why i left their discord, i want nothing to do with them',
  'Buddy ill just leave the server, I don\'t need to help ur guild with their shitty pugs, I just decided too, peace bitch',
  'Those kind of people are the reason I will quit this game soon lmao, try hard Chad\'s that ruin everything',
  'Imagine not being able to clear naxx 15 year\'s after it was released xD',
  'Absolute fucking joke, have fun with ur corrupt ass guild pussy',
  '1 day after joining.. I am leaving, I must fulfil my destiny and start my very own pimp club aka "Guild" see you beautiful bastards in raid.. PASTA4LIFE',
  'thanks for the gressil',
  'Are you smoking meth?',
  'i can\'t even fucking raid anymore, fuck this game, fuck you, fuck ur guild, fuck all u losers',
  'You make threatening advancing towards me and tell me to chill out, how about its a fucking game, watch your fucking tone. You phase 7 people are really ignorant, I hope you know that',
  'I\'m gonna write a bestseller or some shit... fuckin\' New York Best Times, or whatever',
  'Literal trash can, come get smoked pussey',
  'I\'m beyond confused, are you saying I have a vagina? Wait til I get on my break if u want dick pics brother man',
  'You got schooled by a 21 year old, keep crying fuckers, back to work i gooooo🤣',
  'Mortybot Living rent free in yo head all night lil boyy',
  'Stop tagging me in this dogshit, I have no association with any of u fuckers',
  'Sup fuckers https://cdn.discordapp.com/attachments/924354712118100018/1031295653235675227/20221016_091016.jpg',
  '@Sky come lick my unshaved, unwashed.. covid infested.. BALL SACK, I know thats what this is all about'
];

function generate_answer(msg) {
  // Generate answer different from previous one. Also checks keyword answers and personal answers.
  var personalAnswerUsed = false;
  let text = String(msg.content).toLowerCase();
  let author = String(msg.author.username).toLowerCase();
  var answer = mortyAnswer[Math.floor(Math.random() * mortyAnswer.length)];

  for (var username in personalAnswers) {
    if (author === username && (Math.random() <= 0.5)) {
      answer = personalAnswers[username][Math.floor(Math.random() * personalAnswers[username].length)];
      personalAnswerUsed = true;
    }
  }
  for (var keyword in keywordsAnswers) {
    if (text.includes(keyword) && keywordsAnswers[keyword] !== lastAnswer) {
      answer = keywordsAnswers[keyword]
      personalAnswerUsed = false;
    }
  }
  while (answer === lastAnswer) {
    answer = mortyAnswer[Math.floor(Math.random() * mortyAnswer.length)];
    personalAnswerUsed = false;
  }
  lastAnswer = answer;
  if (personalAnswerUsed == true) {
    msg.reply(answer);
  }
  else {
    msg.channel.send(answer);
  }
}

app.get('/', (req, res) => res.send('morty'));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

// ================= START BOT CODE ===================
const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', msg => {
  if (String(msg).toLowerCase().includes("morty") || String(msg).toLowerCase().includes("morti") || String(msg).toLowerCase().includes("immortaler") || String(msg).includes("980197052816453662")) {
    console.log(msg.author.username + " " + msg.author.id);
    if (msg.member.roles.cache.find(r => r.name === "Guild Member") || msg.member.roles.cache.find(r => r.name === "Guest")) {
      if (performance.now() - lastSentMessageTimestamp < 3000) {
        console.log("spam prevention");
      }
      else {
        if (bannedUserIds.includes(String(msg.author.id))) {
          console.log("banned user " + String(msg.author.id) + " " + String(msg.author.username));
        }
        else {
          generate_answer(msg);
          lastSentMessageTimestamp = performance.now();
        }
      }
    }
    else {
      console.log("no valid roles " + String(msg.author.id) + " " + String(msg.author.username));
    }
  }
});

client.on('debug', debuglog => {
  console.log(debuglog);
  if (String(debuglog).includes("Hit a 429 while executing a request")) {
    console.log("restarting");
    const { exec } = require("child_process");
    exec("kill 1")
  }
});

client.login(process.env.MORTYTOKEN);
