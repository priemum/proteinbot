const config = require("../config.json");
const pointscheme = require("../pointscheme.json");

exports.run = (client, message, args) => {
    //get sports listed
    var jsonstring = JSON.stringify(pointscheme)
    var objectValue = JSON.parse(jsonstring);
    var objectValuesIsolated = Object.keys(objectValue);
    var objectValuesAsString = objectValuesIsolated.toString().split(",").join(", ");
    
    //print info
    message.reply(":basketball: The current supported sports are: " + objectValuesAsString + ".");
    console.log("[" + (new Date()) + "] " + message.author.id + " (" + client.users.cache.get(message.author.id).username + ") ran the sports command.");
}