var moment = require('moment');
const Discord = require('discord.js');
const Fuse = require('fuse.js');
const courses = require('../courses.json');
var options = {
    shouldSort: true,
    threshold: 0,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
      "course"
    ]
  };
var fuse = new Fuse(courses, options);

module.exports.run = async (client, message, args) => {
    let msg;
    switch (true) {
        case (args.length > 0 && !isNaN(args[0])):
            let num = Number(args[0]);
            if (num <= 0 || num > 22) return message.channel.send('⚠️ Course not found!');
            pick = courses[num-1];
            msg = `<:Gatchan2:613924110296154129> Recommended HP setting for ${pick.fullname} is ${pick.hp}`
            break;
        case (args.length > 0 && isNaN(args[0])):
            let search = args.join(" ");
            let result = fuse.search(search);
            if (result.length < 1) return message.channel.send('⚠️ Course not found!');
            if (result.length > 1) return message.channel.send(multipleMatch(result));
            pick = result[0];
            msg = `<:Gatchan2:613924110296154129> Recommended HP setting for ${pick.fullname} is ${pick.hp}`
            break;
        default:
            msg = {
                files: ['https://media.discordapp.net/attachments/458948744856076289/584909951454150668/sXBPHCw_d.jpg']
            }
            break;
    }
    return message.channel.send(msg);
}

function multipleMatch(matches) {
    let msg = "__⚠️Multiple Matches found!__:";
    matches.map(match => {
        msg += `\n- ${match.fullname}`; 
    })
    return msg;
}  

module.exports.help = {
    name: "hp",
    description: "Display the recommended horsepower for a course.",
    usage: "- hp [course number]\n- hp [course name]"
}