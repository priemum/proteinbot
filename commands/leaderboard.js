const Discord = require("discord.js");
const SQLite = require("better-sqlite3");
const sql = new SQLite('./scores.sqlite');

exports.run = (client, message, args) => {

    const top10 = sql.prepare("SELECT * FROM scores ORDER BY points DESC LIMIT 10;").all();
    console.log("[" + (new Date()) + "] " + message.author.id + " requested the leaderboard.");

    //Print leaderboard embed
    const embed = new Discord.MessageEmbed()
        .setTitle("Leaderboard")
        .setColor(0x00AE86)
        .setTimestamp()
	    .setFooter('Protein')

        for(const data of top10) {
            const username = client.users.cache.get(data.id).username
            embed.addField(`${username}`, `${data.points} pushups`);
        }

        return message.channel.send({embed});
};