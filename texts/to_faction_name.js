module.exports = (command) => {
    switch(command) {
        case "the_north":
            return "Douglass & The North";
        case "krackan":
            return "Allrender & the People of Krackan";
        case "old_country":
            return "Glad, Vlad & Their Old Country";
        default:
            return "an invalid faction name";
    }
}