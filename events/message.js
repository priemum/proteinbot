module.exports = (client, message) => {
    //Ignore all bots.
    if (message.author.bot) return;
  
    //Ignore messages not starting with the prefix.
    if (message.content.indexOf(client.config.prefix) !== 0) return;
  
    //Cut the message down to its core components.
    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
  
    //Grab the command data from the map.
    const cmd = client.commands.get(command);
  
    //If that command doesn't exist, ignore message.
    if (!cmd) return;
  
    //Run the command.
    cmd.run(client, message, args);
  };