const Discord = require('discord.js');
var Storage = require('node-storage');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();
var store = new Storage('./bot_data');

client.once('ready', () => {
    console.log('Ready!');
    store.put('hello', 'world');
});

client.on('message', message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    console.log(message.content);
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    console.log(command);

    if (command === 'kick') {
        // grab the "first" mentioned user from the message
        // this will return a `User` object, just like `message.author`
        const taggedUser = message.mentions.users.first();

        message.channel.send(`You wanted to kick: ${taggedUser.username}`);
    }
});

client.login(token);