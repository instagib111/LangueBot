const disc = require("discord.js")
const tran = require('node-google-translate-skidz')

const bot = new disc.Client()
const prefix = "!langue"

bot.on('ready', function(){
    console.log('connected');
})

bot.on('message', function(message){
    let pre = ""
    let cmd = "" 
    let arg = ""
    let regTran = /^[a-z\-a-z]{5}$/
    try{
        pre = message.content.split(' ')[0]
        cmd = message.content.split(' ')[1]
        arg = message.content.split(pre+' '+cmd)[1]

    }
    catch(e){
        console.log(e);
    }
    if (pre.toLowerCase() === prefix){
        if (regTran.test(cmd) && arg.trim().length > 2 ){
            let from = cmd.split('-')[0]
            let to = cmd.split('-')[1]

            tran({
                text : arg, 
                source : from, 
                target : to
            }, 
            (res) => {
                message.reply(res.translation)
            })
        }
    }
})

bot.login('MzcyMDg4NDc1Mzg3OTUzMTYy.DM_F_Q.19xonmEQtprN85ny4ESLn-gslds')