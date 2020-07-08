const send_message_to_active_channel = require('../helpers/send_message_to_active_channel');
const upload_data_to_s3 = require('../helpers/upload_data_to_s3');
const to_resource_name = require('../texts/to_resource_name');
const AvalwynStorage = require('../AvalwynStorage');
const to_faction_name = require('../texts/to_faction_name');

module.exports = async (message, client) => {
        let is_bot_owner = message.author.id === '390639479599136784';
        if (is_bot_owner) {
                await send_message_to_active_channel(`:robot: *beep boop* Yeah, yeah. You're the bot owner. You get no gold for syncing data! Write better code, loser. *beep boop* :robot:`, client)
                upload_data_to_s3();
                return;

        }

        const bot_store = new AvalwynStorage().bot_storage;
        const player = bot_store.get(message.author.id);

        if (!player) {
                await send_message_to_active_channel(`:robot: *beep boop* Thank you, ${message.author}! You're not actively playing yet, and you are helping to sync data? Wow. Keep it up. Great moves! *beep boop* :robot:`, client);
                upload_data_to_s3();
                return;
        }

        if(!player.faction) {
                await send_message_to_active_channel(`:robot: *beep boop* Thank you, ${message.author}! You haven't even joined a faction and you're helping sync data? You make me so proud! *beep boop* :robot:`, client);
                upload_data_to_s3();
                return;
        }


        const faction_store = new AvalwynStorage().faction_storage;
        const faction = faction_store.get(player.faction);
        faction.resources.gold += 1;
        faction_store.put(player.faction, faction);
        await send_message_to_active_channel(`:robot: *beep boop* Thank you, ${message.author}! +1 ${to_resource_name(player.faction, "gold")} :moneybag: goes to ${to_faction_name(player.faction)} for helping sync our data. *beep boop* :robot:`, client);
        upload_data_to_s3();
}