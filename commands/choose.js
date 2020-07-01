const start = require('../texts/start.json');
const Discord = require('discord.js');
const PlayerState = require("../PlayerState");
const to_faction_name = require("../texts/to_faction_name");
const valid_factions = require("../factions/valid_factions.json");

const Storage = require('node-storage');
const bot_store = new Storage('./data/bot_data');

module.exports = (message, choice) => {
    if(!message) return;

    const player_state = new PlayerState(message.author.id);
    const isInProperState = player_state.stateMachine.can('chooseFaction');
    if(!isInProperState) {
        message.author.send("Invalid Command in your current context.");
        return;
    }

    const is_valid_faction = valid_factions.includes(choice);
    if(!is_valid_faction) {
        message.author.send(`You have chosen an invalid faction.`);
        return;
    }

    player_state.chooseFaction();

    bot_store.put(`${message.author.id}.faction`, choice);

    const faction_name = to_faction_name(choice);
    message.author.send(`You have chosen ${faction_name}. Good luck!`);
}