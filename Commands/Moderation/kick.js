const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton, Permissions } = require("discord.js");
const ms = require("ms");
const { reply, editReply } = require("../../Systems/reply");

module.exports = {
    name: "kick",
    description: "Wyrzuca użytkownika z serwera",
    userPermissions: [ "KICK_MEMBERS" ],
    botPermissions: [ "KICK_MEMBERS" ],
    category: "Moderacja",
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

        if (!member) return editReply(interaction, "❌ Nie znaleziono użytkownika");
        if (member.id === user.id) return editReply(interaction, "❌ Nie możesz wyrzucić samego siebie");
        if (guild.ownerId === member.id) return editReply(interaction, "❌ Nie możesz wyrzucić właściciela serwera");
        if (guild.me.roles.highest.position <= member.roles.highest.position) return editReply(interaction, "❌ Nie możesz wyrzucić tego użytkownika");
        if (interaction.member.roles.highest.position <= member.roles.highest.position) return editReply(interaction, "❌ Nie możesz wyrzucić tego użytkownika");

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
                            embed.setDescription(`${member} został wyrzucony z serwera: **${reason}**`)
                        ],
                        components: []
                    });

                    await member.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor(client.color)
                                .setDescription(`Zostałeś wyrzucony z **${guild.name}**`)
                        ]
                    }).catch(err => {

                        if (err.code !== 50007) return console.log(err)
                    });

                }
                    break;

                case "kick-nie": {

                    await editReply(interaction, {
                        embeds: [
                            embed.setDescription(`Nie wyrzucam użytkownika: **${member}**`)
                         ],
                         components: []
                         });
                    }
                    break;
    
                default:
                    break;
    
            }
    
        });
    
        collector.on("end", async (collected) => {
    
            if (collected.size === 0) {
    
                await editReply(interaction, {
                    embeds: [
                        embed.setDescription(`Nie wybrano żadnej opcji, anulowano wyrzucanie użytkownika: **${member}**`)
                    ],
                    components: []
                });
    
            }
    
        });
    
    }
};    
