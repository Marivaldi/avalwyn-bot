const Storage = require('node-storage');
const send_message_to_active_channel = require('../helpers/send_message_to_active_channel');
const bot_store = new Storage('./data/bot_data');

module.exports = async (message, client) => {
        let is_bot_owner = message.author.id === '390639479599136784';
        if (!is_bot_owner) {
                message.channel.send("Hey... You're not <@390639479599136784>! Nice try, buddy. :beers:");
                return;
        }
        await send_message_to_active_channel("I'm going down for maintenance... hopefully :grimacing:", client)
        client.destroy();
}