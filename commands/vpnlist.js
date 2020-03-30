var moment = require('moment');
const Discord = require('discord.js');
const vpn = require('vpnrpc');

module.exports.run = async (client, message, args) => {
    let api = vpn.VpnServerRpc("34.87.52.82",443,"",process.env.SERVER_PASSWORD,false);
    let hub_A = vpn.VpnRpcHubStatus({
        HubName_str: SG-A,
    });
    let hub_B = vpn.VpnRpcHubStatus({
        HubName_str: SG-B,
    });

    let session_A = await update(hub_A, api);
    let session_B = await update(hub_B, api);

    let embed, author, fields, thumbnail;
    let footer = {
        "icon_url": "https://cdn.discordapp.com/icons/380717547349344256/41cd75b22d6c2d43c56b4e0b1aa595d8.png",
        "text": "WM Emulation Server"
    };
    author = {
        "name": "VPN Player List (SGP)",
        "icon_url": "https://cdn.discordapp.com/avatars/435142969209651201/459e8f02ab9ccfc658b5aea416ea1775.png"
    };
    thumbnail = {
        "url": "https://icons.iconarchive.com/icons/custom-icon-design/all-country-flag/256/Singapore-Flag-icon.png"
    };
    fields = [{
        "name": "Hub SG-A",
        "value": `${session_A} players`
    },
    {
        "name": "Hub SG-B",
        "value": `${session_B} players`
    }]
    embed = new Discord.RichEmbed({
        title: title,
        timestamp: moment(),
        color: 16711680,
        author: author,
        thumbnail: thumbnail,
        fields: fields,
        footer: footer
    });
    return message.channel.send('', embed);
}

async function update(hub,api){
    let out = await api.GetHubStatus(hub);
    console.log(out);
    res = out.result.NumSessions_u32;
    return res;
}

module.exports.help = {
    name: "hp"
}