const {Client, ChatInputCommandInteraction} = require("discord.js")
const { execute } = require("../../Events/Client/ready")
const Reply = require("../../Systems/reply")

     module.exports = {
          name: "ping",
          description: "Displays the ping",
          category: "Information",

     /**
     *   @param { Client } client
     *   @param {ChatInputCommandInteraction} interaction
     */
     async execute(interaction, client) {
          return Reply(interaction, "⌛", `Twój aktualny ping wynosi: \`${client.ws.ping} ms\``, false)
     }
     }
     