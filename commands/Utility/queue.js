const Command = require("../../Base/Command");
const { MessageEmbed } = require("discord.js")

class Queue extends Command {

    constructor(client) {
        super(client, {
            name: "queue",
            aliases: ["q"],
            description: "Get information about a bot in waiting queue.",
            permLevel: 0
        });
    }

    async run(message, args) {

        return message.channel.send("This command is now disabled for bots queue security. Thanks for understanding!")

        let user;

        if (!args.length) {
            user = message.author
        } else {
            user = message.mentions.users.first() || this.client.users.cache.get(args[0])
        }

        if (!user || user.bot) return message.channel.send("User specified doesn't exist!")

        let userBots = await this.client.botlist.filter(b => b.owner == user.id)

        userBots = userBots.filter(b => !b.verification_status || !b.verification_status === "UNDER_REVIEW" || !b.verification_status === "UNVERIFIED")

        let waitingBots = await this.client.botlist.filter(b => b.verification_status == "UNVERIFIED")


        if (!userBots.length)
            return message.channel.send("There is no bot in waiting to be verified!")

        let emb = new MessageEmbed()
            .setTitle(`(${user.username}) Queued bots`)
            .setDescription(userBots.map(b => `[\`${b.name}\`](https://bladebotlist.xyz/bot/${b.id})`).join("\n"))
            .addField("Queue length", `**${waitingBots.length}** bots`, true)
            .setColor("BLUE")
        message.channel.send(emb)
    }


}

module.exports = Queue;