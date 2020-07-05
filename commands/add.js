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
    let score = client.getScore.get(message.member.user.id);
    //Load "motivation"
    var coulddobetter = ['Could do better...', 'Maybe push yourself more next time?', 'C\'mon!', 'Weirdchamp', 'I\'m still under development too...']
    var positive = ['Nice work.', 'Nailed it!', 'Keep it up!', 'Legendary!', 'Poggers!', 'Pogchamp.', 'Whoa!', 'Awesome!']

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
        sportvalue = objectValue[`${type}`];
    }
    else {
        message.reply(`${type}` + " is not a valid or supported sport.");
        console.log("[" + (new Date()) + "] " + message.author.id + " (" + client.users.cache.get(user).username + ") requested an invalid sport of " + type + ".");
        return;
    }


    //Check argument is a number
    if (number == null) {
        message.reply("Please enter a number. If the sport you're entering is timed, input the nearest whole minute.");
    }
    else if (isNaN(number)) {
        message.reply("\"" + args[1] + "\" is not a number. If the sport you're entering is timed, input the nearest whole minute.");
        return;
    }
    else if (number % 1 != 0) {
        //If number is a decimal
        message.reply("That is a decimal number, please enter a whole number. If the sport you're entering is timed, input the nearest whole minute.")
        return;
    }
    else if (number < 1) {
        //If number is negative, reject it
        message.reply("That is a negative number, use >remove if you want to remove.")
        return;
    }
    else {
        //CALCULATE THE SPORTS POINT TOTAL
        totalvalue = (sportvalue * number);

        //Increment the points
        for (i = 0; i < totalvalue; i++) {
            score.points++
        }
        score = {
            id: `${message.author.id}`,
            points: score.points,
            lastSubmit: `${new Date()}`
        }
        //Write to database
        client.setScore.run(score);
        console.log("[" + (new Date()) + "] " + message.author.id + " (" + client.users.cache.get(user).username + ") added " + number + " units of " + type + ", totalling " + totalvalue + " points.");

        //Prepare the "motivation"
        if (number < 20) {
            selectedmotivation = coulddobetter[Math.floor(Math.random() * coulddobetter.length)]
        }
        else {
            selectedmotivation = positive[Math.floor(Math.random() * positive.length)]
        }

        //Announce the addition
        message.reply("added " + number + " units of " + type + ", totalling " + totalvalue + " points. " + selectedmotivation + " \nYour new all time points total is: " + score.points + " :muscle:")
        return;
    }
}