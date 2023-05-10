const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton, Permissions } = require("discord.js");
const ms = require("ms");
const { reply, editReply } = require("../../Systems/reply");


module.exports = {
     name: "kick",
     description: "Wyrzuca użytkownika z serwera",
     userPermissions: ["KICK_MEMBERS"],
     botPermissions: ["KICK_MEMBERS"],
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
      *   @param {CommandInteraction} interaction
      */
     async execute(interaction, client) {

          await interaction.deferReply({ ephemeral: true });

          const { options, user, guild } = interaction;

          const member = options.getMember("użytkownik");
          const reason = options.getString("powód") || "brak powodu";

          if (member.id === user.id) return editReply(interaction, `❌ Nie możesz wyrzucić tego użytkownika`)
          if (guild.ownerId === member.id) return editReply(interaction, `❌ Nie możesz wyrzucić tego użytkownika`)
          if (guild.members.me.roles.highest.position <= member.roles.highest.position) return editReply(interaction, `❌ Nie możesz wyrzucić tego użytkownika`)
          if (interaction.member.roles.highest.position <= member.roles.highest.position) return editReply(interaction, `❌ Nie możesz wyrzucić tego użytkownika`)


          const embed = new MessageEmbed()
               .setColor(client.color);

          const row = new MessageActionRow().addComponents(

               new MessageButton()
                    .setStyle("DANGER")
                    .setCustomId("kick-tak")
                    .setLabel("Tak"),

               new MessageButton()
                    .setStyle("PRIMARY")
                    .setCustomId("kick-nie")
                    .setLabel("Nie")
          );

          const page = await interaction.editReply({

               embeds: [
                    embed.setDescription(`**Czy na pewno chcesz wyrzucić tego użytkownika?**`)
               ],
               components: [row]
          });

          const collector = page.createMessageComponentCollector({
               componentType: "BUTTON",
               time: ms("15s")
          });

          collector.on("collect", async (i) => {

               if (i.user.id !== user.id) return;

               switch (i.customId) {

                    case "kick-tak": {

                         await member.kick(reason);

                         await editReply(interaction, {
                              embeds: [
                                   embed.setDescription(`${member.username} został wyrzucony z serwera\nPowód: ${reason}`)
                              ]
                         }); break;
                    }

                    case "kick-nie": {

                         await editReply(interaction, {
                              embeds: [
                                   embed.setDescription("❌ Anulowano wyrzucanie użytkownika.")
                              ],
                              components: []
                         });
                         break;
                    }
               }
          }); collector.on("end", async (collected, reason) => {

               if (reason === "time") {
                    await editReply(interaction, {
                         embeds: [
                              embed.setDescription("❌ Upłynął limit czasu na odpowiedź.")
                         ],
                         components: []
                    });
               }
          });
     }
};
