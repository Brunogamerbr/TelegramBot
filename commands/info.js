const cpuStat = require("cpu-stat");
const config = require("../config.json");
module.exports = async(msg,bot,ms) => {
cpuStat.usagePercent(async function(err, percent, seconds) {

  if(msg.chat.id != config.usuario_id) return;
  let key_db = await bot.db.get('Validade');
  if(!key_db) {
    bot.sendMessage(msg.chat.id, `Essa licença ja expirou.`);
    return;
  }
  
     let key_pt = {
       chat_id: msg.chat.id,
        message_id: msg.message_id,
        parse_mode: "html",
     }
   
   let quandocomprou = key_db.up;
   let restante = 2.592e+9- (Date.now() - quandocomprou);
   let temp = ms.formatTimer(restante);
   
   let msg_key;
   msgkey = "<b>🔍 INFORMAÇÕES DÁ LICENÇA</b>\n\n"
   msgkey+=`<b>Essa licença irá expirar em:</b>\n<b>${temp.days}</b> Dias \n<b>${temp.hours}</b> Horas \n<b>${temp.minutes}</b> Minutos\n\n`
   msgkey+= `<b>💻 INFORMAÇÕES DE CPU E RAM</b>\n\n`
   msgkey+= `<b>RAM</b> usada pelo bot: <b>${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB</b>\n`
   msgkey+= `<b>CPU</b> usada pelo bo: <b>${percent.toFixed(2)}%</b>`
   
   if(restante > 0) {
   bot.sendMessage(msg.chat.id, msgkey, key_pt)
   return;
   } else {
   bot.sendMessage(msg.chat.id, 'Essa licença já expirou')
   }
})
};