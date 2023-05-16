const { Client, ChatInputCommandInteraction, ApplicationCommandOptionType, Embed, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const ms = require("ms");
const EditReply = require("../../Systems/EditReply");
const { color } = require("../../structures");

module.exports = {
     name: "kick",
     description: "Wyrzuca użytkownika z serwera",
     userPermissions: ["KickMembers"],
     botPermissions: ["KickMembers"],
     category: "Moderation",
     options: [
          {
               name: "użytkownik",
               description: "Wybierz osobę",
               type: 6,
               required: true
          },
          {
               name: "powód",
               description: "Opisz powód",
               type: 3,
               required: false
          }
     ],

     /**
      *   @param {Client} client
      *   @param {ChatInputCommandInteraction} interaction
      */
     async execute(interaction, client) {

          await interaction.deferReply({ ephemeral: true })

          const { options, user, guild } = interaction;

          const member = options.getMember("użytkownik");
          const reason = options.getString("powód") || "brak powodu";

          if (member.id === user.id) return EditReply(interaction, `❌ | Nie możesz wyrzucić tego użytkownika`)
          if (guild.ownerId === member.id) return EditReply(interaction, `❌ | Nie możesz wyrzucić tego użytkownika`)
          if (guild.members.me.roles.highest.position <= member.roles.highest.position) return EditReply(interaction, `❌ | Nie możesz wyrzucić tego użytkownika`)
          if (interaction.member.roles.highest.position <= member.roles.highest.position) return EditReply(interaction, `❌ | Nie możesz wyrzucić tego użytkownika`)


          const Embed = new EmbedBuilder()
               .setColor(client.color);

          const row = new ActionRowBuilder().addComponents(

               new ButtonBuilder()
                    .setStyle("DANGER")
                    .setCustomId("kick-tak")
                    .setLabel("Tak"),

               new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId("kick-nie")
                    .setLabel("Nie")
          );

          const Page = await interaction.editReply({

               embeds: [
                    Embed.setDescription(`**Czy na pewno chcesz wyrzucić tego użytkownika?**`)
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

                    case "kick-tak": {

                         member.kick(reason);

                         interaction.editReply ({
                              embeds: [
                                   Embed.setDescription(`${member} został wyrzucony z serwera za: ${reason}`)
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

                    case "kick-nie": {

                         interaction.editReply ({
                              embeds: [
                                   Embed.setDescription("❌ Anulowano wyrzucanie użytkownika.")
                              ],
                              components: []
                         })
                    }
                    break;
               }
          })
          col.on("end", (collected) => {

               if(collected.size > 0) return

               interaction.editReply({
                    embeds: [
                         Embed.setDescription(`Nie podałeś odpowiedzi`)
                    ],

                    components: []
               })
          })
     }
}
     