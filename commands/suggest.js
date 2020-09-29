const fs = require("fs");
var os = require("os");
const userLookup = require("../userLookup.js");
const logPrinter = require("../logPrinter.js");

exports.run = (client, message, args) => {
    //Get arguments
    let suggestion = args;
    if (suggestion == "") {
        message.reply("please include a suggestion for the bot.");
        return;
    }

    //Prepare the suggestion as a sentence
    var finalsuggestion = suggestion.slice(0, suggestion.length - 1).join(' ') + " " + suggestion.slice(-1)

    //Append the time and date, as well as the suggester.
    async function store() {
        let username = await userLookup(client, message.author.id);
        var suggestionForStorage = ("[" + (new Date()) + "] " + message.author.id + " (" + username + "): " + finalsuggestion);
        //Store the suggestion
        fs.appendFile("./suggestions.txt", suggestionForStorage + os.EOL, function (err) {
            if (err) throw err;
        });
    }
    store();

    //Announce the suggestion was logged
    logPrinter.printSubmittedSuggestion(client, message.author.id);
    message.reply("thank you for your suggestion, it has been logged. :smiling_face_with_3_hearts:")
    return;
}