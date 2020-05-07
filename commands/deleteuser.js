const fetch = require("node-fetch")
const https = require("https");
const agent = new https.Agent({
    rejectUnauthorized: false
})

module.exports.run = async (client, message, args) => {
    if (args.length < 1) return message.channel.send('Please specify a **username!**');
    if (args[0] === 'terminal') return message.channel.send('Deleting terminal account is not allowed!');
    let name = args[0];
    let text = '';

    text += await userDelete(name, "AU", "AU-A").catch(err => {
        return err;
    });
    text += await userDelete(name, "AU", "AU-B").catch(err => {
        return err;
    });
    text += await userDelete(name, "HK", "HK-A").catch(err => {
        return err;
    });
    text += await userDelete(name, "HK", "HK-B").catch(err => {
        return err;
    });
    text += await userDelete(name, "NA", "NA-A").catch(err => {
        return err;
    });
    text += await userDelete(name, "NA", "NA-B").catch(err => {
        return err;
    });
    text+= await userDelete(name, "SG", "SG-A").catch(err => {
        return err;
    });
    text+= await userDelete(name, "SG", "SG-B").catch(err => {
        return err;
    });
    text+= await userDelete(name, "SG", "SG-C").catch(err => {
        return err;
    });
    text+= await userDelete(name, "SG", "SG-D").catch(err => {
        return err;
    });
    text+= await userDelete(name, "UK", "UK-A").catch(err => {
        return err;
    });
    text+= await userDelete(name, "UK", "UK-B").catch(err => {
        return err;
    });
    
    return message.channel.send(text);
}

async function userDelete(name, server, hub) {
    let api, pw, body;
    switch (server) {
        case 'HK':
            api = 'https://35.241.96.172:443/api/';
            pw = process.env.HK_SERVER_PASSWORD;
            break;
        case 'SG':
            api = 'https://210.16.120.12:5555/api/';
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
        "method": "DeleteUser",
        "params": {
          "HubName_str": hub,
          "Name_str": name
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
            return `✅ Deleted in ${hub}\n`;
        })
        .catch(err => {
            throw err;
        });
}


module.exports.conf = {
    hidden: true
};

module.exports.help = {
    name: "deleteuser"
};