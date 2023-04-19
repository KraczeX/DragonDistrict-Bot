const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton, ButtonInteraction } = require("discord.js");
const ms = require("ms");
const EditReply = require("../../Systems/editReply");
const { execute } = require("../../Events/Client/ready");
const Reply = require("../../Systems/reply");

module.exports = {
  name: "kick",
  description: "Wyrzuca użytkownika z serwera",
  userPermissions: ["KICK_MEMBERS"],
  botPermissions: ["KICK_MEMBERS"],
  category: "Moderacja",
  options: [
    {
      name: "użytkownik",
      description: "Wybierz osobę, którą chcesz wyrzucić",
      type: 6,
      required: true,
    },
    {
      name: "powód",
      description: "Opisz powód wyrzucenia",
      type: 3,
      required: false,
    },
  ],

  /**
   *   @param { Client } client
   *   @param {CommandInteraction} interaction
   */
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });

    const { options, user, guild } = interaction;
    const member = options.getMember("użytkownik");
    const reason = options.getString("powód") || "Nie podano powodu";

    if (member.id === user.id) {
      return EditReply(interaction, "❌ Nie możesz wyrzucić samego siebie.");
    }
    if (guild.ownerId === member.id) {
      return EditReply(interaction, "❌ Nie możesz wyrzucić właściciela serwera.");
    }
    if (guild.me.roles.highest.position <= member.roles.highest.position) {
      return EditReply(interaction, "❌ Nie możesz wyrzucić użytkownika z wyższą lub równą pozycją niż bot.");
    }
    if (interaction.member.roles.highest.position <= member.roles.highest.position) {
      return EditReply(interaction, "❌ Nie możesz wyrzucić użytkownika z wyższą lub równą pozycją niż Ty.");
    }

    const embed = new MessageEmbed().setColor(client.color);
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle("DANGER")
        .setCustomId("kick-yes")
        .setLabel("Tak"),
      new MessageButton()
        .setStyle("PRIMARY")
        .setCustomId("kick-no")
        .setLabel("Nie")
    );

    const page = await interaction.editReply({
      embeds: [embed.setDescription(`Czy na pewno chcesz wyrzucić użytkownika ${member}?`)],
      components: [row],
    });

    const collector = page.createMessageComponentCollector({
      componentType: "BUTTON",
      time: ms("15s"),
    });

    collector.on("collect", async (i) => {
      if (i.user.id !== user.id) return;

      switch (i.customId) {
        case "kick-yes": {
          await member.kick(reason);

          await interaction.editReply({
            embeds: [embed.setDescription(`${member} został wyrzucony z serwera. Powód: **${reason}**.`)],
            components: [],
          });

          try {
            await member.send({
              embeds: [
                new MessageEmbed().setColor(client.color).setDescription(`Zostałeś wyrzucony z serwera ${guild.name}. Powód: ${reason}`),
            ],
            });
            } catch (err) {
            console.error(err);
            }  break;
        }
    
        case "kick-no": {
          await interaction.editReply({
            embeds: [embed.setDescription(`Anulowano wyrzucenie użytkownika ${member}.`)],
            components: [],
          });
          break;
        }
    
        default:
          break;
      }
    });
    
    collector.on("end", async () => {
      await interaction.editReply({
        embeds: [embed.setDescription(`Czas na potwierdzenie wyrzucenia użytkownika ${member} minął.`)],
        components: [],
      });
    }); },
};

