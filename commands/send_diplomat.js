const send_message_to_active_channel = require('../helpers/send_message_to_active_channel');
const upload_data_to_s3 = require('../helpers/upload_data_to_s3');
const random_diplomat = require('../scheduled_jobs/random_diplomat');

module.exports = async (message, client) => {
        let is_bot_owner = message.author.id === '390639479599136784';
        if (!is_bot_owner) {
                message.channel.send("Hey... You're not <@390639479599136784>! Nice try, buddy. :beers:");
                return;
        }

        random_diplomat(client);
}