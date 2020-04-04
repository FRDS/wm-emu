var moment = require('moment');
const Discord = require('discord.js');
const fetch = require("node-fetch")
const https = require("https");
const agent = new https.Agent({
    rejectUnauthorized: false
})
const flag = {
    "us": `\uD83C\uDDFA\uD83C\uDDF8`,
    "au": `\uD83C\uDDE6\uD83C\uDDFA`,
    "sg": `\uD83C\uDDF8\uD83C\uDDEC`
};
// const vpn = require('vpnrpc');

module.exports.run = async (client, message, args) => {
    // let hub_A = vpn.VpnRpcHubStatus({
    //     HubName_str: "SG-A",
    // });
    // let hub_B = vpn.VpnRpcHubStatus({
    //     HubName_str: "SG-B",
    // });
    message.delete();
    let embed = await UpdateEmbed();
    let sent = await message.channel.send('',embed);
    
    message.channel.fetchMessages({around: sent.id, limit: 1})
    .then(msg => {
        const fetchedMsg = msg.first();
        setInterval(async function(){
            embed = await UpdateEmbed();
            fetchedMsg.edit('',embed);
            console.log("Player list updated.");
        },30000);
    });
}

async function UpdateEmbed() {
    // let AU_A = await UpdateSession("AU", "AU-A");
    let NA_A = await UpdateSession("NA", "NA-A");
    let NA_B = await UpdateSession("NA", "NA-B");
    let SG_A = await UpdateSession("SG", "SG-A");
    let SG_B = await UpdateSession("SG", "SG-B");

    let embed, author, description;
    let footer = {
        "icon_url": "https://cdn.discordapp.com/icons/380717547349344256/41cd75b22d6c2d43c56b4e0b1aa595d8.png",
        "text": "WM Emulation Server"
    };
    author = {
        "name": "VPN Player List",
        "icon_url": "https://cdn.discordapp.com/avatars/435142969209651201/459e8f02ab9ccfc658b5aea416ea1775.png"
    };
    description = `**${flag.us} Hub NA-A (${NA_A.length}/4):**\n${NA_A.join('\n')}`;
    description += `\n\n**${flag.us} Hub NA-B (${NA_B.length}/4):**\n${NA_B.join('\n')}`;
    description += `\n\n**${flag.sg} Hub SG-A (${SG_A.length}/4):**\n${SG_A.join('\n')}`;
    description += `\n\n**${flag.sg} Hub SG-B (${SG_B.length}/4):**\n${SG_B.join('\n')}\n`;
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
    let api = (server === 'SG') ? 'https://34.87.52.82:443/api/':'https://35.224.158.198:443/api/';
    let pw = (server === 'SG') ? process.env.SG_SERVER_PASSWORD : process.env.NA_SERVER_PASSWORD;
    let body = {
        "jsonrpc": "2.0",
        "id": "rpc_call_id",
        "method": "EnumSession",
        "params": {
            "HubName_str": hub
        }
    }

    let players = [];

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
                players.push(`- ${session.Username_str}`);
            })
            return players;
        })
        .catch(err => console.error(err));
}


module.exports.conf = {
    hidden: true
};

module.exports.help = {
    name: "vpnlist"
};