const { Client, ActivityType } = require("discord.js")
const ms = require("ms")

module.exports = {
     name: "ready",

     /**
     *   @param { Client } client
     */
     async execute(client) {

          const { user, ws } = client

          console.log(`${user.tag} Jest właśnie online!`)

          setInterval(() => {

               const ping = ws.ping

               user.setActivity({
                    name: `Opóźniony w rozwoju o : ${ping} ms`,
                    type: 3
               })

          }, ms("5s"))
     }

}