const config = require("../config.json");

exports.run = (client, message, args) => {
  //Check if sender has the correct permissions to operate this command.
  if (config.admins.includes(message.member.user.id)) {
    //Get arguments
    let number = args[1];
    //Get mentioned user
    try {
        let member = message.mentions.members.first().id;
        console.log(member);
        //Get current user score
        let score = client.getScore.get(member);
        console.log(score);
        if (score == null) {
            message.reply("no record was found for this user.");
            return;
        }
        if (number == null) {
            message.reply("please specify an amount of pushups to add.")
            return;
        }
        //Check argument is a number
        if (isNaN(number)) {
            message.reply("\"" + args[1] + "\" is not a number.");
            return;
        }
        else if (number % 1 != 0) {
            //If number is a decimal
            message.reply("that is a decimal number, please enter a whole number.")
            return;
        }
        else if (number < 1) {
            //If number is negative, reject it
            message.reply("please dont enter negatives, this is >adminremove anyway.")
            return;
        }
        else {
            //Increment the points
            for (i = 0; i < number; i++) {
                score.points++
            }
            score = {
                id: `${member}`,
                points: score.points,
                lastSubmit: `${new Date()}`
            }
            //Write to database
            client.setScore.run(score);
            console.log(message.author.id + " has administratively added " + number + " points to " + member + ".");

            //Announce the addition
            message.reply("Administratively added " + number + " pushups to " + args[0] + ".\nNew total is: " + score.points + " :muscle:")
            return;
        }
    } 
    catch {
        //Check we have a usable mention
        message.reply("please specify a user to add to.");
        return;
    }
  }
  else {
    //If insufficient permissions, reject the command.
    message.reply("Insufficient permissions for this command.")
  }
};