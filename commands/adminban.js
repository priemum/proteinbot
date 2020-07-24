const config = require("../config.json");

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
                message.reply("successfully banned " + client.users.cache.get(member).username + ".");
                console.log("[" + (new Date()) + "] " + message.author.id + " (" + client.users.cache.get(message.member.user.id).username + ") has administratively banned " + member + " (" + client.users.cache.get(member).username + ").");
            } else {
                //Person already banned
                message.reply(client.users.cache.get(member).username + " is already banned.");
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