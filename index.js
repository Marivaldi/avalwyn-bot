const Discord = require('discord.js');
const client = new Discord.Client();


//config
const {
    prefix,
    token
} = require('./config.json');

// commands
const start = require('./commands/start');
const quit = require('./commands/quit');
const yes = require('./commands/yes');
const no = require('./commands/no');
const choose = require('./commands/choose');
const active_channel = require('./commands/active_channel');
const setup_scheduled_jobs = require('./scheduled_jobs/setup_scheduled_jobs');
const train = require('./commands/train');
const battle = require('./commands/battle');
const initialize_factions = require('./helpers/initialize_factions');
const faction_info = require('./commands/faction_info');
const cast = require('./commands/cast');

// const killbot = require('./commands/killbot');

client.once('ready', async () => {
    setup_scheduled_jobs(client);
    initialize_factions();
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
        case "train":
            train(message, client, args.shift());
            break;
        case "battle":
            battle(message, client, args.shift());
            break;
        case "cast":
            cast(message, client, args.shift(), args.shift());
            break;
        case "faction_info":
            faction_info(message);
            break;
            // case "killbot":
            //     killbot(client);
            //     break;
        default:
            message.author.send("`" + message.content + "` is not a valid command");
            break;
    }
});

client.login(token);