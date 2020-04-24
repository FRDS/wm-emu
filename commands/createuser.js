const gen = require('generate-password');
const fetch = require("node-fetch")
const https = require("https");
const agent = new https.Agent({
    rejectUnauthorized: false
})

module.exports.run = async (client, message, args) => {
    if (args.length < 1) return message.channel.send('Please specify a **username!**');
    let name = args[0];
    let pass = gen.generate({
        length: 8,
        numbers: true
    });
    let mention = message.mentions.users.first();

    let text = await userCreate(name, pass, "AU", "AU-A").catch(err => {
        return err;
    });
    text += await userCreate(name, pass, "AU", "AU-B").catch(err => {
        return err;
    });
    text += await userCreate(name, pass, "NA", "NA-A").catch(err => {
        return err;
    });
    text += await userCreate(name, pass, "NA", "NA-B").catch(err => {
        return err;
    });
    text += await userCreate(name, pass, "SG", "SG-A").catch(err => {
        return err;
    });
    text += await userCreate(name, pass, "SG", "SG-B").catch(err => {
        return err;
    });
    text += await userCreate(name, pass, "UK", "UK-A").catch(err => {
        return err;
    });
    text += await userCreate(name, pass, "UK", "UK-B").catch(err => {
        return err;
    });
    text += "\n **Approve? (yes/no)**";

    await message.channel.send(text);
    const filter = m => m.author.id === message.author.id;
    return message.channel.awaitMessages(filter, {
        max: 1,
        time: 10000,
        errors: ['time']
    }).then(collected => {
        let msg = collected.first();
        if (msg.content === 'yes') {
            let approved = "Your account has been made. It's useable in all servers hosted by WM Emu.\n";
            approved += `\`\`\`Username: ${name}\nPassword: ${pass}\`\`\``;
            approved += "Don't share this account!"
            if (mention === undefined) {
                return msg.channel.send(approved);
            } else {
                mention.send(approved);
                return msg.channel.send(`Approved and sent to ${mention.tag}`);
            }
        } else {
            return msg.channel.send("Disapproved. Please delete any made account using `/deleteuser username`");
        }
    });
}

async function userCreate(username, pass, server, hub) {
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
        "method": "CreateUser",
        "params": {
            "HubName_str": hub,
            "Name_str": username,
            "AuthType_u32": 1,
            "Auth_Password_str": pass,
            "UsePolicy_bool": true,
            "policy:Access_bool": true,
            "policy:NoBroadcastLimiter_bool": true,
            "policy:MaxConnection_u32": 8,
            "policy:MaxMac_u32": 1,
            "policy:MaxIP_u32": 1,
            "policy:FilterIPv6_bool": true
        }
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
            if (json.hasOwnProperty('error')) throw `❌ ${hub}: \`\`\`${json.error.message}\`\`\``;
            return `✅ ${hub}\n`;
        })
        .catch(err => {
            throw err;
        });
}


module.exports.conf = {
    hidden: true
};

module.exports.help = {
    name: "createuser"
};