const Discord = require('discord.js');
const PlayerState = require("../PlayerState");
const faction_selection_embed = require("../embeds/faction_selection_embed");

const Storage = require('node-storage');
const bot_store = new Storage('./data/bot_data');

module.exports = (message) => {
    if(!message) return;

    const player_state = new PlayerState(message.author.id);
    const isInProperState = player_state.stateMachine.can('sayYes');
    if(!isInProperState) {
        message.author.send("Invalid Command in your current context.");
        return;
    }

    player_state.sayYes();

    const current_state =  player_state.currentState();
    switch(current_state) {
        case "factionSelection":
            bot_store.put(message.author.id, {});
            message.author.send(faction_selection_embed);
            break;
        default:
            break;
    }
}