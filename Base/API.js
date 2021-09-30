const fetch = require("node-fetch")

class ApiLink {
    constructor(client, cfg) {
        this.authorization = cfg.AUTHORIZATION;
        this.baseurl = cfg.BASEURL;
        this.client = client;
        this.debug = cfg.ENV == "DEV" ? true : false;
        this.botlistUpdate = true,
            console.log("Trying to fetch Bots")
        try {
            this.updateBots()
        } catch (e) {
            console.error("Failed to fetch bots:" + e)
            this.botlistUpdate = false;
        }
        if (this.updateBots) {
            setInterval(() => {
                this.updateBots()
            }, 5 * 60 * 1000)
        }
    }

    async sendRequest(method = "GET", endpoint = "/", body = {}, headers = {}) {
        let url = this.baseurl + endpoint
        headers.Authorization = `Token ${this.authorization}`;
        headers["Content-Type"] = "application/json";
        try {
            let res = await fetch(url, {
                method: method,
                body: method == "GET" ? undefined : JSON.stringify(body),
                headers: headers
            }).then(res => res.json())
            if (this.debug) {
                console.debug(`[API] ${method} ${url} -> ${ Array.isArray(res) ? res.length +" bots fetched" : JSON.stringify(res)}`)
            }
            if (res.error) {
                console.error(`HTTP request finished with error: ${method} ${url} > ${res.error}`)
                throw new Error(res.error)
            }

            return res;
        } catch (e) {
            console.error(`Failed HTTP request: ${method} ${url} > ${e}`)
            throw new Error(e)
        }

    }

    async getBot(id = null) {
        if (!id || isNaN(id))
            throw new TypeError("ID is not provided or is invalid")
        let res = await this.sendRequest("GET", `/bot/${id}`)
        return res;
    }
    async setStatus(id = null, status = "VERIFIED", modID = null, reason = "not specified!") {
        if (!id || isNaN(id))
            throw new TypeError("ID is not provided or is invalid")
        let availableStatus = ["VERIFIED", "REJECTED", "BANNED", "UNBANNED", "REJECTED", "UNDER_REVIEW", "UNVERIFIED"]
        if (!availableStatus.includes(status))
            throw new TypeError("Invalid status")
        let body = {
            "verification_status": status.toString(),
            "verified": status == "VERIFIED" ? "True" : "False",
            "reason": status == "REJECTED" ? reason.toString() : undefined,
            "moderator_id": modID.toString()
        }

        let res = await this.sendRequest("PUT", `/bot/status/${id}/`, body)
        return res;
    }
    async updateBots() {
        let res = await this.sendRequest("GET", "/bots")
        console.log("checking botlist integrity")
        if (!Array.isArray(res) || res.length <= 0) {
            console.log("Integrity is not valid, can't use invalid data! stopping updates for security reasons")
            this.botlistUpdate = false;
        }
        this.client.botlist = res
        console.log("Integrity valid, data merged!")
    }
}
module.exports = ApiLink;