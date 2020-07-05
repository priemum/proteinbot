/** 
 * Protein
 * Version 1.1.0
 * Discord bot to keep a tally of points for exercise with a leaderboard system and info system.
 * Currently planned is a monthly or weekly competition element.
 * By Steven Wheeler.
 */

//Load required libraries.
const Discord = require("discord.js");
const Enmap = require("enmap");
const SQLite = require("better-sqlite3");
const fs = require("fs");

//Load config and declare a new client.
const config = require("./config.json");
const pointscheme = require("./pointscheme.json");
const client = new Discord.Client();
const sql = new SQLite('./scores.sqlite');
client.config = config;

client.on("ready", () => {
  console.log("[" + (new Date()) + "] " + "Successfully logged in as " + client.user.tag + ".");
  console.log("[" + (new Date()) + "] " + "Checking for suitable points scheme...");
  if (fs.existsSync("./pointscheme.json")) {
    console.log("[" + (new Date()) + "] " + "Points scheme was successfully found.");
  }
  console.log("[" + (new Date()) + "] " + "Preparing SQL database...");
  const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'overallScores';").get();
  if (!table['count(*)']) {
    //If the table isn't there, create it and setup the database correctly.
    sql.prepare("CREATE TABLE overallScores (id TEXT PRIMARY KEY, points INTEGER, lastSubmit DATE);").run();
    //Ensure that the "id" row is always unique and indexed.
    sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON overallScores (id);").run();
    sql.pragma("synchronous = 1");
    sql.pragma("journal_mode = wal");
  }
  client.getScore = sql.prepare("SELECT * FROM overallScores WHERE id = ?");
  client.setScore = sql.prepare("INSERT OR REPLACE INTO overallScores (id, points, lastSubmit) VALUES (@id, @points, @lastSubmit);");
  console.log("[" + (new Date()) + "] " + "SQL database prepared.");
  console.log("[" + (new Date()) + "] " + "Boot sequence complete.");
});

//Load the events.
fs.readdir("./events/", (err, files) => {
  //If cant read events, abort.
  if (err) return console.error(err);
  //For each file...
  files.forEach(file => {
    //Declare it as required.
    const event = require(`./events/${file}`);
    //Get the event name from the file name.
    let eventName = file.split(".")[0];
    //Listen for event.
    client.on(eventName, event.bind(null, client));
  });
});

//Prepare a map of commands.
client.commands = new Enmap();

//Read the commands folder.
fs.readdir("./commands/", (err, files) => {
  console.log("[" + (new Date()) + "] " + "Loading commands...");
  //If cant read events, abort.
  if (err) return console.error(err);
  //For each file...
  files.forEach(file => {
    //Check the file ends with .js, otherwise ignore it.
    if (!file.endsWith(".js")) return;
    //Declare the command as required.
    let props = require(`./commands/${file}`);
    //Get the command name from the file name.
    let commandName = file.split(".")[0];
    //Load the command into the map.
    console.log("[" + (new Date()) + "] " + `Loading command "${commandName}" into the command map.`);
    client.commands.set(commandName, props);
  });
    console.log("[" + (new Date()) + "] " + "Commands succesfully loaded.");
});

console.log("[" + (new Date()) + "] " + "Logging into discord...");
client.login(config.token);