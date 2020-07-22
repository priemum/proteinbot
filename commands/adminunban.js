const config = require("../config.json");

exports.run = (client, message, args) => {
    if (config.admins.includes(message.member.user.id)) {
        try {
            //Get the @ of whos to be unbanned.
            let member = message.mentions.members.first().id;
            //Check the banned database for a ban entry.
            let banDBQuery = client.checkForBan.get(member);
            if (!banDBQuery) {
                //Person is not banned
                message.reply(client.users.cache.get(member).username + " is not banned.");
            } else {
                //Unban the person
                client.unbanUser.run(member);
                message.reply("successfully unbanned " + client.users.cache.get(member).username + ".");
                console.log("[" + (new Date()) + "] " + message.author.id + " (" + client.users.cache.get(message.member.user.id).username + ") has administratively unbanned " + member + " (" + client.users.cache.get(member).username + ").");
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