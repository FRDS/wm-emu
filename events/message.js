module.exports = async (client, message) => {
    if (message.author.bot) return;
	let messageArray =  message.content.split(" ");
	let cmd = messageArray[0];
	let args = messageArray.slice(1);

	let commandfile = client.commands.get(cmd.slice(process.env.PREFIX.length));
	if(commandfile) commandfile.run(client, message, args);
};

module.exports.help = {
    name: "message"
}