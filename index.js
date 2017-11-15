const disc = require("discord.js")
const { translate, detectLanguage } = require('deepl-translator');
const dic = require("word-definition")
const gen = require("gender-fr")

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
    let def = "def"
    let regWord = /^[A-Za-z\u00E0-\u00FC]+$/

    try{
        pre = message.content[0]
        cmd = message.content.split(' ')[0].substring(1)
        try {
            arg = message.content.split(pre + cmd)[1].trim()
        }catch (e){}
    }
    catch(e){
        console.log(e);
    }
    if (pre === prefix){
        if (regTran.test(cmd) && arg.length > 2 ){ //deepl
            let from = cmd.split('-')[0]
            let to = cmd.split('-')[1]

            translate(arg, to.toUpperCase(), from.toUpperCase())
            .then(res => message.channel.send("_" + arg + "_ => " + "_" + res.translation + "_") )
            .catch( e => message.channel.send(e))
        }
        if(def === cmd && regWord.test(arg)){ // wikitionary
            let lang = message.channel.name == "anglais" ? "en" : "fr" 
            dic.getDef(arg, lang, {exact : false}, (def) => {
                let genderOfNoun = ""
                let res = ""
                if (lang == "fr" && def.category == "nom"){
                    try {
                        gen.gendersForNoun(def.word, (e, g) => {
                            gen.addDefiniteArticle(def.word, (er, definite) => {
                                gen.addIndefiniteArticle(def.word, (err, indefinite) => {
                                    if (g[0] == 'f')
                                        genderOfNoun = " féminin (" + definite + "; " + indefinite + ")"
                                    else if (g[0] == 'm')
                                        genderOfNoun = " masculin (" + definite + "; " + indefinite + ")"
                                    
                                    res = "__" + def.word + "__, " + def.category + genderOfNoun + 
                                        " : \r  `" + def.definition + "`" 
                                    
                                    if(!def.err)
                                        message.channel.send(res)
                                })
                            })
                        })
                    }catch(e){
                        console.log(e)
                    }
                } 
                else {
                    res = "__" + def.word + "__, " + def.category + 
                        " : \r  `" + def.definition + "`" 

                    if(!def.err)
                        message.channel.send(res)
                }
            })
        }
        
    }
})

bot.login(conf.token)