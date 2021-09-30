const Command = require("../../Base/Command");
const { MessageEmbed } = require("discord.js")

class BotInfo extends Command {

    constructor(client) {
        super(client, {
            name: "botinfo",
            aliases: ["bi"],
            description: "Show information about a bot.",
            permLevel: 0
        });
    }

    async run(message, args) {

        if (!args[0])
            return message.channel.send("Please provide a valid bot id or mention !")

        let user = message.mentions.users.first() || this.client.users.cache.get(args[0])

        if (!user || !user.bot) return message.channel.send("this user don't exist or is not a bot !")

        let bot = await this.client.botlist.filter(b => b.id == user.id)[0]

        if (!bot) return message.channel.send("Bot not found!")


        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setThumbnail(user.displayAvatarURL() || null)
            .setTitle(`${bot.name||"unable to find"} - Bot Info`)
            .setDescription(`**${bot.name||"unable to find"}** [[${bot.votes||"0"} <:vote:704268098844360714>]](https://bladelist.gg/bot/${user.id||"unable to find"})`)
            .addField('Prefix', bot.meta.prefix)
            .addField('Owner', bot.owner)
            .addField('Library used', bot.meta.library)
            .addField('Short description', bot.short_desc)
            .addField('Tags', Array.isArray(bot.meta.tags) ? bot.meta.tags.join(", ") : bot.meta.tags || "no tags")
            .addField('Status', bot.verification_status || "UNKNOWN")
        if (bot.meta.website) {
            embed.addField('Website', `[Click Here](${bot.meta.website||"https://bladebotlist.xyz/404"})`, true)
        }
        if (bot.meta.github) {
            embed.addField('GitHub', `[Click Here](${bot.meta.github||"https://bladebotlist.xyz/404"})`, true)
        }
        if (bot.meta.donate) {
            embed.addField('Donate', `[Click Here](${bot.meta.donate||"https://bladebotlist.xyz/404"})`, true)
        }
        if (bot.meta.privacy) {
            embed.addField('Privacy Policy', `[Click Here](${bot.meta.privacy||"https://bladebotlist.xyz/404"})`, true)
        }
        if (bot.meta.twitter) {
            embed.addField('Website', `[Click Here](${bot.meta.twitter||"https://bladebotlist.xyz/404"})`, true)
        }
        if (bot.meta.invite) {
            embed.addField('Custom invite', `[Click Here](${bot.meta.website||"https://bladebotlist.xyz/404"})`, true)
        }

        return message.channel.send(embed)
    }

    Capitalize(txt) {
        return txt.charAt(0).toUpperCase() + txt.slice(1)
    }

}

module.exports = BotInfo;