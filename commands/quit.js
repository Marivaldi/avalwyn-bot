const start = require('../texts/start.json');
const Discord = require('discord.js');
const PlayerState = require("../PlayerState");

module.exports = (message) => {
    if(!message) return;

    const player_state = new PlayerState(message.author.id);
    const isInProperState = player_state.stateMachine.can('quit');
    if(!isInProperState) return;

    player_state.quit();

    message.author.send("Your faction will miss you...");
}