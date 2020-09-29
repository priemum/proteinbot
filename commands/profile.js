const Discord = require("discord.js");
const logPrinter = require("../logPrinter.js");

exports.run = (client, message, args) => {
    try {
        //See if a user was mentioned
        let member = message.mentions.members.first().id;
        //Get mentioned user score
        let allTimeScore = client.getScore.get(member);
        let monthlyScore = client.getMonthlyScore.get(member);
        //If user is not in db, add record
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

        const username = client.users.cache.get(member).username;
        logPrinter.printUserRequestedOtherProfile(client, message.author.id, member);
        const embed = new Discord.MessageEmbed()
            .setTitle("Info for " + username)
            .setColor(0x00AE86)
            .setTimestamp()
            .setFooter('Protein')

            .addField(`Points earned this month:`, `${monthlyScore.points}`)
            .addField(`Total points:`, `${allTimeScore.points}`)
            .addField(`Last exercise added at:`, `${allTimeScore.lastSubmit}`)

        return message.channel.send({
            embed
        });
    } catch {
        //Get requesters score
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
        logPrinter.printUserRequestedSelfProfile(client, message.author.id);
        //Print requesters score
        const embed = new Discord.MessageEmbed()
            .setTitle("Info for " + client.users.cache.get(message.member.user.id).username)
            .setColor(0x00AE86)
            .setTimestamp()
            .setFooter('Protein')

            .addField(`Points earned this month:`, `${monthlyScore.points}`)
            .addField(`Total points:`, `${allTimeScore.points}`)
            .addField(`Last exercise added at:`, `${allTimeScore.lastSubmit}`)

        return message.channel.send({
            embed
        });
    }
};