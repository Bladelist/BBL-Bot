class GuildMemberRemove {

    constructor(client) {
        this.client = client;
    }

    async run(member) {
        if (member.guild.id == this.client.config.IDs.SERVERS.MAIN) {
            try {
                member.guild.channels.cache.get(this.client.config.IDs.CHANNELS.MAIN.WELCOME).send(`[-] ${member.user.tag} left the server, we're now ${member.guild.memberCount} members`)
            } catch (e) {}
        }

        return;
    }

}

module.exports = GuildMemberRemove;