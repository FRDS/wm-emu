var moment = require('moment');
const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    let author;
    let footer = {
        "icon_url": "https://cdn.discordapp.com/icons/380717547349344256/41cd75b22d6c2d43c56b4e0b1aa595d8.png",
        "text": "WM Emulation Server"
    };
    if (!args[0]) {
        let commands = client.commands;
        author = {
            "name": `Command List`,
            "icon_url": "https://cdn.discordapp.com/avatars/435142969209651201/459e8f02ab9ccfc658b5aea416ea1775.png"
        };
        let fields = [];
        commands.filter(command => command.conf.hidden === false)
        .map(command => {
            let field = {
                "name": command.help.name,
                "value": command.help.description
            }
            fields.push(field);
        });
        let embed = new Discord.RichEmbed({
            fields: fields,
            timestamp: moment(),
            color: 16711680,
            author: author,
            footer: footer
        });
    return message.channel.send('', embed);
    }
    let command = args[0];
    if (client.commands.has(command)) {
        command = client.commands.get(command);
        author = {
            "name": `Help: ${command.help.name}`,
            "icon_url": "https://cdn.discordapp.com/avatars/435142969209651201/459e8f02ab9ccfc658b5aea416ea1775.png"
        };
        let description = `__**Description**__\n${command.help.description}\n\n__**Usage**__\n\`\`\`asciidoc\n${command.help.usage}\`\`\``

        let embed = new Discord.RichEmbed({
            description: description,
            timestamp: moment(),
            color: 16711680,
            author: author,
            footer: footer
        });
    return message.channel.send('', embed);
    }
    return message.channel.send('⚠️ Command not found!');
};

module.exports.conf = {
    enabled: true,
    aliases: ["h", "halp"]
};

module.exports.help = {
    name: "help",
    description: "Displays all the available commands.",
    usage: "help [command]"
};