var moment = require('moment');
const Discord = require('discord.js');
const {promisify } = require('util');
const GoogleSpreadsheet = require('google-spreadsheet');
const creds = require('../service-account.json');
const records = require('../records.json');
const getUrl = require('get-urls');
var res = new GoogleSpreadsheet(process.env.RESPONSES_ID);
var rec = new GoogleSpreadsheet(process.env.RECORDS_ID);

module.exports.run = async (client, message, args) => {
    await promisify(res.useServiceAccountAuth)(creds)
    let info = await promisify(res.getInfo)()
    let cinfo = info.worksheets[4];
    let courses = await promisify(cinfo.getRows)();
    let embed, title, url, description, thumbnail, author, image;
    let footer = {
        "icon_url": "https://cdn.discordapp.com/icons/380717547349344256/41cd75b22d6c2d43c56b4e0b1aa595d8.png",
        "text": "WM Emulation Server"
    };
    switch (true) {
        case (args.length == 1):
            if (isNaN(args[0])) return message.channel.send('⚠️ Wrong input');
            let num = Number(args[0]);
            if (num <= 0 && num > 22) return message.channel.send('⚠️ Course not found!');

            await promisify(rec.useServiceAccountAuth)(creds);
            let fulltune = await promisify(rec.getCells)(1,records.courses[num-1].records);
            // let guest = await promisify(rec.getCells)(2,records.courses[num].records);
            let fullrank = await createList(fulltune);
            // let guestrank = createList(guest); 
            let pick = courses.find(course => course.number === args[0]);

            title = `Top 10 TA - ${pick.course}`;
            url = "https://docs.google.com/spreadsheets/d/1Iv2v1HKuEsbM_2FEDVpDC2sK7zJwdnsgtGaQl57Daco";
            description = `${fullrank.join('\n')}`;
            author = {
                "name": "Course Info",
                "url": "https://docs.google.com/spreadsheets/d/1Iv2v1HKuEsbM_2FEDVpDC2sK7zJwdnsgtGaQl57Daco/edit#gid=0",
                "icon_url": "https://cdn.discordapp.com/avatars/435142969209651201/459e8f02ab9ccfc658b5aea416ea1775.png"
            };
            thumbnail = {
                "url": `${pick.icon}`
            };
            image = {
                "url": `${pick.map}`
            }
            fields = [{
                    "name": "Course Length",
                    "value": `${pick.length}`
                },
                {
                    "name": "Recommended HP",
                    "value": `${pick.hp}`,
                    "inline": true
                },
                {
                    "name": "Recommended HP (R35)",
                    "value": `${pick.hpr35}`,
                    "inline": true
                }
            ];
            embed = new Discord.RichEmbed({
                title: title,
                url: url,
                description: description,
                timestamp: moment(),
                color: 16711680,
                author: author,
                thumbnail: thumbnail,
                footer: footer,
                fields: fields,
                image: image
            });
            break;
        case (args.length >= 2):
            break;
        default:
            let clist = [];
            await courses.forEach(id => {
                clist.push(`${id.number}. ${id.course}`);
            })
            title = "__Course List__";
            description = `${clist.join('\n')}`;
            author = {
                "name": "Course Info",
                "icon_url": "https://cdn.discordapp.com/avatars/435142969209651201/459e8f02ab9ccfc658b5aea416ea1775.png"
            };
            thumbnail = {
                "url": "https://wikiwiki.jp/wmmt/?plugin=attach&refer=C1&openfile=c1out_01b1-2.jpg"
            };
            fields = [{
                "name": "How to check a course's info",
                "value": "Type `~course <course number>`"
            }];
            embed = new Discord.RichEmbed({
                title: title,
                description: description,
                timestamp: moment(),
                color: 16711680,
                author: author,
                thumbnail: thumbnail,
                footer: footer,
                fields: fields
            });
            break;
    }
    return message.channel.send('', embed);
}


function createList(cells) {
    let list = [];
    let j = 1;
    for (let i=0; i < cells.length-2; i+=3) {
        if (cells[i].value === undefined) break;
        if (cells[i+2].formula === undefined) {
            list.push(`${j}. ${cells[i+2].value} (${cells[i].value}) - ${cells[i+1].value}`);
        } else {
            let link = getUrl(cells[i+2].formula);
            list.push(`[${j}. ${cells[i+2].value} (${cells[i].value}) - ${cells[i+1].value}](${link.keys().next().value})`);
        }
        j++;
    }
    return list;
}



module.exports.help = {
    name: "course"
}