const start = require('../texts/start.json');
const Discord = require('discord.js');
const PlayerState = require("../PlayerState");
const remove_leader_from_faction = require('../helpers/remove_leader_from_faction');
const Storage = require('node-storage');

module.exports = (message) => {
    if(!message) return;

    const player_state = new PlayerState(message.author.id);
    const isInProperState = player_state.stateMachine.can('quit');
    if(!isInProperState) return;

    player_state.quit();

    const bot_store = new Storage('./data/bot_data');
    const player = bot_store.get(message.author.id);

    if(!player.faction) {
        message.author.send("You're already not in a faction...");
        return;
    }

    bot_store.remove(`${message.author.id}.faction`);
    remove_leader_from_faction(player.faction, message.author);

    message.author.send("Your faction will miss you...");
}