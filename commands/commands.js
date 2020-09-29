const fs = require("fs");
const logPrinter = require("../logPrinter.js");

exports.run = (client, message, args) => {
    //initalise array to hold commands list
    var commandarray = [];
    //get commands listed
    fs.readdir("commands", (err, files) => {
        //for each file...
        files.forEach(file => {
            //check the file ends with .js, otherwise ignore it.
            if (!file.endsWith(".js")) return;
            //get the command name from the file name.
            let commandName = file.split(".")[0].toString();
            //push the command into the array.
            commandarray.push(commandName);
        });

        //prepare the string
        var objectValuesAsString = commandarray.toString().split(",").join(", ");

        //print info
        message.reply(":desktop: Commands: " + objectValuesAsString + ".");
        logPrinter.printUserListedCommands(client, message.author.id);
    });
}