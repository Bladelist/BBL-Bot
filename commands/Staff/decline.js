const Command = require("../../Base/Command");
const { MessageEmbed } = require("discord.js")

class Decline extends Command {

    constructor(client) {
        super(client, {
            name: "decline",
            aliases: [],
            description: "[STAFF] Decline a discord bot by using discord bot.",
            permLevel: 2
        });
    }

    async run(message, args) {

        let user = message.mentions.users.first() || this.client.users.cache.get(args[0])

        if (!user || !user.bot) return message.channel.send(new MessageEmbed().setDescription(`This bot is not present on discord server!`).setColor("RED").setFooter("https://bladelist.gg", this.client.user.displayAvatarURL()).setTimestamp())

        let bot = await this.client.botlist.filter(b => b.id == user.id)[0]



        if (!bot) return message.channel.send(new MessageEmbed().setDescription(`Bot is not listed on bladelist.gg!`).setColor("RED").setFooter("https://bladelist.gg", this.client.user.displayAvatarURL()).setTimestamp())

        //if (bot.verification_status && bot.verification_status !== "UNDER_REVIEW" && bot.verification_status !== "UNVERIFIED")
        //    return message.channel.send(new MessageEmbed().setDescription(`Bot is not waiting to be verified.`).setColor("RED").setFooter("https://bladelist.gg", this.client.user.displayAvatarURL()).setTimestamp())

        const filter = response => {
            return Boolean(response.author.id === message.author.id)
        };
        let reason;

        let embeds = {
            frst: new MessageEmbed().setDescription("Provide reason of declinement").setFooter("Answer cancel to cancel").setColor("RANDOM"),
        }

        message.channel.send(embeds.frst).then(() => {
            message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
                .then(collected => {
                    if (collected.first().content === "cancel")
                        return message.channel.send("canceled !")
                    reason = collected.first().content



                    this.client.blAPI.setStatus(user.id, "REJECTED", message.author.id, reason)
                        // declinedBot(client, user.id, message.author.id, reason, screenshot)
                    message.channel.send(new MessageEmbed().setDescription(`Bot declined! it can no more be seen by users.\nVerification channel is gonna be deleted in 10min`).setColor("GREEN").setFooter("https://bladelist.gg", this.client.user.displayAvatarURL()).setTimestamp())

                    let verifbot = this.client.guilds.cache.get(this.client.config.IDs.SERVERS.VERIF).member(user.id)
                    try {
                        if (verifbot) return verifbot.kick("Bot declined! (using Discord Bot)")
                    } catch {}

                    setTimeout(() => {
                        if (message.guild.channels.cache.some(ch => ch.name.startsWith(`session-${user.id}`))) {
                            message.guild.channels.cache.filter(ch => ch.name.startsWith(`session-${user.id}`)).forEach(ch => {
                                ch.delete()
                            })
                        }
                    }, 10 * 60 * 1000)
                })


            .catch((e) => {
                return message.channel.send('Canceled, you don\'t have answered in time.');
            });



        });
    }

}

module.exports = Decline;