const Command = require("../../Base/Command");
const { MessageEmbed } = require("discord.js")

class StaffQueue extends Command {

    constructor(client) {
        super(client, {
            name: "staff-queue",
            aliases: ["squeue", "sq"],
            description: "[STAFF] Show list of bots waiting to be approved.",
            permLevel: 2
        });
    }

    async run(message, args) {

        let bots = await this.client.botlist.filter(b => b.verification_status == "UNVERIFIED" || b.verification_status == "UNDER_REVIEW")

        try {
            let embed = new MessageEmbed()
                .setTitle(`Staff queue (${bots.length||0} left)`)
                .setColor("ORANGE")
            if (!bots.length) {
                embed.setDescription("Good job you verified all bots!")
            } else {
                bots.slice(0, 25)
                bots.forEach(b => {
                    embed.addField(`#${bots.indexOf(b)} ${b.name||"unable to find"}`, `[\`[View]\`](https://bladelist.gg/bot/${b.id}) [\`[Invite]\`](https://bladelist.gg/bot/${b.id}/invite) [\`[Manage]\`](https://bladelist.gg/staff)`)
                })
            }
            return message.channel.send(embed)
        } catch (e) {
            return message.channel.send(`Failed to send embed: **${e}**`)
        }

    }

}

module.exports = StaffQueue;