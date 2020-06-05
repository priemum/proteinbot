exports.run = (client, message, args) => {
    //Get user id.
    let user = message.member.user.id;
    //Get argument
    let number = args[0];
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

    //Check argument is a number
    if (isNaN(number)) {
        message.reply("\"" + args[0] + "\" is not a number.");
        return;
    }
    else if (number % 1 != 0) {
        //If number is a decimal
        message.reply("That is a decimal number, please enter a whole number.")
        return;
    }
    else if (number < 1) {
        //If number is negative, reject it
        message.reply("Please dont enter negatives, this is >remove anyway.")
        return;
    }
    else {
        //Increment the points
        for (i = 0; i < number; i++) {
            score.points--
        }
        score = {
            id: `${message.author.id}`,
            points: score.points,
            lastSubmit: `${new Date()}`
        }
        //Write to database
        client.setScore.run(score);
        console.log(message.author.id + " removed " + number + " points.");

        //Announce the removal
        message.reply("removed " + number + " pushups. What a shame. \nYour new total is: " + score.points + " :cold_sweat:")
        return;
    }
}