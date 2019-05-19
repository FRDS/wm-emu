var moment = require('moment');
const { promisify } = require('util');
const GoogleSpreadsheet = require('google-spreadsheet');
const creds = {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY
}
var res = new GoogleSpreadsheet(process.env.RESPONSES_ID);

module.exports.run = async (client, message, args) => {
    await promisify(res.useServiceAccountAuth)(creds)
    const info = await promisify(res.getInfo)()
    let time = moment(info.timestamp).format('LLL');
    const agg = info.worksheets[1];
    const carList = info.worksheets[2];
    const settings = await promisify(agg.getRows)({
        offset: 5 
    });
    let top10 = await promisify(carList.getRows)({
        limit: 10
    });
    let carRank = [];
    await top10.forEach(car => {
       carRank.push(`${car.rank}. ${car.model}`); 
    });
    const embed = {
            "description": `Last updated on **${time}**`,
            "color": 16711680,
            "timestamp": new Date(),
            "author": {
                "name": "Car Usage Info",
                "url": "https://docs.google.com/spreadsheets/d/1Iv2v1HKuEsbM_2FEDVpDC2sK7zJwdnsgtGaQl57Daco/edit#gid=0", 
                "icon_url": "https://cdn.discordapp.com/avatars/435142969209651201/459e8f02ab9ccfc658b5aea416ea1775.png"
              },
            "footer": {
                "icon_url": "https://cdn.discordapp.com/icons/380717547349344256/41cd75b22d6c2d43c56b4e0b1aa595d8.png",
                "text": "WM Emulation Server"
            },
            "thumbnail": {
                "url": "https://wikiwiki.jp/wmmt/?plugin=ref&page=RX-7+Type+R+%28FD3S%29&src=_20190506_163859.JPG"
            },
            "fields": [{
                    "name": `__**Full Tuned Car Used**__`,
                    "value": `${settings[0].count}`,
                    "inline": true
                },  
                {
                    "name": `__**Guest Car Used**__`,
                    "value": `${settings[1].count}`,
                    "inline": true
                },  
                {
                    "name": `__**Top 10 Most Used Cars**__`,
                    "value": `${carRank.join('\n')}`
                }
            ]
    };
    return message.channel.send({
        embed
    });

}

module.exports.help = {
    name: "car"
}