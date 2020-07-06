const PlayerState = require("../PlayerState");
const FactionState = require("../FactionState");
const valid_factions = require("../factions/valid_factions.json");
const to_faction_name = require("../texts/to_faction_name");
const send_message_to_faction_leaders = require('../helpers/send_message_to_faction_leaders');
const all_spells = require('../factions/spells.json');
const AvalwynStorage = require("../AvalwynStorage");
const battle = require("./battle");
const special_arguments = ["cancel"]

module.exports = async (message, client, argument, target) => {
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

    const spell = argument;
    const faction_state = new FactionState(player.faction);
    const argument_is_special_case = special_arguments.includes(argument);
    if(argument_is_special_case) {
        switch(argument) {
            case "cancel":
                cancel_spell(message, faction_state, player, client, spell);
                break;
            default:
                break;
        }
        return;
    }

    const enemy = target;

    if(!enemy) {
        message.author.send(`You must specify the target of a spell. \`${process.env.PREFIX}cast [spell] [target]\``);
        return;
    }

    const not_a_valid_faction = !valid_factions.includes(enemy);
    if(not_a_valid_faction) {
        const factions_not_including_own = valid_factions.filter((faction) => faction !== player.faction);
        message.author.send(`\`${enemy}\` is not a valid faction. Run \`${process.env.PREFIX}cast\` followed by one of these: \`${factions_not_including_own.join(', ')}\``);
        return;
    }

    const player_state = new PlayerState(message.author.id);
    const playerIsInProperState = player_state.currentState() === "generalPlay";
    if(!playerIsInProperState) {
        message.author.send("Something happened. Probably bad code. Let <@390639479599136784> know this happened.");
        return;
    }

    const factionIsAlreadyBattling = faction_state.isBattling();
    if(factionIsAlreadyBattling) {
        const existing_enemy = faction_state.battlingWho();
        message.author.send(`You already have a battle pending with ${to_faction_name(existing_enemy)}. Run \`${process.env.PREFIX}battle cancel\` or \`${process.env.PREFIX}cancel_battle\` if you'd like to withdraw your troops from the battlefield.`);
        return;
    }

    const factionIsAlreadyCasting = faction_state.isCasting();
    if(factionIsAlreadyCasting) {
        const existing_enemy = faction_state.castingAgainstWho();
        const pending_spell = faction_state.castingWhichSpell();
        message.author.send(`You are already casting ${pending_spell} on ${to_faction_name(existing_enemy)}. You can't cast and battle on the same day.\nRun \`${process.env.PREFIX}cast cancel\` or \`${process.env.PREFIX}cancel_spell\` if you'd like to cancel the pending spell, and try casting a new one.`);
        return;
    }


    if(!(spell in all_spells)) {
        message.author.send("`" + spell + "` is not a valid spell. Ask <@390639479599136784> to make it real.");
        return;
    }

    const player_is_trying_to_cast_on_self = player.faction === enemy;
    if(player_is_trying_to_cast_on_self && !all_spells[spell].can_cast_on_self) {
        message.author.send(`Unfortunately, ${all_spells[spell].name} cannot be cast on self. Run the \`${process.env.PREFIX}spells\` to get more information.`);
        return;
    }

    const level_required_to_cast = all_spells[spell].magic_level_requirement;
    const faction_store = new AvalwynStorage().faction_storage;
    const faction = faction_store.get(player.faction);
    const actual_magic_level = faction.stats.magic;
    if (level_required_to_cast > actual_magic_level) {
        message.author.send(`Your faction's MAGIC has to be level ${level_required_to_cast} in order to cast **${all_spells[spell].name}**. Train up homies. :man_mage:`);
        return;
    }

    const pending_spells = await get_spells();
    const enemy_is_target_of_spell = (enemy in pending_spells);
    const enemy_is_target_of_ward = enemy_is_target_of_spell && pending_spells[enemy] === "ward";
    if(enemy_is_target_of_ward) {
        const subject = (enemy === player.faction) ? `You are` : `${to_faction_name(enemy)} is`; 
        message.channel.send(`${subject} being targeted by the Ward spell. No other spells can be cast with that target.`);
        return;
    }

    if(spell === "mass_misty_step") {
        battle(message, client, enemy, false);
        faction_state.setSpell(spell);
    } else {
        faction_state.castSpell(enemy, spell);
    }

    const casting_message = `:man_mage: You've chosen to cast ${all_spells[spell].name} on ${to_faction_name(enemy)} :man_mage:`;
    send_message_to_faction_leaders(casting_message, player.faction, client)
}

function cancel_spell(message, faction_state, player, client, spell) {
    if(!faction_state.isCasting() && faction_state.castingWhichSpell() !== "mass_misty_step") {
        message.author.send("You're not casting right now...");
        return;
    }

    const pending_spell = faction_state.castingWhichSpell();
    const spell_target = faction_state.castingAgainstWho();

    if(pending_spell === "mass_misty_step") {
        battle(message, client, "cancel", false);
        faction_state.removeSpell();
    } else {
        faction_state.cancelSpell();
    }

    send_message_to_faction_leaders(`${message.author} has decide not to cast ${all_spells[pending_spell].name} on ${to_faction_name(spell_target)}. Take it up with them.`, player.faction, client)
}

async function get_spells() {
    let pending_spells = {};
    for(let i = 0; i < valid_factions.length; i ++) {
        const faction_key = valid_factions[i];
        const faction_state = new FactionState(faction_key);
        if(!faction_state.isCasting()) continue;

        pending_spells[faction_state.castingAgainstWho()] = faction_state.castingWhichSpell();
    }

    return new Promise((resolve, reject) => {
        resolve(pending_spells)
    });
}