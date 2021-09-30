const Command = require("../../Base/Command");
const moment = require("moment");
const { MessageEmbed } = require("discord.js");
require("moment-duration-format");

class BotUptime extends Command {

    constructor(client) {
        super(client, {
            name: "uptime",
            aliases: ["bbl-uptime", "bbluptime", "botuptime", "bup", "botup"],
            description: "Shows Discord Bot uptime",
            permLevel: 0
        });
    }

    async run(message, args) {
        const duration = moment.duration(this.client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");

        return message.channel.send(new MessageEmbed().setDescription(`BladeList Bot online since **${duration}**`).setColor("GREEN").setFooter("https://bladelist.gg", this.client.user.displayAvatarURL()).setTimestamp())


    }

}

module.exports = BotUptime;