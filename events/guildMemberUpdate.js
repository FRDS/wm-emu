module.exports = async (client, oldMember, newMember) => {
    if (oldMember.roles.has('553948928589037608')) return;
    if (!newMember.roles.has('553948928589037608')) return;
    let body = "Welcome to WMMT5 Online Multiplayer Community!\n";
    body += "Before you play, make sure to register an account here: https://forms.gle/QS7LwzQdNMSH85bg7";
    return newMember.send(body);
};

module.exports.help = {
    name: "guildMemberUpdate"
}