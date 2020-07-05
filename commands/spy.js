const get_faction_info = require("../helpers/get_faction_info")
const AvalwynStorage = require("../AvalwynStorage");
const valid_factions = require('../factions/valid_factions.json');

module.exports = (message, faction_key) => {
    const bot_store = new AvalwynStorage().bot_storage;
    const player = bot_store.get(message.author.id);
    if (!player.faction) {
        message.channel.send("You haven't joined a faction yet...");
        return;
    }

    if (!player.faction) {
        message.channel.send("You haven't joined a faction yet...");
        return;
    }

    const faction_store = new AvalwynStorage().faction_storage;
    const faction = faction_store.get(player.faction);
    const has_falcon = faction.diplomats.some((diplomat) => diplomat === "falcon");

    if(!has_falcon) {
        message.channel.send("Nice try, but your faction doesn't have Falcon on the roster.");
        return;
    }


    if(!valid_factions.includes(faction_key)) {
        message.channel.send(`\`${faction_key}\` is not a valid faction.`);
        return;
    }

    const faction_info = get_faction_info(faction_key);

    message.author.send(faction_info);
}