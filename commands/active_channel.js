const Discord = require('discord.js');
const PlayerState = require("../PlayerState");

const Storage = require('node-storage');
const bot_store = new Storage('./data/bot_data');

module.exports = (channel) => {
    if(!channel) return;

    if(channel.type === "dm") return;

    bot_store.put("active_channel_id", channel.id);
    channel.send("This is now the active channel for Avalwyn");
}