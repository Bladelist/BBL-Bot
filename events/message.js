class Message {

    constructor(client) {
        this.client = client;
    }

    async run(message) {
        if (message.author.bot) return;

        const prefix = this.client.config.PREFIX;

        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(" ");
        const cmd = args.shift().toLowerCase();

        const command = this.client.getCommand(cmd);
        if (!command) return;

        if (message.channel.type !== 'text') {
            return message.reply('The bot can only be used inside the Discord guild of BladeBotList!');
        }

        let principalguild;

        if (message.guild.id === this.client.config.IDs.SERVERS.MAIN) {
            principalguild = message.guild
        } else {
            principalguild = this.client.guilds.cache.get(this.client.config.IDs.SERVERS.MAIN)
        }
        let member = principalguild.member(message.author.id)

        switch (command.help.permLevel) {
            case 'owner':
                this.client.guilds.cache.forEach(g => g.members.fetch())
                if (!this.client.config.OWNERS.includes(message.author.id))
                    return message.channel.send("❌ You don't have permission to execute this command (< OWNER)")
                break;
            case 1:
                this.client.guilds.cache.forEach(g => g.members.fetch())
                if (!member || (!member.roles.cache.has(this.client.config.IDs.ROLES.STAFF.HELPER) && !member.roles.cache.has(this.client.config.IDs.ROLES.STAFF.MOD) && !member.roles.cache.has(this.client.config.IDs.ROLES.STAFF.ADMIN)))
                    return message.channel.send("❌ You don't have permission to execute this command (< HELPER)")
                break;
            case 2:
                this.client.guilds.cache.forEach(g => g.members.fetch())
                if (!member || (!member.roles.cache.has(this.client.config.IDs.ROLES.STAFF.MOD) && !member.roles.cache.has(this.client.config.IDs.ROLES.STAFF.ADMIN)))
                    return message.channel.send("❌ You don't have permission to execute this command (< MODERATOR)")
                break;
            case 3:
                this.client.guilds.cache.forEach(g => g.members.fetch())
                if (!member || !member.roles.cache.has(this.client.config.IDs.ROLES.STAFF.ADMIN))
                    return message.channel.send("❌ You don't have permission to execute this command (< ADMINISTRATOR)")
                break;
        }


        if (command.help.enabled === false) {
            message.channel.send("❌ this command is disabled")
        }

        if (message.channel.type === "dm") {
            return message.channel.send("❌ commands are not executable inside dms !")
        }

        try {
            await command.run(message, args);
        } catch (e) {
            console.error(e);
            return message.channel.send(`Something went wrong while executing command "**${cmd}**"!`);
        }
    }

}

module.exports = Message;