const Discord = require('discord.js');

const cron = require('node-cron');

const {
    prefix,
    token
} = require('./config.json');

const start = require('./commands/start');
const quit = require('./commands/quit');
const yes = require('./commands/yes');
const no = require('./commands/no');
const choose = require('./commands/choose');
const active_channel = require('./commands/active_channel');
// const killbot = require('./commands/killbot');

const create_random_npcs = require('./helpers/create_random_npcs');
const send_message_to_active_channel = require('./helpers/send_message_to_active_channel');

const Storage = require('node-storage');

const faction_store = new Storage('./data/faction_data');

const client = new Discord.Client();
client.once('ready', () => {
    // create_random_npcs(50);
    // cron.schedule('0 */2 * * *', () => {
    //     send_message_to_active_channel("I'm actually working... duhh", client);
    // });
    const faction = faction_store.get('old_country');
    faction.leaders.forEach(leader => {
        const user = client.users.cache.get(leader.id);
        user.send("Hello");
    }); 
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
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
            choose(message, args.shift(), client);
            break;
        case "active_channel":
            active_channel(message.channel);
            break;
        // case "killbot":
        //     killbot(client);
        //     break;
        default:
            message.author.send("`"+ message.content +"` is not a valid command");
            break;
    }
});

client.login(token);