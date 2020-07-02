const discord = require('discord.js');
const client = new discord.Client();
const config = require('./config.json');
const fs = require('fs');
const evalManager = new EvalManager();
const prefix = "s.";
let usersCooldown = [[]];

client.on('ready', function(message) {
    console.log("Silence Bot#9138 is ready to work!");
    client.user.setPresence({
        status: "dnd",
        activity: {
            name: 'Amazing server Silence and ' + prefix + 'help',
            type: "WATCHING"
        }
    });
});

client.on('message', function(message) {
    let args = message.content.split(" ").splice(1, message.content.split(" ").length);
    if(message.channel.id == '725348850147000321') {
        if(message.content == "") {
            message.react('👍');
            message.react('👎');
        }
    }
    if(message.content.toLowerCase().startsWith(prefix + 'help')) {
        const answerEmbed = new discord.MessageEmbed()
            .setColor('#c1e673')
            .setFooter(`Requested by ${message.member.user.username}`, message.member.user.displayAvatarURL({format: "gif"}))
            .setTitle(`Справка по командам Silence Bot:`)
            .addFields(
                { name: 'Отправка идей / багов / жалоб', value: '• ' + prefix + 'idea (идея) - отправляет вашу идею в канал <#726083843085565993>.\n• ' + prefix + 'bug (описание бага) - отправляет баг админам и модерам.\n• ' + prefix + 'complaint (жалоба) - отправляет вашу жалобу в канал <#727076530345476209>.'}
	         )
             .setTimestamp();
        message.channel.send(answerEmbed);
    }
    else if(message.content.toLowerCase().startsWith(prefix + 'idea ')) {
        let ideaChannel = message.guild.channels.resolve('726083843085565993');
        let ok = true;
        let placement = 0;
        for(let i = 0; i < usersCooldown.length; i++) {
            if(usersCooldown[i][0] == message.member.id && usersCooldown[i][2] == "idea") {
                if(usersCooldown[i][1] == true) { ok = false; }
                placement = i;
            }
        }
        if(ok) {
            const answerEmbed = new discord.MessageEmbed()
                .setColor('#c1e673')
                .setAuthor(message.member.user.username, message.member.user.displayAvatarURL())
                .setTitle(`Предложение:`)
                .setDescription(`${message.content.replace(prefix + 'idea ', '')}`)
            ideaChannel.send(answerEmbed).then(message => {
                message.react('👍');
                message.react('👎');
            });
            message.delete();
            message.reply("ваша идея была отправлена в <#726083843085565993>.")
            usersCooldown.push([message.member.id, true, "idea"]);
            setTimeout(function() {
                usersCooldown.splice(usersCooldown.length - 1, 1);
            }, 600000)
        } else {
            const answerEmbed = new discord.MessageEmbed()
                .setColor('#ff0000')
                .setTitle(`Ошибка в отправке предложения!`)
                .setDescription(`${message.author}, пожалуйста, подождите примерно 10 минут (таков таймаут).`)
            message.channel.send(answerEmbed);
        }
    } else if(message.content.toLowerCase().startsWith(prefix + 'bug ')) {
        let bugChannel = message.guild.channels.resolve('727447198320820285');
        let ok = true;
        let placement = 0;
        for(let i = 0; i < usersCooldown.length; i++) {
            if(usersCooldown[i][0] == message.member.id && usersCooldown[i][2] == "bug") {
                if(usersCooldown[i][1] == true) { ok = false; }
                placement = i;
            }
        }
        if(ok) {
            const answerEmbed = new discord.MessageEmbed()
                .setColor('#eda05c')
                .setAuthor(message.member.user.username, message.member.user.displayAvatarURL())
                .setTitle(`Обнаружен баг:`)
                .setDescription(`${message.content.replace(prefix + 'bug ', '')}`)
            bugChannel.send(answerEmbed);
            message.delete();
            message.reply("Ваш баг был отправлен админам и модерам.")
            usersCooldown.push([message.member.id, true, "bug"]);
            setTimeout(function() {
                usersCooldown.splice(usersCooldown.length - 1, 1);
            }, 3600000)
        } else {
            const answerEmbed = new discord.MessageEmbed()
                .setColor('#ff0000')
                .setTitle(`Ошибка в отправке бага!`)
                .setDescription(`${message.author}, пожалуйста, подождите примерно 1 час (таков таймаут).`)
            message.channel.send(answerEmbed);
        }
    } else if(message.content.toLowerCase().startsWith(prefix + 'complaint ')) {
        let complaintChannel = message.guild.channels.resolve('727076530345476209');
        let ok = true;
        let placement = 0;
        for(let i = 0; i < usersCooldown.length; i++) {
            if(usersCooldown[i][0] == message.member.id && usersCooldown[i][2] == "complaint") {
                if(usersCooldown[i][1] == true) { ok = false; }
                placement = i;
            }
        }
        if(ok) {
            const answerEmbed = new discord.MessageEmbed()
                .setColor('#ed634a')
                .setAuthor(message.member.user.username, message.member.user.displayAvatarURL())
                .setTitle(`Жалоба:`)
                .setDescription(`${message.content.replace(prefix + 'complaint ', '')}`)
            complaintChannel.send(answerEmbed).then(message => {
                message.react('👍');
                message.react('👎');
            });;
            message.delete();
            message.reply("ваша жалоба была отправлена в <#727076530345476209>.")
            usersCooldown.push([message.member.id, true, "complaint"]);
            setTimeout(function() {
                usersCooldown.splice(usersCooldown.length - 1, 1);
            }, 1800000)
        } else {
            const answerEmbed = new discord.MessageEmbed()
                .setColor('#ff0000')
                .setTitle(`Ошибка в отправке жалобы!`)
                .setDescription(`${message.author}, пожалуйста, подождите примерно 30 минут (таков таймаут).`)
            message.channel.send(answerEmbed);
        }
    }
});

client.login(config.token);
