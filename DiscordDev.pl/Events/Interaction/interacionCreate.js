const {Client, CommandInteraction, InteractionType} = require("discord.js")
const { execute } = require("../Client/ready")
const {ApplicationCommand} = InteractionType
const Reply = require("../../Systems/reply")

     module.exports = {
          name: "interactionCreate",


     /**
     *   @param { CommandInteraction } interaction
     *   @param {Client} client
     */

     async execute (interaction, client) {

          const { user, guild, commandName, member, type} = interaction

          if (!guild || user.bot) return
          if (type !== ApplicationCommand) return 

          const command = client.commands.get(commandName)

          if (!command) return Reply(interaction, "❌", `Wystąpił błąd podczas uruchamiania komendy!`, true) && client.
          commands.delete(commandName)

          if(command.UsePerms && command.UsePerms.length !== 0) if(!member.permissions.has(command.UsePerms)) return Reply(interaction, "❌", `Potrzebujesz \`${command.UsePerms.join(", ")}\`permisji do użycia tej komendy!`, true) 

          if(command.BotPerms && command.BotPerms.length !== 0) if(!member.permissions.has(command.BotPerms)) return Reply(interaction, "❌", `Ja potrzebuje \`${command.BotPerms.join(", ")}\`permisji do użycia tej komendy!`, true) 

          command.execute(interaction, client)
     }

}