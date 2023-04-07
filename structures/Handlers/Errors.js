const { Client, EmbedBuilder } = require("discord.js")
const client = require("..")
const ChannelID = process.env.LOGS


/**
 * @param {Client} client
 */
module.exports = async (client) => {

    const Embed = new EmbedBuilder()
        .setColor(client.color)
        .setTimestamp()
        .setFooter({ text: "Anty-crash by Krecik" })
        .setTitle("Error")

    process.on("unhandledRejection", (reason, p) =>{

        console.log(reason, p)

        const Channel = client.channels.cache.get(ChannelID)
        if (!Channel) return

        Channel.send({
            embeds: [
                Embed
                .setDescription("**Unhandled rejection/catch:\n\n** ```" + reason +"```" )
            ]
        })
    })

    process.on("uncaughtException", (err, origin) =>{

        console.log(err, origin)

        const Channel = client.channels.cache.get(ChannelID)
        if (!Channel) return

        Channel.send({
            embeds: [
                Embed
                .setDescription("**Unhandled rejection/catch:\n\n** ```" + reason +"```" )
            ]
        })
    })
}


