const fetch = require("node-fetch");
const config = require("../config.json");
module.exports = async(action,msg,bot) => {
  
  let url = `http://${config.server_ip}:5000/check/${action}`
  let settings = { method: "Get" };
  
  let check_opts = {
  chat_id: msg.chat.id,
  message_id: msg.message_id,
  parse_mode: 'html'
}
  
fetch(url, settings).then(res => res.json()).then((json) => {
if (json.time_online == null) json.time_online = "Offline"
let message;
message=`<b>🔎 INFORMAÇÕES DO LOGIN</b>\n\n`
message+=`<b>👤 LOGIN:</b> ${json.username}\n`
message+=`<b>📅 VALIDADE:</b> ${json.expiration_date}\n`
message+=`<b>🚀 CONEXÕES:</b> ${json.count_connection}/1\n`
message+=`<b>⏰RESTAM:</b> ${json.expiration_days} Dias\n`
message+=`<b>🟢 TEMPO ONLINE:</b> ${json.time_online}`
bot.editMessageText(message, check_opts);
bot.db.delete(`Start/${msg.chat.id}/start`)
});
}
