module.exports = async (client) => {
    client.user.setPresence({ status: 'idle' });
    console.log(`Bot is up!`);
    await client.commands.get('vpnlist').run(client);
};

module.exports.help = {
    name: "ready"
}