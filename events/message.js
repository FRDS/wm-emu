module.exports = async (client, message) => {
	if (message.author.bot) return;
	if (message.content.indexOf(process.env.PREFIX) !== 0) return;
	const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
  	const cmd = args.shift().toLowerCase();
	let cmdfile = client.commands.get(cmd);
	if(!cmdfile) return; 
	await cmdfile.run(client, message, args);
	return console.log(`${message.author.tag} used ${cmd} command.`);
};

module.exports.help = {
    name: "message"
}