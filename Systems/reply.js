
const { MessageEmbed } = require("discord.js");
module.exports = {
     reply: async function(interaction, emoji, description, type) {
       await interaction.reply({
         embeds: [
           new MessageEmbed()
             .setColor("PURPLE")
             .setDescription(`${emoji} | ${description}`)
         ],
         ephemeral: type
       });
     },
   
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
   