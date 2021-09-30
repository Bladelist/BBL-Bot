const Command = require("../../Base/Command");
const Discord = require("discord.js")

class Eval extends Command {

    constructor(client) {
        super(client, {
            name: "eval",
            aliases: ["ev"],
            description: "[ADMIN] Test and execute some code.",
			permLevel: 'owner'
        });
    }

    async run(message, args) {
        let start = Date.now()


        const content = message.content.split(" ").slice(1).join(" ");
        const result = new Promise((resolve, reject) => resolve(eval(content)));
        
        return result.then((output) => {
            if(typeof output !== "string"){
                output = require("util").inspect(output, { depth: 0 });
            }
            if(output.includes(message.client.token)){
                output = output.replace(message.client.token, "T0K3N");
            }


            if(output.length >= 1024){
              console.log(`Eval output: ${output}`)
              output = "The output is too much long, the output is logged in console"
          }


            let end = Date.now()

            let timeelipsed = end - start



            let emb = new Discord.MessageEmbed()
            .setDescription(`\`\`\`${output}\`\`\``)
            .addField("executed in", `${timeelipsed} ms`, true)
            .addField("Type", typeof output, true)
            .setColor("GREEN")

            return message.channel.send(emb)
        }).catch((err) => {
            err = err.toString();
            if(err.includes(message.client.token)){
                err = err.replace(message.client.token, "T0K3N");
            }

            let emberr = new Discord.MessageEmbed()
            .setDescription(`\`\`\`${err}\`\`\``)
            .setColor("RED")

           return message.channel.send(emberr);
        })

    }

}

module.exports = Eval;