module.exports = async (client) => {
    client.user.setPresence({ status: 'idle' });
    console.log(`Bot is up!`);
};

module.exports.help = {
    name: "ready"
}