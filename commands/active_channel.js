const Discord = require('discord.js');
const PlayerState = require("../PlayerState");

const Storage = require('node-storage');
const active_channel_store = new Storage('./data/active_channel_data');

module.exports = (channel) => {
    if(!channel) return;

    if(channel.type === "dm") return;

    active_channel_store.put("active_channel_id", channel.id);
    channel.send("This is now the active channel for Avalwyn");
}