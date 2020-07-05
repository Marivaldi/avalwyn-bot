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
        message.channel.send("You haven't even started a game yet. Run the `!start` command.");
        return;
    }

    if(!player.faction) {
        message.author.send("Looks like you're not currently a part of any factions. Run `!join` followed by one of these faction names: `" + valid_factions.join(' ') +"`");
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

    if(diplomat_is_already_hired) {
        const employer_faction_key = diplomat_state.employer();
        const employer_is_self = player.faction = employer_faction_key;
        if(employer_is_self) {
            message.channel.send(`You have already hired ${diplomats[diplomat_key].name}.`);
            return;
        }

        message.channel.send(`Sorry... ${diplomats[diplomat_key].name} is already employed by ${to_faction_name(employer_faction_key)}.`);
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

    const was_hired = diplomat_state.hire(player.faction);

    if(!was_hired) {
        const existing_diplomat_key = faction.diplomats[0];
        message.channel.send(`You already have ${diplomats[existing_diplomat_key].name} equipped. Run \`!fire ${existing_diplomat_key}\` to get rid of them. Then, you can try to hire ${diplomats[diplomat_key].name}`);
        return;
    }

    message.channel.send(`${diplomats[diplomat_key].name} is now equipped.`);
}