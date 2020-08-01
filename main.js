/** 
 * Protein
 * Version 1.3.3
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
const client = new Discord.Client();
client.config = config;
//Declare the database files.
const scoresDB = new SQLite('./scores.sqlite');
const bannedDB = new SQLite('./bans.sqlite');

//Upon server program closure, close the database.
process.on('exit', () => {
  console.log("[" + (new Date()) + "] " + "Program termination request detected.");
  console.log("[" + (new Date()) + "] " + "Closing databases safely...");
  scoresDB.close();
  bannedDB.close();
  console.log("[" + (new Date()) + "] " + "Databases closed.");
  console.log("[" + (new Date()) + "] " + "Proceeding to terminate program. Goodbye.");
});
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));

//Function used later in code to update the monthly databases current month.
function updateMonthlyDBMonth() {
  let output = client.getMonthlyScore.get(`MONTH`);
  //Get date info from OS...
  var date = new Date();
  //Split into month with preceeding 0...
  var month = ("0" + (date.getMonth() + 1)).slice(-2);
  //Prepare database entry...
  if (!output) {
    input = {
      id: `MONTH`,
      points: month,
    }
    //Send to database...
    client.setMonthlyScore.run(input);
  }
}

//Function used later in the code to store the last months top 3 in the long term results database.
function storeMonthlyResults(entriesAmount, firstPlace, secondPlace, thirdPlace) {
  //Prepare database entry...
  if (entriesAmount == 0) { //If no winners this month...
    input = {
      resultDate: `${new Date()}`,
      firstPlaceID: "0",
      firstPlaceScore: "0",
      secondPlaceID: "0",
      secondPlaceScore: "0",
      thirdPlaceID: "0",
      thirdPlaceScore: "0"
    }
  }
  else if (entriesAmount == 1) { //If only first place...
    input = {
      resultDate: `${new Date()}`,
      firstPlaceID: firstPlace.id,
      firstPlaceScore: firstPlace.points,
      secondPlaceID: "0",
      secondPlaceScore: "0",
      thirdPlaceID: "0",
      thirdPlaceScore: "0"
    }
  }
  else if (entriesAmount == 2) { //If first place and second place...
    input = {
      resultDate: `${new Date()}`,
      firstPlaceID: firstPlace.id,
      firstPlaceScore: firstPlace.points,
      secondPlaceID: secondPlace.id,
      secondPlaceScore: secondPlace.points,
      thirdPlaceID: "0",
      thirdPlaceScore: "0"
    }
  }
  else { //If first, second and third place...
    input = {
      resultDate: `${new Date()}`,
      firstPlaceID: firstPlace.id,
      firstPlaceScore: firstPlace.points,
      secondPlaceID: secondPlace.id,
      secondPlaceScore: secondPlace.points,
      thirdPlaceID: thirdPlace.id,
      thirdPlaceScore: thirdPlace.points
    }
  }
  //Send to database...
  client.storeMonthlyResult.run(input);
  console.log("[" + (new Date()) + "] " + "Last months results have been sent to storage.");
}

//When client is logged in and declared ready to discord server...
client.on("ready", () => {
  //Declare successful connection to Discord.
  console.log("[" + (new Date()) + "] " + "Successfully logged in as " + client.user.tag + ".");
  //Check for points scheme file.
  console.log("[" + (new Date()) + "] " + "Checking for suitable points scheme...");
  if (fs.existsSync("./pointscheme.json")) {
    console.log("[" + (new Date()) + "] " + "Points scheme was successfully found.");
  }
  //Declare start of DB preparation.
  console.log("[" + (new Date()) + "] " + "Preparing SQL databases...");
  //If the table isn't there, create it and setup the databases correctly.
  scoresDB.prepare("CREATE TABLE IF NOT EXISTS overallScores (id TEXT PRIMARY KEY, points INTEGER, lastSubmit DATE);").run();
  scoresDB.prepare("CREATE TABLE IF NOT EXISTS monthScores (id TEXT PRIMARY KEY, points INTEGER);").run();
  scoresDB.prepare("CREATE TABLE IF NOT EXISTS pastMonthsResults (resultDate DATE, firstPlaceID INTEGER, firstPlaceScore INTEGER, secondPlaceID INTEGER, secondPlaceScore INTEGER, thirdPlaceID INTEGER, thirdPlaceScore INTEGER);").run();
  bannedDB.prepare("CREATE TABLE IF NOT EXISTS bannedIDs (id TEXT PRIMARY KEY, banDate DATE);").run();
  //Ensure that the "id" row is always unique and indexed.
  scoresDB.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_overallScores_id ON overallScores (id);").run();
  scoresDB.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_monthScores_id ON monthScores (id);").run();
  scoresDB.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_pastMonthsResults_id ON pastMonthsResults (resultDate);").run();
  bannedDB.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_bannedIDs_id ON bannedIDs (id);").run();
  //Apply options to scores database.
  scoresDB.pragma("synchronous = 1");
  scoresDB.pragma("journal_mode = wal");
  //Prepare SQL statements.
  client.getScore = scoresDB.prepare("SELECT * FROM overallScores WHERE id = ?");
  client.setScore = scoresDB.prepare("INSERT OR REPLACE INTO overallScores (id, points, lastSubmit) VALUES (@id, @points, @lastSubmit);");
  client.getMonthlyScore = scoresDB.prepare("SELECT * FROM monthScores WHERE id = ?");
  client.setMonthlyScore = scoresDB.prepare("INSERT OR REPLACE INTO monthScores (id, points) VALUES (@id, @points);");
  client.storeMonthlyResult = scoresDB.prepare("INSERT OR REPLACE INTO pastMonthsResults (resultDate, firstPlaceID, firstPlaceScore, secondPlaceID, secondPlaceScore, thirdPlaceID, thirdPlaceScore) VALUES (@resultDate, @firstPlaceID, @firstPlaceScore, @secondPlaceID, @secondPlaceScore, @thirdPlaceID, @thirdPlaceScore);");
  client.checkForBan = bannedDB.prepare("SELECT * FROM bannedIDs WHERE id = ?");
  client.banUser = bannedDB.prepare("INSERT OR REPLACE INTO bannedIDs (id, banDate) VALUES (@id, @banDate);");
  client.unbanUser = bannedDB.prepare("DELETE FROM bannedIDs WHERE id = ?");
  //Check if monthScores has the month entry, else add it.
  updateMonthlyDBMonth();
  //Declare boot complete.
  console.log("[" + (new Date()) + "] " + "SQL databases prepared.");
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

//The following section is to check the monthly database and clear it if its the next month.
function checkForEndOfMonth() {
  //Get date info from OS.
  var date = new Date();
  //Split into month with preceeding 0.
  var month = ("0" + (date.getMonth() + 1)).slice(-2);
  //Get database table creation month.
  let output = client.getMonthlyScore.get(`MONTH`);
  var dbMonth = ("0" + (output.points)).slice(-2);
  //Check if month has changed.
  if (month != dbMonth) {
    //Month has changed...
    console.log("[" + (new Date()) + "] " + "The monthly leaderboard has now expired. resetting for the next month...");
    //Retrieve top 3 of last month.
    const lastMonthWinners = scoresDB.prepare("SELECT * FROM monthScores WHERE ID != 'MONTH' ORDER BY points DESC LIMIT 3;").all();
    //Print the suitable results to log depending on how many positions of the podium were filled.
    if (lastMonthWinners[0] === undefined) {
      //No winners...
      monthWinners = 0;
      console.log("[" + (new Date()) + "] " + "Last months podium:\n[Cont.] 1st: No winner.\n[Cont.] 2nd: No winner.\n[Cont.] 3rd: No winner.");
    } else if (lastMonthWinners[1] === undefined) {
      //First place only...
      monthWinners = 1;
      console.log("[" + (new Date()) + "] " + "Last months podium:\n[Cont.] 1st: " + lastMonthWinners[0].id + " (" + client.users.cache.get(lastMonthWinners[0].id).username + ") with " + lastMonthWinners[0].points + " points.\n[Cont.] 2nd: No winner.\n[Cont.] 3rd: No winner.");
    } else if (lastMonthWinners[2] === undefined) {
      //First and second place only...
      monthWinners = 2;
      console.log("[" + (new Date()) + "] " + "Last months podium:\n[Cont.] 1st: " + lastMonthWinners[0].id + " (" + client.users.cache.get(lastMonthWinners[0].id).username + ") with " + lastMonthWinners[0].points + " points.\n[Cont.] 2nd: " + lastMonthWinners[1].id + " (" + client.users.cache.get(lastMonthWinners[1].id).username + ") with " + lastMonthWinners[1].points + " points.\n[Cont.] 3rd: No winner.");
    } else {
      //First, second and third place filled...
      monthWinners = 3;
      console.log("[" + (new Date()) + "] " + "Last months podium:\n[Cont.] 1st: " + lastMonthWinners[0].id + " (" + client.users.cache.get(lastMonthWinners[0].id).username + ") with " + lastMonthWinners[0].points + " points.\n[Cont.] 2nd: " + lastMonthWinners[1].id + " (" + client.users.cache.get(lastMonthWinners[1].id).username + ") with " + lastMonthWinners[1].points + " points.\n[Cont.] 3rd: " + lastMonthWinners[2].id + " (" + client.users.cache.get(lastMonthWinners[2].id).username + ") with " + lastMonthWinners[2].points + " points.");
    }
    //Send the top 3 into the long term results storage
    storeMonthlyResults(monthWinners, lastMonthWinners[0], lastMonthWinners[1], lastMonthWinners[2]);
    //Drop the old monthly table.
    scoresDB.prepare("DROP TABLE monthScores;").run();
    //Create the new monthly table.
    scoresDB.prepare("CREATE TABLE monthScores (id TEXT PRIMARY KEY, points INTEGER);").run();
    scoresDB.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_monthScores_id ON monthScores (id);").run();
    //Update the tables month info.
    updateMonthlyDBMonth();
    //Declare monthly update complete.
    console.log("[" + (new Date()) + "] " + "The monthly leaderboard has been successfully reset.");
  } else {
    //Month has not changed.
    return;
  }
}
//Run the checkForEndOfMonth function every second.
setInterval(checkForEndOfMonth, 1 * 1000);

//Begin login to discord.
console.log("[" + (new Date()) + "] " + "Logging into discord...");
client.login(config.token);