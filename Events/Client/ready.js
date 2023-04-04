const { Client, ActivityType } = require("discord.js")
const ms = require("ms")
const mongoose = require("mongoose")
const mongodbURL = process.env.MONGODBURL

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

          if (!mongodbURL) return

          mongoose.connect(mongodbURL, {

               useNewUrlParser: true,
               useUnifiedTopology: true


          }).then(() => {

               console.log("Connected to Database")

          }).catch(err => console.log(err))
     }

}