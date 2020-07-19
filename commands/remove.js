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
    let score = client.getScore.get(message.member.user.id);

    //Check if we already have an entry
    //If we dont have an entry, initialize at 0.
    if (!score) {
        score = {
            id: `${message.author.id}`,
            points: 0,
            lastSubmit: `${new Date()}`
        }
        client.setScore.run(score);
    }

    //Check if sport is valid and get its point value if so
    if (`${type}` in pointscheme) {
        var jsonstring = JSON.stringify(pointscheme)
        var objectValue = JSON.parse(jsonstring);
        sportvalue = objectValue[`${type}`][0];
        sporttype = objectValue[`${type}`][1];
    } else {
        message.reply(`${type}` + " is not a valid or supported sport.");
        console.log("[" + (new Date()) + "] " + message.author.id + " (" + client.users.cache.get(user).username + ") requested an invalid sport of " + type + ".");
        return;
    }

    //Prepare the type of addition
    if (sporttype == "UNITS") {
        var unittype = "units";
    }
    else if (sporttype == "TIMED") {
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

        //Increment the points
        for (i = 0; i < totalvalue; i++) {
            score.points--
        }
        score = {
            id: `${message.author.id}`,
            points: score.points,
            lastSubmit: `${new Date()}`
        }
        //Write to database
        client.setScore.run(score);
        console.log("[" + (new Date()) + "] " + message.author.id + " (" + client.users.cache.get(user).username + ") removed " + number + " " + unittype + " of " + type + ", removing " + totalvalue + " points.");

        //Announce the removal
        message.reply("removed " + number + " " + unittype + " of " + type + ", totalling " + totalvalue + " points. What a shame. \nYour new all time points total is: " + score.points + " :cold_sweat:")
        return;
    }
}