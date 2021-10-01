class GuildMemberAdd {

    constructor(client) {
        this.client = client;
    }

    async run(member) {

        await member.guild.members.fetch()

        if (member.guild.id == this.client.config.IDs.SERVERS.MAIN) {
            try {
                member.guild.channels.cache.get(this.client.config.IDs.CHANNELS.MAIN.WELCOME).send(`[+] Welcome to ${member.user.tag}, we're now ${member.guild.memberCount} members`)

                if (member.user.bot) return;

                if (this.client.botlist.filter(b => b.owner !== member.user.id || b.verification_status !== "VERIFIED")) {
                    if (await member.roles.cache.has(this.client.config.IDs.ROLES.DEV.BOTDEV))
                        await member.roles.remove(this.client.config.IDs.ROLES.DEV.BOTDEV)
                } else {
                    if (!await member.roles.cache.has(this.client.config.IDs.ROLES.DEV.BOTDEV))
                        await member.roles.add(this.client.config.IDs.ROLES.DEV.BOTDEV)
                }
            } catch (e) { console.log(e) }
        }
    }
}

module.exports = GuildMemberAdd;