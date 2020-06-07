const Discord = require("discord.js");

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
        
        const username = client.users.cache.get(member).username;
        console.log("[" + (new Date()) + "] " + message.author.id + " requested the info of " + member + ".");
        const embed = new Discord.MessageEmbed()
            .setTitle("Info for " + username)
            .setColor(0x00AE86)
            .setTimestamp()
            .setFooter('Protein')

            .addField(`Number of pushups:`, `${score.points}`)
            .addField(`Last pushups added at:`, `${score.lastSubmit}`)

            return message.channel.send({embed});
    } 
    catch {
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
        console.log("[" + (new Date()) + "] " + message.author.id + " requested their info.");
        //Print requesters score
        const embed = new Discord.MessageEmbed()
        .setTitle("Info for " + client.users.cache.get(message.member.user.id).username)
        .setColor(0x00AE86)
        .setTimestamp()
        .setFooter('Protein')

        .addField(`Number of pushups:`, `${score.points}`)
        .addField(`Last pushups added at:`, `${score.lastSubmit}`)

        return message.channel.send({embed});
    }
};