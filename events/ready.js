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