const Command = require("../../Base/Command");

class Play extends Command {

    constructor(client) {
        super(client, {
            name: "play",
            aliases: [],
            description: "play a music from a link or a query.",
            permLevel: 0
        });
    }

    async run(message, args) {

        return message.channel.send("Not available yet.")

        if (!message.member.voice.channel) return message.channel.send(`You're not in a voice channel !`);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`You are not in the same voice channel !`);

        if (!args[0]) return message.channel.send(`Please indicate the title of a song !`);

        return client.player.play(message, args.join(" "), { firstResult: true });
    }

}

module.exports = Play;