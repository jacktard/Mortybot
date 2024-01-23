/*
  To run this on replit, create new replit, import this code,
  generate new token from https://discord.com/developers/applications and set
  replit secret MORTYTOKEN to that token.
  Add mortybot to your server via https://discord.com/oauth2/authorize?client_id=980533763010359436&scope=bot
  where client_id is your own mortybot discord bot id. 
*/

const express = require('express');
const app = express();
const port = 3000;
var lastSentMessageTimestamp = performance.now();
var lastAnswer = "";
var lastPersonId = "";
var bannedUserIds = ["229085888091652097", "185950410521968640"]
var personalAnswers = {
  "doja": ["U beat me whilst fully wbuffed in the retard raid, here's ur reward https://media.discordapp.net/attachments/876905329089216573/1195588189126140016/image.png",
    "LOL KEEP BRAGGING ABOUT BEATING AN OFFTANK WHILST U HAD FULL WBUFFS U FUCKING TRASHCAN, I'LL FUCK U LIKE I FUCK YAAA MUM 😛",
    "I'm gonna depart now tho, got meters to top and bitches to fuck, later trashcan, thanks for making me nut.. i'll venmo u the cash",
    "LOL, I was wiping my ass with u up to the point where I died, I had DMF and DMT, U HAD FULL WBUFFS TRASHCAN, SIT DOWN"],
  "flynn": ["show bald head",
    "ur actively griefing with ur bald head, go grow sum hair u hairless rat"],
  "tunasubgg": ["I've lost respect for you fish after reading that.",
    "Gg fish, ya'll beat a child in a 20 year old body"],
  "homeostasis": ["You look like u eat wheaties everyday for breakfast, muscles ain't gonna save you from me running yo ass over🚬🚬🚬🚬",
    "Bend over big boy, I like em thicccc"],
  "silly": ["Mid raid, short notice.. ur not happy eh?? Well you can go fuck yourself aswell silly, congrats on the gressil/thc you'll never use you fucking useless waste of space, go take care of ur fucking family and get off the video game. UR NOT HAPPY?? I ALSO DON'T FUCKING CARE GUY. Have fun being deadweight the rest of ur pitiful existence"],
  "sky": ['@Sky come lick my unshaved, unwashed.. covid infested.. BALL SACK, I know thats what this is all about', '@Sky is a literal mangina on arms n legs, grow a pair u fucking pussehhh']
}
var keywordsAnswers = {
  "pasta": 'Free consumes, busy at work and fucking hoes on the daily is the reason I run with pasta gang atm',
  "consumes": 'Free consumes, busy at work and fucking hoes on the daily is the reason I run with pasta gang atm',
  "bald": 'he’s bald, he’s BALD',
  "deez": 'I can\'t help but be upset over this, they literally can\'t clear content without us, but they are gonna drive away the little population they have?? like how about you try and help the guy you shitter, you wana sit there and label half ur guild bad, look in the mirror. now he\'s got nothing to say, typical Deez',
  "meco": 'Go do yoga meco',
  "morty /help": "https://cdn.discordapp.com/attachments/918911597039214683/1199409667588231198/morty_help.png?ex=65c2704c&is=65affb4c&hm=add9df52733bed4fd973cc7e99a7f1648ab16d96933f468d4cd8cda9066db84f& \n\n Mortybot is a Discord bot that leverages AI technology to deliver a Morty experience indistinguishable from reality. The following commands are available in this version:\n\n/admin\nOpens the Mortybot admin panel\n\n/comment <number>\nPosts a specific Mortybot comment, where <number> is an integer between 1-76\n\n/image\nPosts a comment that includes an image\n\n/spam <number>\nSpams up to 50 Mortybot comments at once, where <number> is an integer between 1-50\n",
  "morty /admin": "ERROR: Your Discord account does not have admin rights to Mortybot. Please contact an officer of Phase Seven to request admin access.",
  "morty /comment": "ERROR: Your Discord account does not have an active Mortybot Nitro™ subscription. To sign up, please visit https://onlyfans.com/moretea",
  "morty /image": "ERROR: Your Discord account does not have an active Mortybot Nitro™ subscription. To sign up, please visit https://onlyfans.com/moretea",
  "morty /spam": "ERROR: Your Discord account does not have an active Mortybot Nitro™ subscription. To sign up, please visit https://onlyfans.com/moretea"
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
  'Sup fuckers https://cdn.discordapp.com/attachments/876905329089216573/1195516029556772934/20221016_091016.jpg',
  'I\'m in the process of doxing all u losers, gonna sell all u fuckers out along with David\'s info to the Nigerian government so they can use a ur identities. Fuck you all',
  'The fuck even is a strafe 🤣 ya\'ll a bunch of hoes, making up words n shit',
  'You guys all ruin good things, have fun living ur shitty lives',
  'LIVING IN UR HEAD RENT FREE, GET FUCKED PUSSY BOI',
  '@The 5th Horseman how do my balls taste big boy?;) ya\'ll been on my cock that much recently ehhh',
  'Ur mentally bald',
  'I was butt fucking a dirty african ghetto girl whilst attempting to get the rend.. i was kinda preoccupied',
  'Still rocking the mangina 2000 bbyy boy ',
  'Son im 21 years old, I ain\'t gotta be an adult, ya\'ll just keeping making me nut, you just don\'t see to understand',
  'Ur dad sucked my shaft while ur mum was cradling the balls, come sub in for mommy;))',
  'Meco left sum brain dead mother fuckers in charge... and thats the end of my rant, enjoy pussy boyyy',
  'I\'m boutta go in this dispensary n just stand around for like 20 minutes, so I can give everyone covid',
  'You got beat by an offtank with the lowest sunders, stay away from mah cheeks son ',
  'Sydposting back on muted, night losers',
  'Sydposting isn\'t fun anymore, just Phase Seven sucking Koja\'s cock, i\'m out losers.. thanks for the laughs',
  'I\'ll be flying First Class to Vegas tomorrow with my hot wife. While you pay for a second spy account just to have all the advantages you can get to make up for your lack of skill. See you around, no skill.',
  'Morty ain\'t going no where',
  'Taking CAC to the throat',
  'I got suspended in grade 6 for saying poon stick infront of the teacher',
  'Gang gang since potty trained',
  'Either way, I ain\'t in the wrong, so I could care less about what ya\'ll got to say.. arengar can suck the cock + my hairy unwashed balls, I\'m done rambling.',
  'Lolol just get ur fucking paladins to buff and there won\'t be an issue, that never would\'ve happened if I didn\'t have to ask 5 fucking times for a buff, I asked when I got back, before golemagg, and 3 times while going from golemagg to majordomo, don\'t invite me to the raid if ur gonna have jack ass mother fuckers who don\'t do their job. Just because I don\'t like you idiots, doesn\'t mean I\'m gonna stop dpsing and topping meters, should be a mutual respect between everyone, obviously I\'m gonna be pretty fucking angry if a member of ur guild is refusing to buff me',
  'I gotta ejecto seato tf on outta here, duty calls... money to make and bitches to fuck, talk to you in a couple hours scrotum',
  'Fuck the meme\'s, How can i be mad about C’thun kills that ive barley tried for? Bendria wants the anger for Sydposting, my priest isnt even friendly with Immortaler. I could see after months and months trying for a sydpost wanting to go for it but that isnt the case, i\'m not a whore and I don\'t want to be so yes they posted fuk this guild. But Judas seems more mad about it then i am >.<.',
  'I\'m so heated rn, Pasta Sauce talks such big game for not even being able to fill a raid with their own guild members',
  'Ya\'ll are some real salty mother fuckers eh? come taste the axe i\'m right here waiting pussy boi;)',
  'Poppin that collar for you spooge https://cdn.discordapp.com/attachments/876905329089216573/1195515412230717481/image.png',
  'I\'ve actually got a little dirt stasche right now.. so its a little off https://cdn.discordapp.com/attachments/876905329089216573/1195515633354416208/image.png',
  'You think I\'m scared? https://cdn.discordapp.com/attachments/893245644989411340/999003004348936272/Snapchat-1414192136.jpg',
  'I think u got the wrong gringo, my vape is right here https://cdn.discordapp.com/attachments/876905329089216573/1195513471643697222/20220308_181133.jpg',
  'Good morning https://media.discordapp.net/attachments/1048402581958951035/1088671876374605824/20230323_235159.jpg',
  'ERROR: Your Discord account does not have an active Mortybot Nitro™ subscription. To sign up, please visit https://onlyfans.com/moretea',
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
  if (String(msg).toLowerCase().includes("morty") || String(msg).toLowerCase().includes("immortaler") || String(msg).includes("980197052816453662")) {
    console.log(msg.author.username + " " + msg.author.id);
    if (msg.guild.name != "Phase 7" || (msg.member.roles.cache.find(r => r.name === "Guild Member") || msg.member.roles.cache.find(r => r.name === "Guest"))) {
      if (performance.now() - lastSentMessageTimestamp < 2000) {
        console.log("spam prevention");
      }
      else if (lastPersonId === String(msg.author.id) && performance.now() - lastSentMessageTimestamp < 5000) {
        console.log("same person spam prevention");
      }
      else {
        if (bannedUserIds.includes(String(msg.author.id))) {
          console.log("banned user " + String(msg.author.id) + " " + String(msg.author.username));
        }
        else {
          generate_answer(msg);
          lastSentMessageTimestamp = performance.now();
          lastPersonId = String(msg.author.id);
        }
      }
    }
    else {
      console.log("no valid roles '" + String(msg.guild.name) + "' " + String(msg.author.id) + " " + String(msg.author.username));
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
