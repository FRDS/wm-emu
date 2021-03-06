module.exports.run = async (client, message, args) => {
	if (!message.author.id === process.env.OWNER_ID) return message.reply("Oof! Anda tidak berhak menggunakan perintah ini.");
	const m = await message.channel.send("Ping?");
	m.edit(`**Pong!** ${m.createdTimestamp - message.createdTimestamp}ms.`);
	m.delete(3000).then(message.delete());
}

module.exports.conf = {
    hidden: false
};

module.exports.help = {
	name: "ping",
    description: "Ping the bot to measures latency.",
    usage: "ping"
}