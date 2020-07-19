exports.run = (client, message, args) => {
    try {
        //See if a user was mentioned
        let member = message.mentions.members.first().id;
        //Get mentioned user score
        let score = client.getScore.get(member);
        if (score == null) {
            message.reply("no record was found for this user.");
            return;
        }
        //Print mentioned users score
        message.reply(args[0] + "\'s total is " + score.points + " points. :muscle:")
        message.reply("Please note, the 'total' command is depreciated and will be removed in the future. Please use the 'profile' command instead");
        console.log("[" + (new Date()) + "] " + message.author.id + " (" + client.users.cache.get(message.author.id).username + ") requested " + member + " ( " + client.users.cache.get(member).username + ") 's total of " + score.points + ".");
        return;
    } catch {
        //Get requesters score
        let score = client.getScore.get(message.member.user.id)
        //Check if we already have an entry
        //If we dont have an entry, initialize at 0.
        if (!score) {
            score = {
                id: `${message.author.id}`,
                points: 0,
                lastSubmit: `${new Date()}`
            }
            //Write to database
            client.setScore.run(score);
        }
        //Print requesters score
        message.reply("your total is " + score.points + " points. :muscle:")
        message.reply("Please note, the 'total' command is depreciated and will be removed in the future. Please use the 'profile' command instead");
        console.log("[" + (new Date()) + "] " + message.author.id + " (" + client.users.cache.get(message.author.id).username + ") requested their total of " + score.points + ".");
        return;
    }
};