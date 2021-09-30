const fetch = require("node-fetch")

class GuildMemberAdd {

    constructor(client) {
        this.client = client;
    }

    async run(member) {

        await member.guild.members.fetch()

        if (member.guild.id == this.client.config.IDs.SERVERS.MAIN) {
            try {
                await member.guild.channels.cache.get(this.client.config.IDs.CHANNELS.MAIN.WELCOME).send(`[+] Welcome to ${member.user.tag}, we're now ${member.guild.memberCount} members`)
            } catch (e) {}
        }
    }
}

module.exports = GuildMemberAdd;