const Discord = require('discord.js');
const send_message_to_active_channel = require('../helpers/send_message_to_active_channel');
const valid_factions = require('../factions/valid_factions.json');
const random = require('random');
const to_faction_name = require('../texts/to_faction_name');
const to_resource_name = require('../texts/to_resource_name');
const FactionState = require('../FactionState');

module.exports = async (faction_store, client) => {
    const any_battles = valid_factions.some((faction_key) => new FactionState(faction_key).isBattling());
    if (!any_battles) return;

    const d = new Date();
    console.log("Deciding Battles...", d.toLocaleString('en-US', { timeZone: 'America/New_York' }));

    const loss_modifier = 1; // random.int(1, 2);
    const embed = new Discord.MessageEmbed()
        .setColor("#8b0000")
        .setTitle("Battle Results")
        .setDescription((loss_modifier === 2) ? "The battles were harsh on this day. Loss of life was twice more than normal." : "After a long day of battle the victors have been decided.");

    const spells = await get_spells();



    valid_factions.forEach((faction_key) => {
        const faction = faction_store.get(faction_key);
        const faction_state = new FactionState(faction_key);

        if (faction_state.isBattling()) {
            const enemy_faction_key = faction_state.battlingWho();
            const enemy = faction_store.get(enemy_faction_key);

            const attacker_has_colt = faction.diplomats.some((diplomat) => diplomat === "colt");

            const defender_is_target_of_spell = (enemy_faction_key in spells);
            const defender_is_target_of_protection = defender_is_target_of_spell && spells[enemy_faction_key] === "protection";
            const defender_is_target_of_fortify = defender_is_target_of_spell && spells[enemy_faction_key] === "fortify"
            const fortify_bonus = (defender_is_target_of_fortify) ? 2 : 0;
            const fortify_text = (defender_is_target_of_fortify) ? " + 2 (Fortify Spell)" : "";
            const colt_bonus = (attacker_has_colt) ? 3 : 0;
            const colt_text = (defender_is_target_of_fortify) ? " + 3 (Colt Lonestar Jackson)" : "";
            const attack_roll = random.int(1, 20);
            const attack_check = faction.stats.might + attack_roll + colt_bonus;
            const defense_roll = random.int(1, 20);
            const defense_check = enemy.stats.fortitude + defense_roll + fortify_bonus;
            const roll_text = `**${attack_roll} + ${faction.stats.might} (Might)${colt_text}** vs. **${defense_roll} + ${enemy.stats.fortitude} (Fortitude)${fortify_text}**`;


            const attacker_has_danson = faction.diplomats.some((diplomat) => diplomat === "danson");
            const defender_has_ricky = faction.diplomats.some((diplomat) => diplomat === "ricky");

            if(defender_is_target_of_protection) {
                embed.addFields({
                    name: `${to_faction_name(faction_key)} Met An Equal`,
                    value: `Mysterious forces protected ${to_faction_name(enemy_faction_key)}`
                }, )
            }

            if (attack_check === defense_check && !defender_is_target_of_protection) {
                embed.addFields({
                    name: `${to_faction_name(faction_key)} Met An Equal`,
                    value: `${roll_text}\nNo lives were lost this day.`
                }, )
            }

            if (attack_check > defense_check && !defender_is_target_of_protection) {
                const difference = attack_check - defense_check;
                const ricky_text = (defender_has_ricky) ? `Ricky: *"Don't worry, boss. I'll take one for the team."*` : "";
                const ricky_mod = (defender_has_ricky) ? 2 : 1;
                const total_life_loss = Math.round((difference * loss_modifier) / ricky_mod);
                enemy.resources.citizens -= total_life_loss;
                const danson_son_text = "";
                if (attacker_has_danson) {
                    const danson_gain = Math.round(total_life_loss / 2);
                    faction.resources.citizens += danson_gain
                    danson_son_text = `Danson: *"${to_faction_name(faction_key)} can have ${danson_gain} of my sons"*`;
                }
                enemy.resources.citizens = (enemy.resources.citizens < 0) ? 0 : enemy.resources.citizens;
                const total_loss_text = (enemy.resources.citizens === 0) ? "the rest of their" : total_life_loss;
                const gold_gain = random.int(1, 20);
                faction.resources.gold += gold_gain;
                const life_loss_text = `${to_faction_name(enemy_faction_key)} lost ${total_loss_text} ${to_resource_name(enemy_faction_key, "citizens")}.`;
                const gold_gain_text = `${to_faction_name(faction_key)} gained ${gold_gain} ${to_resource_name(faction_key, "gold")}.`;
                embed.addFields({
                    name: `${to_faction_name(faction_key)} Broke the Defenses`,
                    value: `${roll_text}\n${life_loss_text}\n${ricky_text}\n${gold_gain_text}\n${danson_son_text}`
                }, )

                faction_store.put(enemy_faction_key, enemy);
            }

            if (defense_check > attack_check && !defender_is_target_of_protection) {
                const difference = defense_check - attack_check;
                const total_life_loss = difference * loss_modifier;
                faction.resources.citizens -= total_life_loss
                faction.resources.citizens = (faction.resources.citizens < 0) ? 0 : faction.resources.citizens;
                const total_loss_text = (faction.resources.citizens === 0) ? "the rest of their" : total_life_loss;
                const life_loss_text = `${to_faction_name(faction_key)} lost ${total_loss_text} ${to_resource_name(faction_key, "citizens")}.`;
                embed.addFields({
                    name: `${to_faction_name(faction_key)} Failed Their Assault.`,
                    value: `${roll_text}\n${life_loss_text}`
                }, )
                faction_store.put(faction_key, faction);
            }

            faction_state.finishBattle();
        }

        if (faction_state.isCasting()) {
            faction_state.finishSpell();
        }
    });

    embed.setTimestamp();

    send_message_to_active_channel(embed, client);

    return new Promise((resolve, reject) => {
        resolve('ok')
    });
}

async function get_spells() {
    const spells = {};
    for(let i = 0; i < valid_factions.length; i ++) {
        const faction_key = valid_factions[i];
        const faction_state = new FactionState(faction_key);
        if(!faction_state.isCasting()) continue;

        spells[faction_state.castingAgainstWho()] = faction_state.castingWhichSpell();
    }

    return new Promise((resolve, reject) => {
        resolve(spells)
    });
}