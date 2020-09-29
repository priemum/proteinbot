const logPrinter = require("../logPrinter.js"); 

module.exports = (client, message) => {
  //Ignore all bots.
  if (message.author.bot) return;

  //Ignore messages not starting with the prefix.
  if (message.content.indexOf(client.config.prefix) !== 0) return;

  //Ignore messages that are direct messaged.
  if (message.channel.type == "dm") return;

  //Cut the message down to its core components.
  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  //Grab the command data from the map.
  const cmd = client.commands.get(command);

  //If that command doesn't exist, ignore message.
  if (!cmd) return;

  //Check if the user is banned, if so, inform the user if they are banned and ignore the message.
  let banDBQuery = client.checkForBan.get(message.author.id);
  if (banDBQuery) {
    //User is banned...
    message.reply("you are banned from using Protein. Sorry. :hammer:\nCommon ban reasons include abusing the points system or intentionally trying to break the bot.");
    logPrinter.printBannedUseAttempt(client, message.author.id);
    return;
  }

  //Run the command.
  cmd.run(client, message, args);
};