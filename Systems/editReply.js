const { EmbedBuilder } = require("discord.js")

function editReply(interaction, emoji, description) {

     interaction.editReply({
          embeds: [

               new EmbedBuilder()
                    .setColor("Purple")
                    .setDescription(`${emoji} | ${description}`)

          ],
     })
}

module.exports  = editReply