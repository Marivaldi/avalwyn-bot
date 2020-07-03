const training_requirements = require('../factions/training_requirements.json');
const to_resource_name = require('../texts/to_resource_name');

module.exports = (faction_key, skill_key) => {
    if(!(skill_key in training_requirements)) return;
    const resource_key = training_requirements[skill_key].resource;
    const required_resources = training_requirements[skill_key].amount;
    return `${required_resources} ${to_resource_name(faction_key, resource_key)}`;
}