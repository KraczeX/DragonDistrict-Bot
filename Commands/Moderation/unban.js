const { Client, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandOptionType} = require("discord.js")
const ms = require("ms")
const EditReply = require("../../Systems/editReply")


module.exports = {
     name: "unban",
     description: "Unbans a member from the server",
     UserPerms: ["BanMembars"],
     BotPerms: ["BanMembers"],
     category: "Moderation",
     options: [
          {
               name: "user-id",
               description: "Wybierz osobę",
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

          const { options, guild } = interaction

          const id = options.getString("user-id")
          if (isNaN(id)) return EditReply(interaction, 'Podaj właściwe ID')

          const bannedMembers = await guild.bans.fetch()
          if (!bannedMembers.find(x => x.user.id === id)) return EditReply(interaction, "Ten użytkownik jest na serwerze")


          const Embed = new EmbedBuilder()
               .setColor(client.color)

          const row = new ActionRowBuilder().addComponents(

               new ButtonBuilder()
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId("ban-yes")
                    .setLabel("Yes"),

               new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId("ban-no")
                    .setLabel("No")
          )

          const Page = await interaction.editReply({

               embeds: [
                    Embed.setDescription(`** Napewno chcesz usunąć tego użytkownika? **`)
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

                    case "ban-yes": {

                         member.ban({ reason })

                         interaction.editReply({
                              embeds: [
                                   Embed.setDescription(`${member} został wyrzucony z serwera: **${reason}** `)
                              ],
                              components: []
                         })

                         member.send({
                              embeds: [
                                   new EmbedBuilder()
                                        .setColor(client.color)
                                        .setDescription(`Dostałeś Bana na **${guild.name}**`)
                              ]
                         }).catch(err => {

                              if (err.code !== 50007) return console.log(err)
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

               if (collection.size >  0) return

               interaction.editReply({
                    embeds: [
                         Embed.setDescription(`Nie dostarczyłeś poprawnej odpowiedzi na czas`)
                    ],
                    components: []
               })
          })

     }
}