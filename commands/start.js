const start = require('../texts/start.json');
const Discord = require('discord.js');
const PlayerState = require("../PlayerState");
const Storage = require('node-storage');

module.exports = (message) => {
    const active_channel_store = new Storage('./data/active_channel_data');
    if(!message) return;

    const channel_id = active_channel_store.get("active_channel_id");
    if (message.channel.type !== "dm" && !channel_id) active_channel_store.put("active_channel_id", message.channel.id);

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