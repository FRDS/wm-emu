const { promisify } = require('util');
const GoogleSpreadsheet = require('google-spreadsheet');
const creds = {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY
}
var res = new GoogleSpreadsheet(process.env.RESPONSES_ID);

module.exports = async (client) => {
    await promisify(res.useServiceAccountAuth)(creds)
    let info = await promisify(res.getInfo)()
    let agg = info.worksheets[1];
    let records = await promisify(agg.getRows)({
        limit: 4
    });
    client.user.setPresence({ game: { name: `with ${records[1].count} records.` }, status: 'idle' });
    console.log(`Bot is up! ${records[1].count} records and counting...`);
};

module.exports.help = {
    name: "ready"
}