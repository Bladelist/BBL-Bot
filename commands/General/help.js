const Command = require("../../Base/Command");
const {MessageEmbed} = require("discord.js")

class Help extends Command {

    constructor(client) {
        super(client, {
            name: "help",
            aliases: ["h"],
            description: "Get help.",
			permLevel: 0
        });
    }

    async run(message, args) {

		if(args[0]){

            const cmd = this.client.commands.get(args[0]) || this.client.commands.get(this.client.aliases.get(args[0]));

			if(!cmd){
				return message.channel.send("Please provide a valid command!");
			}

	
			// Creates the help embed
            const groupEmbed = new MessageEmbed()
                .addField(
                    "Name",
                    cmd.help.name||"Not specified!"
                )
				.addField(
					"Description",
					cmd.help.description||"Not specified!"
                )
				.addField(
					"Category",
					cmd.help.category||"Not specified!"
				)
				.addField(
					"Aliases",
					cmd.help.aliases.length > 0
						? cmd.help.aliases.map(a => "`" + a + "`").join(", ")
						: "No aliases!"
				)
				.setColor("BLUE")
	try {
		return message.channel.send(groupEmbed);
	} catch (e) {
		return message.channel.send(`Failed to send embed: ${e}`)
			}
		}

		const categories = [];
		const commands = this.client.commands;

		commands.forEach((command) => {
			if(!categories.includes(command.help.category)){
				if(command.help.category === "Owner" && !this.client.config.OWNERS.includes(message.author.id)){
					return;
				}
				categories.push(command.help.category);
			}
		});


		const embed = new MessageEmbed()
			.setDescription(`**Help page**`)
			.setColor("BLUE")
		categories.sort().forEach((cat) => {
			const tCommands = commands.filter((cmd) => cmd.help.category === cat);
            embed.addField(`**${cat}** (${tCommands.size})`, `\`\`\`
${tCommands.map((cmd) => cmd.help.name).join(", ")}
\`\`\``)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: "gif", size:4096})).setTimestamp()
		});
        
        return message.channel.send(embed);


    }

}

module.exports = Help;