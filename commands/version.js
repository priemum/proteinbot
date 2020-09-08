const buildinfo = require("../buildinfo.json");

exports.run = (client, message, args) => {
    //get build info
    var jsonstring = JSON.stringify(buildinfo.changelog)
    var objectValue = JSON.parse(jsonstring);
    var objectValuesAsString = objectValue.toString().split(",").join("\n");

    if (objectValuesAsString == "") {
        //print info no changelog
        message.channel.send(":robot: **Welcome to Protein v" + buildinfo.softwareVersion + "**\n\n*Version changelog:*\n" + "No changelog was provided for this version.");
    } else {
        //print info with changelog
        message.channel.send(":robot: **Welcome to Protein v" + buildinfo.softwareVersion + "**\n\n*Version changelog:*\n" + objectValuesAsString);
    }

    //log the use of the command
    console.log("[" + (new Date()) + "] " + message.author.id + " (" + client.users.cache.get(message.author.id).username + ") ran the version command.");
}