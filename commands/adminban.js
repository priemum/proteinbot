const config = require("../config.json");
const logPrinter = require("../logPrinter.js");

exports.run = (client, message, args) => {
    if (config.admins.includes(message.member.user.id)) {
        try {
            //Get the @ of whos to be banned.
            let member = message.mentions.members.first().id;
            //Check the banned database for a ban entry.
            let banDBQuery = client.checkForBan.get(member);
            if (!banDBQuery) {
                //Ban the person
                banDBQuery = {
                    id: `${member}`,
                    banDate: `${new Date()}`
                }
                client.banUser.run(banDBQuery);
                //Declare banning complete.
                message.reply("successfully banned " + args[0] + ".");
                logPrinter.printAdminBannedUser(client, message.author.id, member);
            } else {
                //Person already banned
                message.reply(args[0] + " is already banned.");
            }
        } catch {
            //Declare an error.
            message.reply("error banning user.")
        }
    } else {
        //If insufficient permissions, reject the command.
        message.reply("Insufficient permissions for this command.")
    }
};