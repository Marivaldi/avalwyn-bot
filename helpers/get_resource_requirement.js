const training_requirements = require('../factions/training_requirements.json');
module.exports = (skill_key) => {
    if (!(skill_key in training_requirements)) return;
    return training_requirements[skill_key];
}