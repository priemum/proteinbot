const config = require("../config.json");
const logPrinter = require("../logPrinter.js");
const pointscheme = require("../pointscheme.json");

exports.run = (client, message, args) => {
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
            sportvalue = objectValue[`${type}`][2];
            sporttype = objectValue[`${type}`][3];
        } else {
            message.reply(`${type}` + " is not a valid or supported sport.");
            return;
        }

        //Prepare the type of addition
        if (sporttype == "UNITS") {
            var unittype = "units";
        } else if (sporttype == "TIMED") {
            var unittype = "minutes";
        }

        //Get mentioned user
        try {
            let member = message.mentions.members.first().id;
            //Get current user score
            let allTimeScore = client.getScore.get(member);
            let monthlyScore = client.getMonthlyScore.get(member);
            if (!allTimeScore) {
                allTimeScore = {
                    id: `${member}`,
                    points: 0,
                    lastSubmit: `${new Date()}`
                }
                client.setScore.run(allTimeScore);
            }
            if (!monthlyScore) {
                monthlyScore = {
                    id: `${member}`,
                    points: 0
                }
                client.setMonthlyScore.run(monthlyScore);
            }
            if (number == null) {
                message.reply("please specify an amount of units to add.")
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
                message.reply("please dont enter negatives, use >adminremove.")
                return;
            } else {
                //CALCULATE THE SPORTS POINT TOTAL
                totalvalue = (sportvalue * number);

                //Increment the points
                for (i = 0; i < totalvalue; i++) {
                    allTimeScore.points++
                    monthlyScore.points++
                }
                allTimeScore = {
                    id: `${member}`,
                    points: allTimeScore.points,
                    lastSubmit: `${new Date()}`
                }
                monthlyScore = {
                    id: `${member}`,
                    points: monthlyScore.points,
                }
                //Write to database
                client.setScore.run(allTimeScore);
                client.setMonthlyScore.run(monthlyScore);
                logPrinter.printAdminAddedPoints(client, message.author.id, member, number, unittype, type, totalvalue);

                //Announce the addition
                message.reply("Administratively added " + number + " " + unittype + " of " + type + ", totalling " + totalvalue + " points to " + args[0] + ".\nPoints total this month is: " + monthlyScore.points + " :calendar_spiral:\nNew all time points total is: " + allTimeScore.points + " :muscle:")
                return;
            }
        } catch {
            //Check we have a usable mention
            message.reply("please specify a valid user to add to.");
            return;
        }
    } else {
        //If insufficient permissions, reject the command.
        message.reply("Insufficient permissions for this command.")
    }
};