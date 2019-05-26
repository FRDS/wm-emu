var moment = require('moment');
const Discord = require('discord.js');
const {promisify } = require('util');
const GoogleSpreadsheet = require('google-spreadsheet');
const Fuse = require('fuse.js');
const courses = require('../courses.json');
const getUrl = require('get-urls');
const creds = {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY
}
var options = {
    shouldSort: true,
    threshold: 0.1,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
      "course"
    ]
  };
var fuse = new Fuse(courses, options);
var rec = new GoogleSpreadsheet(process.env.RECORDS_ID);

module.exports.run = async (client, message, args) => {
    let fulltune, fullrank, pick, embed, title, url, description, thumbnail, author, image;
    let footer = {
        "icon_url": "https://cdn.discordapp.com/icons/380717547349344256/41cd75b22d6c2d43c56b4e0b1aa595d8.png",
        "text": "WM Emulation Server"
    };
    switch (true) {
        case (args.length > 0 && !isNaN(args[0])):
            let num = Number(args[0]);
            if (num <= 0 || num > 22) return message.channel.send('⚠️ Course not found!');
            pick = courses[num-1];

            await promisify(rec.useServiceAccountAuth)(creds);
            fulltune = await promisify(rec.getCells)(1,pick.records);
            // let guest = await promisify(rec.getCells)(2,courses[num].records);
            fullrank = await createList(fulltune);
            // let guestrank = createList(guest); 

            title = `Top 10 TA - ${pick.fullname}`;
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
                    "value": `${pick.length}`,
                    "inline": true
                },
                {
                    "name": "Recommended HP",
                    "value": `${pick.hp}`,
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
        case (args.length > 0 && isNaN(args[0])):
            let search = args.join(" ");
            let result = fuse.search(search);
            if (result.length < 1) return message.channel.send('⚠️ Course not found!');
            if (result.length > 1) return message.channel.send(multipleMatch(result));
            pick = result[0];

            await promisify(rec.useServiceAccountAuth)(creds);
            fulltune = await promisify(rec.getCells)(1,pick.records);
            // let guest = await promisify(rec.getCells)(2,records.courses[num].records);
            fullrank = await createList(fulltune);
            // let guestrank = createList(guest); 
            title = `Top 10 TA - ${pick.fullname}`;
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
                    "value": `${pick.length}`,
                    "inline": true
                },
                {
                    "name": "Recommended HP",
                    "value": `${pick.hp}`,
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
        default:
            let clist = [];
            await courses.forEach(course=> {
                clist.push(`${course.id}. ${course.fullname}`);
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
            embed = new Discord.RichEmbed({
                title: title,
                description: description,
                timestamp: moment(),
                color: 16711680,
                author: author,
                thumbnail: thumbnail,
                footer: footer
            });
            break;
    }
    return message.channel.send('', embed);
}

function multipleMatch(matches) {
    let msg = "__⚠️Multiple Matches found!__:";
    matches.map(match => {
        msg += `\n- ${match.fullname}`; 
    })
    return msg;
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
    name: "course",
    description: "Display information of a course",
    usage: "- course [course number]\n- course [course name]"
}