const Client = require("./Base/Client");

const client = new Client({
    disableMentions: 'everyone',
});
const { TOKEN } = require("./config")

if (!TOKEN) {
    console.error("no token provided, exiting...")
    return process.exit(1)
}





client.login(TOKEN);