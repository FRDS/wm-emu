var moment = require('moment');
const Discord = require('discord.js');
const fetch = require("node-fetch")
const https = require("https");
const agent = new https.Agent({
    rejectUnauthorized: false
})
const flag = {
    "us": `\uD83C\uDDFA\uD83C\uDDF8`,
    "gb": `\uD83C\uDDEC\uD83C\uDDE7`,
    "au": `\uD83C\uDDE6\uD83C\uDDFA`,
    "sg": `\uD83C\uDDF8\uD83C\uDDEC`
};

module.exports.run = async (client, message, args) => {
    message.delete();
    let embed = await UpdateEmbed();
    let sent = await message.channel.send('', embed);

    message.channel.fetchMessages({
            around: sent.id,
            limit: 1
        })
        .then(msg => {
            const fetchedMsg = msg.first();
            setInterval(async function () {
                embed = await UpdateEmbed()
                fetchedMsg.edit('', embed);
                console.log("Player list updated.");
            }, 30000);
        });
}

async function UpdateEmbed() {
    // let AU_A = await UpdateSession("AU", "AU-A");
    // let AU_B = await UpdateSession("AU", "AU-B");
    let NA_A = await UpdateSession("NA", "NA-A");
    let NA_B = await UpdateSession("NA", "NA-B");
    let SG_A = await UpdateSession("SG", "SG-A");
    let SG_B = await UpdateSession("SG", "SG-B");
    let UK_A = await UpdateSession("UK", "UK-A");
    let UK_B = await UpdateSession("UK", "UK-B");

    // let totalplayers = NA_A.players.length + NA_B.players.length + SG_A.players.length + SG_B.players.length + UK_A.players.length + AU_B.players.length;

    let embed, author, description;
    let footer = {
        "icon_url": "https://cdn.discordapp.com/icons/380717547349344256/41cd75b22d6c2d43c56b4e0b1aa595d8.png",
        "text": "WM Emulation Server"
    };
    author = {
        "name": "VPN Player List",
        "icon_url": "https://cdn.discordapp.com/avatars/435142969209651201/459e8f02ab9ccfc658b5aea416ea1775.png"
    };
    // description = `**${flag.au} Hub AU-A (${AU_A.players.length}/4)\nTerminal Emu: ${AU_A.terminal}**\n${AU_A.players.join('\n')}`;
    // description += `\n\n**${flag.au} Hub AU-B (${AU_B.players.length}/4)\nTerminal Emu: ${AU_B.terminal}**\n${AU_B.players.join('\n')}`;
    description += `\n\n**${flag.us} Hub NA-A (${NA_A.players.length}/4)\nTerminal Emu: ${NA_A.terminal}**\n${NA_A.players.join('\n')}`;
    description += `\n\n**${flag.us} Hub NA-B (${NA_B.players.length}/4)\nTerminal Emu: ${NA_B.terminal}**\n${NA_B.players.join('\n')}`;
    description += `\n\n**${flag.sg} Hub SG-A (${SG_A.players.length}/4)\nTerminal Emu: ${SG_A.terminal}**\n${SG_A.players.join('\n')}`;
    description += `\n\n**${flag.sg} Hub SG-B (${SG_B.players.length}/4)\nTerminal Emu: ${SG_B.terminal}**\n${SG_B.players.join('\n')}`;
    description += `\n\n**${flag.gb} Hub UK-A (${UK_A.players.length}/4)\nTerminal Emu: ${UK_A.terminal}**\n${UK_A.players.join('\n')}`;
    description += `\n\n**${flag.gb} Hub UK-B (${UK_B.players.length}/4)\nTerminal Emu: ${UK_B.terminal}**\n${UK_B.players.join('\n')}`;
    // description += `\n\n**Total players connected: ${totalplayers}**`;
    embed = new Discord.RichEmbed({
        timestamp: moment(),
        color: 16711680,
        author: author,
        description: description,
        footer: footer
    });
    return embed;
}

async function UpdateSession(server, hub) {
    let api, pw, body;
    switch (server) {
        case 'SG':
            api = 'https://34.87.52.82:443/api/';
            pw = process.env.SG_SERVER_PASSWORD;
            break;
        case 'NA':
            api = 'https://35.224.158.198:443/api/';
            pw = process.env.NA_SERVER_PASSWORD;
            break;
        case 'AU':
            api = 'https://27.100.36.36:5555/api/';
            pw = process.env.AU_SERVER_PASSWORD;
            break;
        case 'UK':
            api = 'https://derole.co.uk:5555/api/';
            pw = process.env.UK_SERVER_PASSWORD;
            break;
    };
    body = {
        "jsonrpc": "2.0",
        "id": "rpc_call_id",
        "method": "EnumSession",
        "params": {
            "HubName_str": hub
        }
    }

    let HubStatus = {
        online: true,
        terminal: "Disabled",
        players: []
    }

    return fetch(api, {
            method: 'post',
            agent: agent,
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'X-VPNADMIN-HUBNAME': "",
                'X-VPNADMIN-PASSWORD': pw
            },
        })
        .then(res => res.json())
        .then(json => {
            let list = json.result.SessionList;
            list.map(session => {
                if (session.Username_str === 'terminal') {
                    HubStatus.terminal = "Enabled";
                } else {
                    HubStatus.players.push(`- ${session.Username_str}`);
                }
            })
            return HubStatus;
        })
        .catch(err => console.error(err));
}


module.exports.conf = {
    hidden: true
};

module.exports.help = {
    name: "vpnlist"
};