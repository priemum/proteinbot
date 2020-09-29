const LogPrinter = require("../logPrinter.js");

exports.run = (client, message, args) => {
    //Get updated point scheme
    const pointscheme = require("../pointscheme.json");
    //Get user id.
    let user = message.member.user.id;
    //Get arguments
    let number = args[1];
    let type;
    try {
        type = args[0].toLowerCase();
    } catch {
        message.reply("Please include the name of the sport and the amount of units.");
        return;
    }
    //Get
    //Get current user score
    let allTimeScore = client.getScore.get(message.member.user.id);
    let monthlyScore = client.getMonthlyScore.get(message.member.user.id);

    //Check if we already have an entry
    //If we dont have an entry, initialize at 0.
    if (!allTimeScore) {
        allTimeScore = {
            id: `${message.author.id}`,
            points: 0,
            lastSubmit: `${new Date()}`
        }
        client.setScore.run(allTimeScore);
    }
    if (!monthlyScore) {
        monthlyScore = {
            id: `${message.author.id}`,
            points: 0
        }
        client.setMonthlyScore.run(monthlyScore);
    }

    //Check if sport is valid and get its point value if so
    if (`${type}` in pointscheme) {
        var jsonstring = JSON.stringify(pointscheme)
        var objectValue = JSON.parse(jsonstring);
        sportvalue = objectValue[`${type}`][2];
        sporttype = objectValue[`${type}`][3];
    } else {
        message.reply(`${type}` + " is not a valid or supported sport.");
        LogPrinter.printIndividualFailedRemovingPoints(client, message.author.id, type);
        return;
    }

    //Prepare the type of addition
    if (sporttype == "UNITS") {
        var unittype = "units";
    } else if (sporttype == "TIMED") {
        var unittype = "minutes";
    }

    //Check argument is a number
    if (isNaN(number)) {
        message.reply("\"" + args[0] + "\" is not a number. If the sport you're entering is timed, input the nearest whole minute.");
        return;
    } else if (number % 1 != 0) {
        //If number is a decimal
        message.reply("That is a decimal number, please enter a whole number. If the sport you're entering is timed, input the nearest whole minute.");
        return;
    } else if (number < 1) {
        //If number is negative, reject it
        message.reply("Please dont enter negatives, this is >remove anyway.")
        return;
    } else {
        //CALCULATE THE SPORTS POINT TOTAL
        totalvalue = (sportvalue * number);

        for (i = 0; i < totalvalue; i++) {
            allTimeScore.points--;
            monthlyScore.points--;
        }
        if (allTimeScore.points < 0) {
            allTimeScore.points = 0;
        }
        if (monthlyScore.points < 0) {
            monthlyScore.points = 0;
        }
        allTimeScore = {
            id: `${message.author.id}`,
            points: allTimeScore.points,
            lastSubmit: `${new Date()}`
        }
        monthlyScore = {
            id: `${message.author.id}`,
            points: monthlyScore.points
        }

        //Write to database
        client.setScore.run(allTimeScore);
        client.setMonthlyScore.run(monthlyScore);
        LogPrinter.printIndividualRemovedPoints(client, message.author.id, number, unittype, type, totalvalue);

        //Announce the removal
        message.reply("removed " + number + " " + unittype + " of " + type + ", totalling " + totalvalue + " points. What a shame. \nYour points total this month is: " + monthlyScore.points + " :calendar_spiral: \nYour new all time points total is: " + allTimeScore.points + " :cold_sweat:")
        return;
    }
}