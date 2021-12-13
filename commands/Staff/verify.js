const Command = require("../../Base/Command");
const { MessageEmbed } = require("discord.js")

class Verify extends Command {

    constructor(client) {
        super(client, {
            name: "verify",
            aliases: ["verif"],
            description: "[STAFF] Start a verification session.",
            permLevel: 2
        });
    }

    async run(message, args) {

        if (message.guild.id !== this.client.config.IDs.SERVERS.VERIF)
            return message.channel.send(":x: You can only use this command inside verification guild!")

        if (!args[0])
            return message.channel.send(":x: Please provide a valid bot id or mention!")

        let b = message.mentions.users.first() || this.client.users.cache.get(args[0])

        if (!b || !b.bot) return message.channel.send(":x: this user don't exist or is not a bot!")

        let bot = await this.client.botlist.filter(bo => bo.id == b.id)[0]

        if (!bot) return message.channel.send(":x: this bot is not on bladebotlist!")

        if (message.guild.channels.cache.some(ch => ch.name === `session-${b.id}-${message.author.id}`))
            return message.channel.send(":x: You already started a session to verify this bot!")

        if (message.guild.channels.cache.some(ch => ch.name.startsWith(`session-${b.id}`)))
            return message.channel.send(":x: An other verifier already started a session to verify this bot!")

        if (b.verification_status && b.verification_status !== "UNDER_REVIEW" && b.verification_status !== "UNVERIFIED")
            return message.channel.send(new MessageEmbed().setDescription(`Bot is not waiting to be verified.`).setColor("RED").setFooter("https://bladelist.gg", this.client.user.displayAvatarURL()).setTimestamp())

        let m = await message.channel.send("⌛ Creating verification session, please wait...")

        //  await this.client.blAPI.setStatus(bot.id, "UNDER_REVIEW")

        try {
            let d = new Date()
            let c = await message.guild.channels.create(`session-${b.id}-${message.author.id}`, {
                nsfw: false,
                type: "text",
                parent: this.client.config.IDs.CHANNELS.VERIF.VERIFCATEGORY,
                reason: `Starting verification session of ${message.author.id}`,
                topic: `Bot: **${bot.name||"user#0000"}**\nModerator: **${message.author.tag}**\nCreation date: **${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}**`
            })

            m.edit(`Started Verification session!`)

            c.send(`Hey <@${message.author.id}>\nWelcome in your verification session!\nYou're verifying ${bot.name} (https://bladebotlist.xyz/bot/${b.id})\n**Basic infos:** \nPrefix: ${bot.meta.prefix||"not defined"}\nShort desc: ${bot.short_desc}\nTags: ${Array.isArray(bot.meta.tags) ? bot.meta.tags.join(", ")||"no tags" : bot.meta.tags||"no tags"}\nInvite url: ${bot.invite||"none"}`)
            return true;
        } catch (e) {
            return message.channel.send(`:x: Session creation failed with an error code: ${e}`)
        }

    }

}

module.exports = Verify;