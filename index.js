const Discord = require('discord.js');

const {
    prefix,
    token
} = require('./config.json');

const start = require('./commands/start');
const quit = require('./commands/quit');
const yes = require('./commands/yes');
const no = require('./commands/no');
const choose = require('./commands/choose');

const create_random_npcs = require('./helpers/create_random_npcs');

const client = new Discord.Client();
client.once('ready', () => {
    create_random_npcs(50);
    // const channel_id = bot_store.get("active_channel_id");
    // if (!channel_id) return;

    // const activeChannel = client.channels.cache.get(channel_id);
    // if (!activeChannel) return;

    // activeChannel.send("Sorry. Just woke up from a lil nap.");
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    console.log(args);
    switch (command) {
        case "start":
            start(message);
            break;
        case "quit":
            quit(message);
            break;
        case "yes":
            yes(message);
            break;
        case "no":
            no(message);
            break;
        case "choose":
            choose(message, args.shift());
            break;
        default:
            message.author.send("`"+ message.content +"` is not a valid command");
            break;
    }
});

client.login(token);