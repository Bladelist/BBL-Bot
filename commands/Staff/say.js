const Command = require("../../Base/Command");
const {MessageEmbed} = require("discord.js")

class Say extends Command {

    constructor(client) {
        super(client, {
            name: "say",
            aliases: ["tell"],
            description: "[STAFF] Make the bot saying something.",
            permLevel: 1
        });
    }

    async run(message, args) {
        if(!args.join(" ")) return message.channel.send('Please provide a text!')
        return message.channel.send(args.join(" "))
    }

}

module.exports = Say;