'use strict';  
const Discord = require('discord.js');
const { Client, Permissions, Intents } = require('discord.js');
const intents = [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES ];
require('dotenv').config();
const token = process.env.token;
const prefix = process.env.prefix;
const server = process.env.inbox;
const client = new Client({
  intents: intents,
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

client.on("messageCreate",  message => {
  const reply = (msg) => {
  return  message.reply(msg)
}
const inbox = client.channels.cache.get(server)
if (!message.content.startsWith(prefix) || message.author.bot) return;
if (!message.content.startsWith(prefix)) return;
if(!message.channel.id == inbox) return;
	
const args = message.content.slice(prefix.length).trim().split(' ');
const command = args.shift().toLowerCase();
const args1 = args[0];
if(message.channel.type != 'GUILD_TEXT')return;
if(command == "check"){
  if(message.channel.id == inbox){
    console.log(message.author.tag+' Ran Check Command');
const embed = new Discord.MessageEmbed()
   .setDescription(`**Permissions Checker**\n\n> Check If The Bot Has The Permission That It Needs\n\n- Add Reaction : **${message.member.guild.me.permissions.has(Permissions.FLAGS.ADD_REACTION)}**\n- Manage Message : **${message.member.guild.me.permissions.has('MANAGE_MESSAGES')}**\n- Embed Links : **${message.member.guild.me.permissions.has(Permissions.FLAGS.EMBED_LINKS)}**\n- Read Message History : **${message.member.guild.me.permissions.has(Permissions.FLAGS.READ_MESSAGE_HISTORY)}**\n- View Channel : **${message.member.guild.me.permissions.has(Permissions.FLAGS.VIEW_CHANNEL)}**\n- Send Message : **${message.member.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES)}**`)
   .setFooter('Check The Console For More Information')
   message.reply({ embeds: [embed] }).catch(err => {
     message.channel.send(`**Permissions Checker**\n\n> Check If The Bot Has Permission That It Needs\n\n- Add Reaction : **${message.member.guild.me.permissions.has(Permissions.FLAGS.ADD_REACTION)}**\n- Manage Message : **${message.member.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)}**\n- Embed Links : **${message.member.guild.me.permissions.has(Permissions.FLAGS.EMBED_LINKS)}**\n- Read Message History : **${message.member.guild.me.permissions.has('READ_MESSAGE_HISTORY')}**\n- View Channel : **${message.member.guild.me.permissions.has(Permissions.FLAGS.VIEW_CHANNEL)}**\n- Send Message : **${message.member.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES)}**`);
     console.error(`Modmail Error : ${err}`);
   })
  }


}
if(command == "reply"){
    if(message.channel.id == inbox){
if(args1 == undefined || args1 == ""){
 message.delete()
 reply('Please Provide A User ID').then(msg => {
  setTimeout(() => {
        msg.delete()
  }, 5000)
  }).catch(err => {
    console.error(`Modmail Error : ${err}`);
  })
}else{
  if(args[1] == undefined || args[1] == ""){
    message.delete()
   reply('Please Provide A Message').then(msg => {
  setTimeout(() => {
        msg.delete()
  }, 5000)
    }).catch(err => {
    console.error(`Modmail Error : ${err}`);
  })
  }else{
     try{
     client.users.cache.get(args1).send( `**Reply From ${message.author.username} : **\n`+`${message.content.slice(prefix.length+7+args[0].length)}`).then(msg => {
       reply(`Successfully Send Message To <@${args[0]}>`).then(msg => {
           setTimeout(() => {
        msg.delete()
  }, 3000)
   }).catch(err => {
    console.error(`Modmail Error : ${err}`);

  })
   message.react('✅');
       }).catch(err => {
       message.react('❌');
    console.error(`Modmail Error : ${err}`); 
  });
   }catch(e){
      message.react('❌');
   }
  }}
    }else {
      
    }
}
})



client.on("messageCreate", async (message) => {
  if(message.author.bot) return;
if(message.channel.type == 'DM'){
    message.react('✅');
  const inbox = client.channels.cache.get(server);
if(message.author.id == `${client.user.id}`){
}else {
  const embed = new Discord.MessageEmbed()
   .setAuthor('Inbox')
   .setDescription(`**__From__ :** <@${message.author.id}> (${message.author.username}#${message.author.discriminator})\n`)
   	.setTimestamp()
.setFooter(`ID : ${message.author.id}`,message.author.avatarURL({ dynamic:true }))

   if(message.content){
     embed.addField(`**__Message__ :**\n`, '```fix\n'+message.content+'```'
,false)
}
    if (message.attachments.size > 0) {

  embed.setImage(`${message.attachments.first().url || ""}`)
    }
    inbox.send({ embeds: [embed] });
  
}
}
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}! Modmail Is Ready !`);
  

});

client.login(token)

