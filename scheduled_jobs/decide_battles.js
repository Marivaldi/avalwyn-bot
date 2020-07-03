const Discord = require('discord.js');
const send_message_to_active_channel = require('../helpers/send_message_to_active_channel');
const valid_resources = require('../factions/valid_resources.json');
const valid_factions = require('../factions/valid_factions.json');
const pickRandom = require('pick-random');
const random = require('random');
const resource_generation = require('../texts/resource_generation.json');
const to_faction_name = require('../texts/to_faction_name');
const to_resource_name = require('../texts/to_resource_name');
const Storage = require('node-storage');
const FactionState = require('../FactionState');

module.exports = async (faction_store, client) => {
    const any_battles = valid_factions.some((faction_key) => new FactionState(faction_key).isBattling());
    if(!any_battles) return;

    const loss_modifier = random.int(1, 2);
    const embed = new Discord.MessageEmbed()
            .setColor("#8b0000")
            .setTitle("Battle Results")
            .setDescription((loss_modifier === 2) ? "The battles were harsh on this day. Loss of life was twice more than normal." : "After a long day of battle the victors have been decided.");
    valid_factions.forEach((faction_key) => {
        const faction = faction_store.get(faction_key);
        const faction_state = new FactionState(faction_key);
        if(faction_state.isBattling()) {
            const enemy_faction_key = faction_state.battlingWho();
            const enemy = faction_store.get(enemy_faction_key);
            const attack_roll = random.int(1, 20);
            const attack_check = faction.stats.might + attack_roll;
            const defense_roll = random.int(1, 20);
            const defense_check = enemy.stats.fortitude + defense_roll;
            const roll_text = `**${attack_roll} + ${faction.stats.might} (Might)** vs. **${defense_roll} + ${enemy.stats.fortitude} (Fortitude)**`;
            if(attack_check === defense_check) {
                embed.addFields(
                    { name: `${to_faction_name(faction_key)} Met An Equal`, value:  `${roll_text}\nNo lives were lost this day.` },
                )
            }

            if(attack_check > defense_check) {
                const difference = attack_check - defense_check;
                const total_life_loss = difference * loss_modifier;
                enemy.resources.citizens -= total_life_loss;
                const gold_gain = random.int(1, 20);
                faction.resources.gold += gold_gain;
                const life_loss_text = `${to_faction_name(enemy_faction_key)} lost ${total_life_loss} ${to_resource_name(enemy_faction_key, "citizens")}.`;
                const gold_gain_text = `${to_faction_name(faction_key)} gained ${total_life_loss} ${to_resource_name(faction_key, "gold")}.`;
                embed.addFields(
                    { name: `${to_faction_name(faction_key)} Broke the Defenses`, value:  `${roll_text}\n${life_loss_text}\n${gold_gain_text}` },
                )

                faction_store.put(enemy_faction_key, enemy);
            }

            if(defense_check > attack_check) {
                const difference = defense_check - attack_check;
                const total_life_loss = difference * loss_modifier;
                faction.resources.citizens -= total_life_loss
                const life_loss_text = `${to_faction_name(faction_key)} lost ${total_life_loss} ${to_resource_name(faction_key, "citizens")}.`;
                embed.addFields(
                    { name: `${to_faction_name(faction_key)} Failed Their Assault.`, value:  `${roll_text}\n${life_loss_text}` },
                )
                faction_store.put(faction_key, faction);
            }

            faction_state.finishBattle();
        }
    });

    embed.setTimestamp();

    send_message_to_active_channel(embed, client);

    return new Promise((resolve, reject) => {
        resolve('ok')
    });

}