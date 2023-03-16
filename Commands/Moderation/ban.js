const { Client, ChatInputCommandInteraction, ApplicationCommandOptionType, EmbedBuilder, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, Collection } = require("discord.js")
const { execute } = require("../../Events/Client/ready")
const editReply = require("../../Systems/editReply")

module.exports = {
     name: "ban",
     description: "ban a member from this server",
     UserPerms: ["BansMembars"],
     BotPerms: ["BanMember"],
     category: "Moderation",
     options: [
          {
               name: "user",
               description: "Wybierz osobę",
               type: 6,
               required: true
          },
          {
               name: "reason",
               description: "Opisz powód",
               type: 3,
               required: false
          }
     ],

     /**
     *   @param { Client } client
     *   @param {ChatInputCommandInteraction} interaction
     */
     async execute(interaction, client) {

          await interaction.deferReply({ ephemeral: true })

          const { user, options, guild } = interaction

          const member = options.getMember("user")
          const reason = options.getString("reason") || "no reason provided"

          if (member.id === user.id) return editReply(interaction, "❌" `Nie możesz zbanować tego użytkownika`)
          if (guild.ownerId === member.id) return editReply(interaction, "❌" `Nie możesz zbanować tego użytkownika`)
          if (guild.members.me.roles.highest.position <= member.roles.highest.position) return editReply(interaction, "❌" `Nie możesz zbanować tego użytkownika`)
          if (guild.member.roles.highest.position <= member.roles.highest.position) return editReply(interaction, "❌" `Nie możesz zbanowac tego użytkownika`)

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
                    Embed.setDescription(`** Napewno chcesz zbanować tego użytkownika? **`)
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
                                   Embed.setDescription(`${member} Dostał bana na: **${reason}** `)
                              ],
                              components: []
                         })

                         member.send({
                              embeds: [
                                   new EmbedBuilder()
                                        .setColor(client.color)
                                        .setDescription(`Dostałeś bana na **${guild.name}**`)
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