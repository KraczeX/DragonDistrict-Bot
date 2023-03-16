const { Client, ChatInputCommandInteraction, ApplicationCommandOptionType, EmbedBuilder, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, Collection } = require("discord.js")
const { execute } = require("../../Events/Client/ready")
const editReply = require("../../Systems/editReply")

module.exports = {
     name: "unban",
     description: "unban a member from this server",
     UserPerms: ["BansMembars"],
     BotPerms: ["BanMember"],
     category: "Moderation",
     options: [
          {
               name: "user-id",
               description: "Podaj id użytkownika",
               type: 3,
               required: true
          },

     ],

     /**
     *   @param { Client } client
     *   @param {ChatInputCommandInteraction} interaction
     */
     async execute(interaction, client) {

          await interaction.deferReply({ ephemeral: true })

          const { user, options, guild } = interaction

          const id = user.getString("user-id")
          if (isNaN(id)) return editReply(interaction, `Wprowadź odpowiednie ID!`)

          const bannedMembers = await guild.bans.fetch()
          if(!bannedMembers.find( x => x.user.id === id)) return editReply(interaction, `Ten użytkownik nie ma bana`)

  
          const Embed = new EmbedBuilder()
               .setColor(client.color)

          const row = new ActionRowBuilder().addComponents(

               new ButtonBuilder()
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId("unban-yes")
                    .setLabel("Yes"),

               new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId("unban-no")
                    .setLabel("No")
          )

          const Page = await interaction.editReply({

               embeds: [
                    Embed.setDescription(`** Napewno chcesz odbanować tego użytkownika? **`)
               ],
               components: [row]
          })

          const col = await Page.createMessageComponentCollector({
               componentType: ComponentType.Button,
               time: ms("15s")
          })

          col.on("collect", i => {

               if (i.user.id !== user.id) return

               switch (i.customId) {

                    case "unban-yes": {

                        guild.members.unban(id)

                         interaction.editReply({
                              embeds: [
                                   Embed.setDescription(`${member} dostał unbana`)
                              ],
                              components: []
                         })


                    }
                         break;

                    case "ban-no": {

                         interaction.editReply({
                              embeds: [
                                   Embed.setDescription(`Polecenie ban zostało anulowane`)
                              ],
                              components: []

                         })
                    }
                         break;
               }
          })

          col.on("end", (collected) => {

               if (Collection.size >0) return

               interaction.editReply({
                    embeds: [
                         Embed.setDescription(`Nie dostarczyłeś poprawnej odpowiedzi na czas`)
                    ],
                    components: []
               })
          })

     }
}