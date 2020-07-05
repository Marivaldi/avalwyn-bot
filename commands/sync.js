const send_message_to_active_channel = require('../helpers/send_message_to_active_channel');
const upload_data_to_s3 = require('../helpers/upload_data_to_s3');

module.exports = async (message, client) => {
        let is_bot_owner = message.author.id === '390639479599136784';
        if (!is_bot_owner) {
                message.channel.send("Hey... You're not <@390639479599136784>! Nice try, buddy. :beers:");
                return;
        }
        await send_message_to_active_channel(":robot: *beep boop* I'm syncing our data so we don't lose it... again. *beep boop* :robot:", client)
        upload_data_to_s3();
}