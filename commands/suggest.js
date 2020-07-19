const fs = require("fs");
var os = require("os");

exports.run = (client, message, args) => {
    //Get user
    let user = message.member.user.id;
    //Get arguments
    let suggestion = args;
    if (suggestion == "") {
        message.reply("please include a suggestion for the bot.");
        return;
    }

    //Prepare the suggestion as a sentence
    var finalsuggestion = suggestion.slice(0, suggestion.length - 1).join(' ') + " " + suggestion.slice(-1)

    //Append the time and date, as well as the suggester.
    var suggestionForStorage = ("[" + (new Date()) + "] " + message.author.id + " (" + client.users.cache.get(message.author.id).username + "): " + finalsuggestion);
    
    //Store the suggestion
    fs.appendFile("./suggestions.txt", suggestionForStorage + os.EOL, function (err) {
        if (err) throw err;
    });

    //Announce the suggestion was logged
    console.log("[" + (new Date()) + "] " + message.author.id + " (" + client.users.cache.get(message.author.id).username + ") successfully filed a suggestion.");
    message.reply("thank you for your suggestion, it has been logged. :smiling_face_with_3_hearts:")
    return;
}