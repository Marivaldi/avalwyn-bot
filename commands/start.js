const start = require('../texts/start.json');
const Discord = require('discord.js');
const PlayerState = require("../PlayerState");

module.exports = (message) => {
    if(!message) return;

    const player_state = new PlayerState(message.author.id);
    const isInProperState = player_state.stateMachine.can('start');
    if(!isInProperState) {
        message.author.send("You've already run the start command. Waiting for confirmation: " + start.next_action_text);
        return;
    }

    player_state.start();

    const startEmbed = new Discord.MessageEmbed()
	.setColor(start.color)
	.setTitle(start.title)
    .setDescription(start.description)
	.addFields(
		{ name: start.factions_header, value: start.factions_description }
	)
    .setImage('https://i.imgur.com/uL2CNGk.jpg')
    .addFields(
		{ name: start.next_action_header, value: start.next_action_text }
	)
	.setTimestamp()

    message.author.send(startEmbed);
}