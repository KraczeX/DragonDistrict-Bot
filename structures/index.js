const { Client, Partials, AllowedMentionsTypes, Collection } = require("discord.js");
require("dotenv").config()
const { promisify } = require("util")
const { glob } = require("glob")
const PG = promisify(glob)
const Ascii = require("ascii-table")
const ms = require("ms")
const { Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent } = Partials

const client = new Client({
     intents: 131071,
     partials: [Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent],
     allowedMentions: { parse: ["everyone", "users", "roles"] },
     rest: { timeout: ms("1m") }
})

client.color = "Purple"
client.events = new Collection()
client.commands = new Collection()

const Handlers = ["Events", "Commands"]

Handlers.forEach(handler => {

     require(`./Handlers/${handler}`)(client, PG, Ascii)

})

module.exports = client;

client.login(process.env.TOKEN)


