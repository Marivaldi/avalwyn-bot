const PlayerState = require("../PlayerState");
const valid_factions = require("../factions/valid_factions.json");
const to_faction_name = require("../texts/to_faction_name");
const AvalwynStorage = require("../AvalwynStorage");
const DiplomatState = require('../DiplomatState');
const diplomats = require('../factions/diplomats.json');
const send_message_to_active_channel = require("../helpers/send_message_to_active_channel");

module.exports = async (message, client, argument) => {
    if(!message) return;

    const bot_store = new AvalwynStorage().bot_storage;

    const player = bot_store.get(message.author.id);

    if(!player) {
        message.channel.send(`You haven't even started a game yet, or haven't confirmed on the first prompt. Run the \`${process.env.PREFIX}start\` command, or the \`${process.env.PREFIX}yes\` command.`);
        return;
    }

    if(!player.faction) {
        message.author.send(`Looks like you're not currently a part of any factions. Run \`${process.env.PREFIX}join\` followed by one of these faction names: \`${valid_factions.join(' ')}\``);
        return;
    }

    const diplomat_key = argument;

    const valid_diplomats = Object.keys(diplomats);

    const not_a_valid_diplomat = !valid_diplomats.includes(diplomat_key);
    if(not_a_valid_diplomat) {
        send_message_to_active_channel(""+ message.author +" `" + diplomat_key + "` is not a valid Diplomat. But, hey, come up with an idea for a diplomat and tell <@390639479599136784>.", client);
        return;
    }

    const diplomat_state = new DiplomatState(diplomat_key);

    const diplomat_has_not_appeared = diplomat_state.isWandering();

    if(diplomat_has_not_appeared) {
        message.channel.send(`${diplomats[diplomat_key].name} has not yet appeared... Stop trying to break my bot!`);
        return;
    }

    const diplomat_is_already_hired = diplomat_state.isAlreadyHired();

    if(!diplomat_is_already_hired) {
        message.channel.send(`${diplomats[diplomat_key].name} is not currently employed, and is waiting to be hired...`);
        return;
    }

    const player_state = new PlayerState(message.author.id);
    const player_is_in_proper_state = player_state.currentState() === "generalPlay";
    if(!player_is_in_proper_state) {
        message.channel.send("Something happened. Probably bad code. Let <@390639479599136784> know this happened.");
        return;
    }

    const faction_store = new AvalwynStorage().faction_storage;
    const faction = faction_store.get(player.faction);
    const faction_diplomats = faction.diplomats;
    const diplomat_belongs_to_faction = faction_diplomats.includes(diplomat_key);

    if(!diplomat_belongs_to_faction) {
        message.channel.send(`${diplomats[diplomat_key].name} does not belong to your faction.`);
        return;
    }

    const was_fired = diplomat_state.fire();

    if(!was_fired) {
        message.channel.send(`Something went wrong while trying to fire ${diplomats[diplomat_key].name}... Let <@390639479599136784> know this happend.`);
        return;
    }

    message.channel.send(`${diplomats[diplomat_key].name} is sad that they have been released.`);
    send_message_to_active_channel(`${diplomats[diplomat_key].name} is now a free agent. Run \`${process.env.PREFIX}hire ${diplomat_key}\` to bring them on board.`, client);
}