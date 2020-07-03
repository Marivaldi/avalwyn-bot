const training_requirements = require('../factions/training_requirements.json');

module.exports = (faction, skill_key) => {
    if(!skill_key in training_requirements) return false;

    const resource_key = training_requirements[skill_key].resource;
    if(!resource_key in faction.resources) return false;

    const available_resources = faction.resources[resource_key];
    const required_resources = training_requirements[skill_key].amount;

    return available_resources >= required_resources
}