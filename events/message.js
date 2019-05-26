module.exports = async (client, message) => {
	if (message.author.bot) return;
	if (message.content.indexOf(process.env.PREFIX) !== 0) return;
	const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
  	const cmd = args.shift().toLowerCase();
	let cmdfile = client.commands.get(cmd);
	if(!cmdfile) return; 
	cmdfile.run(client, message, args);
};

module.exports.help = {
    name: "message"
}