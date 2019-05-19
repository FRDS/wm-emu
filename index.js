//CONFIG
require('dotenv').config();
const Discord = require('discord.js');
const fs = require("fs");

//LAUNCH BOT
const client = new Discord.Client();
client.login(process.env.TOKEN);
client.commands = new Discord.Collection();

fs.readdir("./commands/", (err,files) => {
	if(err) console.log(err);
	let cmdfiles = files.filter(f => f.split(".").pop() === "js");

	if(cmdfiles.length <= 0) return console.log("Command list not found!");
	
	console.log(`\nLoading ${cmdfiles.length} command files...`);

	for(var i = 0;i < cmdfiles.length;i++){
		let props = require(`./commands/${cmdfiles[i]}`);
		console.log(`${i+1}: ${cmdfiles[i]} loaded!`);
		client.commands.set(props.help.name, props);
	}
});

fs.readdir("./events/", (err,files) => {
	if(err) console.log(err);
	let evtfiles = files.filter(f => f.split(".").pop() === "js");

	if (evtfiles.length <= 0) return console.log("Event listener list not found!");

	console.log(`\nLoading ${evtfiles.length} event listener...`);

	for(var i = 0;i < evtfiles.length;i++){
		let props = require(`./events/${evtfiles[i]}`);
		console.log(`${i+1}: ${evtfiles[i]} loaded!`);
		client.on(props.help.name, props.bind(null, client));
		delete require.cache[require.resolve(`./events/${evtfiles[i]}`)];
	};
});

process.on('unhandledRejection', (err) => { 
  console.error(err)
  process.exit(1)
});