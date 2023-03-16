const { Client, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, ApplicationCommandOptionType} = require("discord.js")
const ms = require("ms")
const EditReply = require("../../Systems/editReply")


module.exports = {
     name: "kick",
     description: "Kicks a member from the server",
     UserPerms: ["KickMembars"],
     BotPerms: ["KickMember"],
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

          const { options, user, guild } = interaction

          const member = options.getMember("user")
          const reason = options.getString("reason") || "no reason provided"

          if (member.id === user.id) return EditReply(interaction, "❌" `Nie możesz wyrzucić tego użytkownika`)
          if (guild.ownerId === member.id) return EditReply(interaction, "❌" `Nie możesz wyrzucić tego użytkownika`)
          if (guild.members.me.roles.highest.position <= member.roles.highest.position) return EditReply(interaction, "❌" `Nie możesz wyrzucić tego użytkownika`)
          if (interaction.member.roles.highest.position <= member.roles.highest.position) return EditReply(interaction, "❌" `Nie możesz wyrzucić tego użytkownika`)

          const Embed = new EmbedBuilder()
               .setColor(client.color)

          const row = new ActionRowBuilder().addComponents(

               new ButtonBuilder()
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId("kick-yes")
                    .setLabel("Yes"),

               new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId("kick-no")
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

                    case "kick-yes": {

                         member.kick({ reason })

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
                                        .setDescription(`Zostałeś wyrzucony z **${guild.name}**`)
                              ]
                         }).catch(err => {

                              if (err.code !== 50007) return console.log(err)
                         })

                    }
                         break;

                    case "kick-no": {

                         interaction.editReply({
                              embeds: [
                                   Embed.setDescription(`Polecenie kick zostało anulowane`)
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