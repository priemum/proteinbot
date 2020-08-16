const buildinfo = require("../buildinfo.json");

exports.run = (client, message, args) => {
    //get build info
    var jsonstring = JSON.stringify(buildinfo.changelog)
    var objectValue = JSON.parse(jsonstring);
    var objectValuesAsString = objectValue.toString().split(",").join("\n");

    //print info
    message.channel.send(":robot: **Welcome to Protein v" + buildinfo.softwareVersion + "**\n\n*Version changelog:*\n" + objectValuesAsString);
    console.log("[" + (new Date()) + "] " + message.author.id + " (" + client.users.cache.get(message.author.id).username + ") ran the version command.");
}