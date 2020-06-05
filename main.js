/** 
 * Protein
 * Version 1.0
 * Discord bot to keep a tally of points for pushups with a leaderboard system and info system.
 * By Steven Wheeler.
 */

//Load required libraries.
const Discord = require("discord.js");
const Enmap = require("enmap");
const SQLite = require("better-sqlite3")
const fs = require("fs");

//Load config and declare a new client.
const config = require("./config.json");
const client = new Discord.Client();
const sql = new SQLite('./scores.sqlite');
client.config = config;

client.on("ready", () => {
  console.log("Preparing SQL database...");
  const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'scores';").get();
  if (!table['count(*)']) {
    //If the table isn't there, create it and setup the database correctly.
    sql.prepare("CREATE TABLE scores (id TEXT PRIMARY KEY, points INTEGER, lastSubmit DATE);").run();
    //Ensure that the "id" row is always unique and indexed.
    sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON scores (id);").run();
    sql.pragma("synchronous = 1");
    sql.pragma("journal_mode = wal");
  }
  client.getScore = sql.prepare("SELECT * FROM scores WHERE id = ?");
  client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, points, lastSubmit) VALUES (@id, @points, @lastSubmit);");
  console.log("SQL database prepared.");
  console.log("Boot sequence complete.");
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
  console.log("Loading commands...");
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
    console.log(`Loading command "${commandName}" into the command map.`);
    client.commands.set(commandName, props);
  });
    console.log("Commands succesfully loaded.");
});

console.log("Logging into discord...");
client.login(config.token);
console.log("Successfully logged in.");