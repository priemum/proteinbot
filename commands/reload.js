const config = require("../config.json");
const logPrinter = require("../logPrinter.js");

exports.run = (client, message, args) => {
  //Check if sender has the correct permissions to operate this command.
  if (config.admins.includes(message.member.user.id)) {
    //Check for command name.
    if (!args || args.length < 1) return message.reply("Must provide a command name to reload.");
    const commandName = args[0];
    //Check if the command exists and is valid.
    if (!client.commands.has(commandName)) {
      return message.reply("That command does not exist");
    }
    //Delete the command from the require cache.
    delete require.cache[require.resolve(`./${commandName}.js`)];
    //Delete the command from the commands map.
    client.commands.delete(commandName);
    //Declare the command as required.
    const props = require(`./${commandName}.js`);
    //Add the command to the commands map.
    client.commands.set(commandName, props);
    //Signal reload completion.
    message.reply(`The command ${commandName} has been reloaded`);
    logPrinter.printAdminRequestedReload(client, message.author.id, commandName);
  } else {
    //If insufficient permissions, reject the command.
    message.reply("Insufficient permissions for this command.")
  }
};