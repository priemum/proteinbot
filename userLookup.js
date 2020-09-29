module.exports = function(client, id) {
   client.users.fetch(id).then(user => {
      const result = (user.username+"#"+user.discriminator);
      return result;
   })
}