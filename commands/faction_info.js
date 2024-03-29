const get_faction_info = require("../helpers/get_faction_info")
const AvalwynStorage = require("../AvalwynStorage");

module.exports = (message) => {
    const bot_store = new AvalwynStorage().bot_storage;
    const player = bot_store.get(message.author.id);
    if (!player.faction) {
        message.author.send("You haven't joined a faction yet...");
        return;
    }
    const faction_info = get_faction_info(player.faction);

    message.author.send(faction_info);
}