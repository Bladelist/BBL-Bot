const Command = require("../../Base/Command");
const { MessageEmbed } = require("discord.js")

class Approve extends Command {

    constructor(client) {
        super(client, {
            name: "approve",
            aliases: [],
            description: "[STAFF] Approve a discord bot by using discord bot.",
            permLevel: 2
        });
    }

    async run(message, args) {

        let verifguildid = this.client.config.IDs.SERVERS.VERIF

        if (message.guild.id !== verifguildid)
            return message.channel.send(new MessageEmbed().setDescription(`This command should be done in verification guild!`).setColor("RED").setFooter("https://bladelist.gg", this.client.user.displayAvatarURL()).setTimestamp())


        let user = message.mentions.users.first() || this.client.users.cache.get(args[0])

        if (!user || !user.bot) return message.channel.send(new MessageEmbed().setDescription(`This bot is not present on discord server, please invite it before.`).setColor("RED").setFooter("https://bladelist.gg", this.client.user.displayAvatarURL()).setTimestamp())

        let b = await this.client.botlist.filter(b => b.id == user.id)[0]

        if (!b) return message.channel.send(new MessageEmbed().setDescription(`This bot is not listed on BladeList.gg!`).setColor("RED").setFooter("https://bladelist.gg", this.client.user.displayAvatarURL()).setTimestamp())

        if (b.verification_status && b.verification_status !== "UNDER_REVIEW" && b.verification_status !== "UNVERIFIED")
            return message.channel.send(new MessageEmbed().setDescription(`Bot is not waiting to be verified.`).setColor("RED").setFooter("https://bladelist.gg", this.client.user.displayAvatarURL()).setTimestamp())

        await this.client.blAPI.setStatus(user.id, "VERIFIED", message.author.id)

        // approvedBot(client, user.id, message.author.id)

        let verifbot = this.client.guilds.cache.get(verifguildid).member(user.id)
        if (verifbot) verifbot.kick("bot verified! (bot discord)")
        setTimeout(() => {
            if (message.guild.channels.cache.some(ch => ch.name.startsWith(`session-${user.id}`))) {
                message.guild.channels.cache.filter(ch => ch.name.startsWith(`session-${user.id}`)).forEach(ch => {
                    ch.delete()
                })
            }
        }, 10 * 60 * 1000)

        return message.channel.send(new MessageEmbed().setDescription(`Successfully approved ${user.username}! Verification channel is gonna be deleted in 10 minutes.\nhttps://bladelist.gg/bot/${user.id}`).setColor("GREEN").setFooter("https://bladelist.gg", this.client.user.displayAvatarURL()).setTimestamp())
    }

}

module.exports = Approve;