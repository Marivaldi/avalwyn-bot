const pickRandom = require("pick-random");

const evil_laugh_gifs = ["https://tenor.com/view/evil-laugh-gif-5632048", "https://tenor.com/view/raccoon-guaxinim-hehehe-treta-gif-9962946", "https://tenor.com/view/the-simpsons-mr-burns-muahahaha-evil-laugh-gif-4482837"]
module.exports = (message) => {
    if(!message) return;

    const evil_laugh_gif = pickRandom(evil_laugh_gifs, {count: 1})[0];
    message.channel.send(evil_laugh_gif);
}