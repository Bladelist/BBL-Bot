const Command = require("../../Base/Command");
const {MessageEmbed} = require("discord.js")

class Bots extends Command {

    constructor(client) {
        super(client, {
            name: "bots",
            aliases: [],
            description: "List bots of any user.",
            permLevel: 0
        });
    }

    async run(message, args) {
        let user;

        if(!args.length) {
            user = message.author
        } else {
            user = message.mentions.users.first() || client.users.cache.get(args[0])
        }
    
        if(!user || user.bot) return message.channel.send("This user don't exist or is a bot!")
    
     let userbots = await this.client.botlist.filter(b => b.owner == user.id)
    
     if(!userbots.length)
         return message.channel.send("Selected user don't own any bot!")
     
         let emb = new MessageEmbed()
         .setTitle(`${user.username}'s bots`)
         .setDescription(userbots.map(b => `[\`${b.name}\`](https://bladebotlist.xyz/bot/${b.id}) [[${b.votes||"0"} <:vote:704268098844360714>]](https://bladebotlist.xyz/bot/${b.id})`).join("\n"))
         .setColor("RANDOM")
          
        return message.channel.send(emb)    
    }
}

module.exports = Bots;