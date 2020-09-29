module.exports = function(client, id) {
   return new Promise((resolve) => {
      client.users.fetch(id).then(user => {
         const result = (user.username+"#"+user.discriminator);
         resolve(result);
      })
   })
}