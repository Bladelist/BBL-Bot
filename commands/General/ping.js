const Command = require("../../Base/Command");
const ping = require("node-http-ping")
class Ping extends Command {

    constructor(client) {
        super(client, {
            name: "ping",
            aliases: ["pong"],
            description: "Shows bot ping",
            permLevel: 0
        });
    }

    async run(message, args) {
        let initial = message.createdTimestamp;

        message.channel.send("Pinging...")
            .then(async(m) => {
                let latency = m.createdTimestamp - initial;

                let weblat = 0;

                weblat = await ping(this.client.config.BASEURL)


                return m.edit(`Pong! 🏓\nDiscord API: **${latency}ms**\nBladeBotList API: **${weblat}ms**`);
            });
    }

}

module.exports = Ping;