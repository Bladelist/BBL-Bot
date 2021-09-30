const Command = require("../../Base/Command");
const { MessageEmbed } = require("discord.js")

class Uptime extends Command {

    constructor(client) {
        super(client, {
            name: "bots-uptime",
            aliases: [],
            description: "List bots of any user.",
            permLevel: 5
        });
    }

    async run(message, args) {
        let user = message.mentions.users.first() || this.client.users.cache.get(args[0])

        if (!user || !user.bot) return message.channel.send("This user don't exist or is not a bot!")

        let b = await this.client.botlist[user.id]

        if (!b) return message.channel.send("This bot is not listed on bladebotlist!")

        let embed = new MessageEmbed()
            .setTitle(`${b.name} - Uptime`)
            .setDescription(`Uptime: **${b.meta.uptime}**`)
            .setColor("GREEN")

        return message.channel.send(embed)
    }
}

module.exports = Uptime;