var moment = require('moment');
const { promisify } = require('util');
const GoogleSpreadsheet = require('google-spreadsheet');
const creds = require(`../service-account.json`);
var res = new GoogleSpreadsheet(process.env.RESPONSES_ID);

module.exports.run = async (client, message, args) => {
    await promisify(res.useServiceAccountAuth)(creds)
    let info = await promisify(res.getInfo)()
    let time = moment(info.timestamp).format('LLL');
    let agg = info.worksheets[1];
    let crank = info.worksheets[3];
    let records = await promisify(agg.getRows)({
        limit: 4
    });
    let courses = await promisify(crank.getRows)();
    var ranklist = [];
    courses.forEach(course => {
        ranklist.push(`${course.rank}. ${course.course}`);
    });
    const embed = {
            "description": `Last updated on **${time}**`,
            "color": 16711680,
            "timestamp": new Date(),
            "author": {
                "name": "Time Attack Records Info",
                "url": "https://docs.google.com/spreadsheets/d/1Iv2v1HKuEsbM_2FEDVpDC2sK7zJwdnsgtGaQl57Daco/edit#gid=0", 
                "icon_url": "https://cdn.discordapp.com/avatars/435142969209651201/459e8f02ab9ccfc658b5aea416ea1775.png"
              },
            "footer": {
                "icon_url": "https://cdn.discordapp.com/icons/380717547349344256/41cd75b22d6c2d43c56b4e0b1aa595d8.png",
                "text": `WM Emulation Server`
            },
            "thumbnail": {
                "url": "https://i.ibb.co/qFwjQLY/Time-Attack.png"
            },
            "fields": [{
                    "name": `__**Time Attackers**__`,
                    "value": `${records[0].count} players`
                },  
                {
                    "name": `__**Total Submissions**__`,
                    "value": `${records[1].count} records`
                },
                {
                    "name": `__**✅ Approved**__`,
                    "value": `${records[2].count} records`,
                    "inline": true
                },  
                {
                    "name": `__**❌ Rejected**__`,
                    "value": `${records[3].count} records`,
                    "inline": true
                },
                {
                    "name": `__**Course List (Sorted by Popularity)**__`,
                    "value": `${ranklist.join('\n')}`,
                    "inline": true
                },
            ]
    };
    return message.channel.send({
        embed
    });

}

module.exports.help = {
    name: "info"
}