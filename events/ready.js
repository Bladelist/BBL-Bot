class Ready {

    constructor(client) {
        this.client = client;
    }

    run() {
        this.client.user.setActivity(`over bladebotlist 🔥`, { type: "WATCHING" })

        console.log(`${this.client.user.tag} Started!`)

        setInterval(() => {
            this.client.user.setActivity(`over bladebotlist 🔥`, { type: "WATCHING" })
            this.client.guilds.cache.forEach(g => g.members.fetch())
                //  this.checkStatus()
        }, 5 * 60 * 1000);

        if (process.env.EXECUTOR === "pm2") {
            process.send("ready");
            console.log("PM2: Ready signal sent");
        }
    }

    async checkStatus() {
        let bots = await this.client.botlist.filter(b = b.verification_status == "VERIFIED")

        for (let i = 0; i <= bots.length; i++) {
            let bot = bots[i]
            if (!bot) continue;
            setTimeout(() => this.checkBotStatus(bot), 1000 * i);
        }

    }

    async checkBotStatus(bot) {

        if (!this.client.users.cache.has(bot.id)) return false;

        let userbot = await this.client.users.cache.get(bot.id)

        let botdata = await this.client.quickdb.get(bot.id).set(bot.id)

        let presence = "offline"

        if (userbot) {
            presence = userbot.presence.status || "offline"
        }

        if (presence === "offline") {

            //if (bot.lastPresence !== "offline") {
            //    this.client.channels.cache.get(this.client.config.IDs.CHANNELS.MAIN.PRESENCE).send(`🔴 ${bot.name} just become offline (${bot.meta.uptime.toFixed(2)}% uptime)`)
            //}



            await this.client.quickdb.get(bot.id).set(bot.id, {
                totalPresenceChecks: botdata.totalPresenceChecks ? botdata.totalPresenceChecks++ : 1,
                lastPresence: presence
            })

            //    if ((((botdata.onlinePresenceChecks || 0) / (botdata.totalPresenceChecks || 0)) * 100 < this.config.PRESENCE.MINIMUM) && bot.totalPresenceChecks >= this.config.PRESENCE.GRACE) {

            // sending special api request
            this.client.blAPI.sendRequest("PUT", `/bot/status/${bot.id}`, {
                "uptime": ((botdata.onlinePresenceChecks || 0) / (botdata.totalPresenceChecks || 0)) * 100
            })

            //await require("../utils/website-logs").declinedBot(this, bot.id, this.client.user.id, `[AUTO] Uptime too low (${((bot.onlinePresenceChecks / bot.totalPresenceChecks)*100).toFixed(2)}%)\n${bot.totalPresenceChecks} total checks\n${onlinePresenceChecks} online checks`)

            //}

        } else {

            if (bot.lastPresence === "offline") {

                this.client.channels.cache.get(this.config.PRESENCE.ALERTCHANNEL).send(`🟢 ${bot.name} just become back online (${(((bot.onlinePresenceChecks||0) / (bot.totalPresenceChecks||0))*100).toFixed(2)}% uptime)`)
            }

            await this.client.db.table("bots").get(bot.id).update({
                totalPresenceChecks: this.client.db.row("totalPresenceChecks").add(1).default(0),
                onlinePresenceChecks: this.client.db.row("onlinePresenceChecks").add(1).default(0),
                lastPresence: presence
            })


        }
    }

}

module.exports = Ready;