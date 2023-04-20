const { MessageEmbed } = require("discord.js");

module.exports = {
  editReply: async function(interaction, emoji, description) {
    await interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setColor("PURPLE")
          .setDescription(`${emoji} | ${description}`)
      ]
    });
  }
};
