const moment = require("moment")
require("moment-duration-format")
const Command = require("../../Base/Command");

class Since extends Command {

    constructor(client) {
        super(client, {
            name: "since",
            aliases: [],
            description: "Check when a bot was added to BladeBotList.",
            permLevel: 0
        });
    }

    async run(message, args) {
        let user;
        if (!args[0])
            return message.channel.send(new MessageEmbed().setDescription(`No mention provided! Please mention bot.`).setColor("RED").setFooter("https://bladelist.gg", this.client.user.displayAvatarURL()).setTimestamp())

        user = message.mentions.users.first() || this.client.users.cache.get(args[0])
        if (!user || !user.bot) return message.channel.send(new MessageEmbed().setDescription(`Invalid user!`).setColor("RED").setFooter("https://bladelist.gg", this.client.user.displayAvatarURL()).setTimestamp())

        let b = await this.client.botlist.filter(b => b.id == user.id)[0]

        if (!b) return message.channel.send(new MessageEmbed().setDescription(`Bot is not listed on bladelist.gg!`).setColor("RED").setFooter("https://bladelist.gg", this.client.user.displayAvatarURL()).setTimestamp())

        if (!b.date_added)
            return message.channel.send(new MessageEmbed().setDescription(`This bot is very old! We are not able to find add date!`).setColor("RED").setFooter("https://bladelist.gg", this.client.user.displayAvatarURL()).setTimestamp())

        let addeddate = new Date(b.date_added)

        return message.channel.send(new MessageEmbed().setDescription(`Bot was added **${moment(addeddate).fromNow()}**`).setColor("GREEN").setFooter("https://bladelist.gg", this.client.user.displayAvatarURL()).setTimestamp())

    }
}

module.exports = Since;