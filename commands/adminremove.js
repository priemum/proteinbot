const config = require("../config.json");

exports.run = (client, message, args) => {
    const pointscheme = require("../pointscheme.json");
    //Check if sender has the correct permissions to operate this command.
    if (config.admins.includes(message.member.user.id)) {
        //Get arguments
        let number = args[2];
        let type;
        try {
            type = args[1].toLowerCase();
        } catch {
            message.reply("Please include the name of the sport and the amount of units.");
            return;
        }

        //Check if sport is valid and get its point value if so
        if (`${type}` in pointscheme) {
            var jsonstring = JSON.stringify(pointscheme)
            var objectValue = JSON.parse(jsonstring);
            sportvalue = objectValue[`${type}`];
        } else {
            message.reply(`${type}` + " is not a valid or supported sport.");
            return;
        }

        //Get mentioned user
        try {
            let member = message.mentions.members.first().id;
            //Get current user score
            let score = client.getScore.get(member);
            if (score == null) {
                message.reply("no record was found for this user.");
                return;
            }
            if (number == null) {
                message.reply("please specify an amount of units to remove.")
                return;
            }

            //Check argument is a number
            if (isNaN(number)) {
                message.reply("\"" + args[2] + "\" is not a number.");
                return;
            } else if (number % 1 != 0) {
                //If number is a decimal
                message.reply("that is a decimal number, please enter a whole number.")
                return;
            } else if (number < 1) {
                //If number is negative, reject it
                message.reply("please dont enter negatives, this is >adminremove anyway.")
                return;
            } else {
                //CALCULATE THE SPORTS POINT TOTAL
                totalvalue = (sportvalue * number);

                //Increment the points
                for (i = 0; i < totalvalue; i++) {
                    score.points--
                }
                score = {
                    id: `${member}`,
                    points: score.points,
                    lastSubmit: `${new Date()}`
                }
                //Write to database
                client.setScore.run(score);
                console.log("[" + (new Date()) + "] " + message.author.id + " (" + client.users.cache.get(message.member.user.id).username + ") has administratively removed " + number + " units of " + type + ", totalling " + totalvalue + " points from " + member + " (" + client.users.cache.get(member).username + ").");

                //Announce the addition
                message.reply("Administratively removed " + number + " units of " + type + ", totalling " + totalvalue + " points from " + args[0] + ".\nNew all time points total is: " + score.points + " :muscle:")
                return;
            }
        } catch {
            //Check we have a usable mention
            message.reply("please specify a user to remove from.");
            return;
        }
    } else {
        //If insufficient permissions, reject the command.
        message.reply("Insufficient permissions for this command.")
    }
};