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
    //Get current user score
    let allTimeScore = client.getScore.get(message.member.user.id);
    let monthlyScore = client.getMonthlyScore.get(message.member.user.id);
    //Load "motivation"
    var coulddobetter = ['Could do better...', 'Maybe push yourself more next time?', 'C\'mon!', 'Weirdchamp', 'I\'m still under development too...']
    var positive = ['Nice work.', 'Nailed it!', 'Keep it up!', 'Legendary!', 'Poggers!', 'Pogchamp.', 'Whoa!', 'Awesome!']

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
    if (number == null) {
        message.reply("Please enter a number. If the sport you're entering is timed, input the nearest whole minute.");
    } else if (isNaN(number)) {
        message.reply("\"" + args[1] + "\" is not a number. If the sport you're entering is timed, input the nearest whole minute.");
        return;
    } else if (number % 1 != 0) {
        //If number is a decimal
        message.reply("That is a decimal number, please enter a whole number. If the sport you're entering is timed, input the nearest whole minute.")
        return;
    } else if (number < 1) {
        //If number is negative, reject it
        message.reply("That is a negative number, use >remove if you want to remove.")
        return;
    } else {
        //CALCULATE THE SPORTS POINT TOTAL
        totalvalue = (sportvalue * number);

        //Increment the points
        for (i = 0; i < totalvalue; i++) {
            allTimeScore.points++;
            monthlyScore.points++;
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
        console.log("[" + (new Date()) + "] " + message.author.id + " (" + client.users.cache.get(user).username + ") added " + number + " " + unittype + " of " + type + ", totalling " + totalvalue + " points.");

        //Prepare the "motivation"
        if (number < 20) {
            selectedmotivation = coulddobetter[Math.floor(Math.random() * coulddobetter.length)]
        } else {
            selectedmotivation = positive[Math.floor(Math.random() * positive.length)]
        }

        //Announce the addition
        message.reply("added " + number + " " + unittype + " of " + type + ", totalling " + totalvalue + " points. " + selectedmotivation + " \nYour points total this month is: " + monthlyScore.points + " :calendar_spiral:\nYour new all time points total is: " + allTimeScore.points + " :muscle:")
        return;
    }
}