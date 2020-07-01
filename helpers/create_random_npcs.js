
const request = require('request');
const random = require("random");

module.exports = (count) => {
    if(count < 1) return;

    request(`http://names.drycodes.com/${count}?nameOptions=boy_names&separator=space`, { json: true }, (err, res, random_names) => {
      if (err) { return console.log(err); }
      
      // const random_npcs = [];
      // random_names.forEach((name) => {
      //   random.
      // })
    });
}