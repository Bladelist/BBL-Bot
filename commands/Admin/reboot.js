const Command = require("../../Base/Command");

class Reboot extends Command {

    constructor(client) {
        super(client, {
            name: "reboot",
            aliases: ["restart"],
            description: "[ADMIN] Reboot discord bot.",
			permLevel: 'owner'
        });
    }

    async run(message, args) {
        message.channel.send("Rebooting bot...").then(() => {
            this.client.destroy()
            return process.exit(0)
        })
    }

}

module.exports = Reboot;