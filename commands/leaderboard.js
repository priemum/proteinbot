const Discord = require("discord.js");
const SQLite = require("better-sqlite3");
const config = require("../config.json")
const logPrinter = require("../logPrinter.js");
const sql = new SQLite('./scores.sqlite');
const userLookup = require("../userLookup.js");

exports.run = (client, message, args) => {
    //Query database for results of leaderboards.
    const top10OfAllTime = sql.prepare("SELECT * FROM overallScores ORDER BY points DESC LIMIT 10;").all();
    const top10OfMonth = sql.prepare("SELECT * FROM monthScores WHERE ID != 'MONTH' ORDER BY points DESC LIMIT 10;").all();
    //Figure out if user wants monthly leaderboard or all time leaderboard.
    var argument = args[0];
    if (argument != null && argument.toLowerCase() == "all") {
        logPrinter.printUserRequestedAllTimeLeaderboard(client, message.author.id);
        allTimeLeaderboard();
    } else {
        logPrinter.printUserRequestedMonthlyLeaderboard(client, message.author.id);
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

            async function printMonthlyLeaderboard() {
                if (top10OfMonth.length == 0) {
                    embed.addField("No entries for this leaderboard.", "(╯°□°）╯︵ ┻━┻");
                    return message.channel.send({
                        embed
                    });
                }
                else {
                    for (const data of top10OfMonth) {
                        let username = await userLookup(client,data.id);
                        embed.addField(`${username}`, `${data.points} points`);
                    }
                    return message.channel.send({
                        embed
                    });
                }
            }
        printMonthlyLeaderboard();
    }

    //All time leaderboard function.
    function allTimeLeaderboard() {
        //Print leaderboard embed
        const embed = new Discord.MessageEmbed()
            .setTitle("All-time Leaderboard")
            .setColor(0x00AE86)
            .setTimestamp()
            .setFooter("Protein - Type '" + config.prefix + "leaderboard' to view the monthly leaderboard.")

            async function printAllTimeLeaderboard() {
                if (top10OfAllTime.length == 0) {
                    embed.addField("No entries for this leaderboard.", "(╯°□°）╯︵ ┻━┻");
                    return message.channel.send({
                        embed
                    });
                }
                else {
                    for (const data of top10OfAllTime) {
                        let username = await userLookup(client,data.id);
                        embed.addField(`${username}`, `${data.points} points`);
                    }
                    return message.channel.send({
                        embed
                    });
                }
            }
        printAllTimeLeaderboard();
    }        
};
