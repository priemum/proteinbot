const Discord = require("discord.js");
const SQLite = require("better-sqlite3");
const config = require("../config.json")
const sql = new SQLite('./scores.sqlite');

exports.run = (client, message, args) => {
    //Query database for results of leaderboards.
    const top10OfAllTime = sql.prepare("SELECT * FROM overallScores ORDER BY points DESC LIMIT 10;").all();
    const top10OfMonth = sql.prepare("SELECT * FROM monthScores WHERE ID != 'MONTH' ORDER BY points DESC LIMIT 10;").all();
    //Figure out if user wants monthly leaderboard or all time leaderboard.
    var argument = args[0];
    if (argument != null && argument.toLowerCase() == "all") {
        console.log("[" + (new Date()) + "] " + message.author.id + " (" + client.users.cache.get(message.author.id).username + ") requested the all time leaderboard.");
        allTimeLeaderboard();
    } else {
        console.log("[" + (new Date()) + "] " + message.author.id + " (" + client.users.cache.get(message.author.id).username + ") requested the monthly leaderboard.");
        monthlyLeaderboard();
    }

    //Monthly leaderboard function.
    function monthlyLeaderboard() {
        var date = new Date();
        var month = date.getMonth();
        var monthText = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        //Print leaderboard embed
        const embed = new Discord.MessageEmbed()
            .setTitle("Monthly Leaderboard for " + monthText[month] + " " + date.getFullYear())
            .setColor(0x00AE86)
            .setTimestamp()
            .setFooter("Protein - Type '" + config.prefix + "leaderboard all' to view the all time leaderboard.")

        for (const data of top10OfMonth) {
            const username = client.users.cache.get(data.id).username
            embed.addField(`${username}`, `${data.points} points`);
        }
        if (top10OfMonth.length == 0) {
            embed.addField("No entries for this leaderboard.", "(╯°□°）╯︵ ┻━┻");
        }

        return message.channel.send({
            embed
        });
    }

    //All time leaderboard function.
    function allTimeLeaderboard() {
        //Print leaderboard embed
        const embed = new Discord.MessageEmbed()
            .setTitle("All-time Leaderboard")
            .setColor(0x00AE86)
            .setTimestamp()
            .setFooter("Protein - Type '" + config.prefix + "leaderboard' to view the monthly leaderboard.")

        for (const data of top10OfAllTime) {
            const username = client.users.cache.get(data.id).username
            embed.addField(`${username}`, `${data.points} points`);
        }
        if (top10OfAllTime.length == 0) {
            embed.addField("No entries for this leaderboard.", "(╯°□°）╯︵ ┻━┻");
        }

        return message.channel.send({
            embed
        });
    }
};