const disc = require("discord.js")
const { translate, detectLanguage } = require('deepl-translator');
const conf = require("./config.json")

const bot = new disc.Client()
const prefix = conf.prefix

bot.on('ready', function(){
    console.log('connected');
})

bot.on('message', function(message){
    let pre = ""
    let cmd = "" 
    let arg = ""
    let regTran = /^[a-z]{2}\-[a-z]{2}$/
    try{
        pre = message.content[0]
        cmd = message.content.split(' ')[0].substring(1)
        arg = message.content.split(pre + cmd)[1]

    }
    catch(e){
        console.log(e);
    }
    if (pre === prefix){
        if (regTran.test(cmd) && arg.trim().length > 2 ){
            let from = cmd.split('-')[0]
            let to = cmd.split('-')[1]

            translate(arg, from.toUpperCase(), to.toUpperCase())
            .then(res => message.channel.send("_" + arg + "_ => " + "_" + res.translation + "_") )
            .catch( e => message.channel.send(e))
        }
    }
})

bot.login(conf.token)