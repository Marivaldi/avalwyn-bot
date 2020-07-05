const Discord = require('discord.js');
const client = new Discord.Client();

const dotenv = require('dotenv').config();

//config
const prefix = process.env.PREFIX;

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
const killbot = require('./commands/killbot');
const initialize_factions = require('./helpers/initialize_factions');
const faction_info = require('./commands/faction_info');
const cast = require('./commands/cast');
const AvalwynStorage = require("./AvalwynStorage");
const hire = require('./commands/hire');
const fire = require('./commands/fire');
const send_attachment_to_active_channel = require('./helpers/send_attachment_to_active_channel');
const upload_data_to_s3 = require('./helpers/upload_data_to_s3');
const download_data_from_s3 = require('./helpers/download_data_from_s3');
const help = require('./commands/help');
const spy = require('./commands/spy');
const spells = require('./commands/spells');

let jobs = [];

client.once('ready', async () => {
    download_data_from_s3();
    new AvalwynStorage();
    jobs = setup_scheduled_jobs(client);
    if(jobs.length === 0) {
        console.error("Shutting down due to bad CRON jobs!");
        killbot(undefined, client);
        return;
    }
    initialize_factions();
});

client.once('shardDisconnect', async () => {
    console.log("Destroying jobs...")
    jobs.forEach((job) => {
        job.destroy();
    })
    console.log("Done destroying jobs!");

    console.log("Syncing Data to S3 Bucket...")
    upload_data_to_s3();
    console.log("Done syncing data!");

    console.log("Killing Process...");
    process.exit(5);
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    switch (command) {
        case "help":
            help(message);
            break;
        case "spells":
            spells(message);
            break;
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
        case "spy":
            spy(message, args.shift());
            break;
        case "hire":
            hire(message, client, args.shift());
            break;
        case "fire":
            fire(message, client, args.shift());
            break;
        case "killbot":
            killbot(message, client);
            break;
        default:
            message.channel.send("`" + message.content + "` is not a valid command");
            break;
    }
});

client.login(process.env.TOKEN);