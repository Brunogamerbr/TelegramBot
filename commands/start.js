const GerenciaPix = require("../utils/GerenciaPix.js");
const ms = require("pixapi");
const { exec } = require(`child_process`);
const { spawn } = require("child_process");
const { setTimeout } = require("timers/promises");
const config = require("../config.json");
module.exports = async (bot,msg,PixApi) => {
  
  const author = msg.from.username;
  const button_login = "ACESSO VPN";

  function menu() {
    const button_1 = {
      parse_mode: "html",
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: "Comprar acesso VPN", callback_data: "1" }],
          [{ text: "Criar teste Gratis", callback_data: "2" }],
          [{ text: "Checar Validade", callback_data: "check" }],
          [{ text: "Area do Revendedor", callback_data: "area_" }],
          [{ text: "Suporte ao Cliente", url: config.url_suporte}],
          [{ text: "Sair do Menu", callback_data: "4" }],
        ],
      }),
    };
  
    const msg_1 = `<b>BEM VINDOª COMO POSSO TE AJUDAR?</b>`
    bot.sendMessage(msg.chat.id, msg_1, button_1);
  } 
  menu()
  
    bot.on("callback_query", async (callbackQuery) => {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;
    
    const opts_geral = {
      chat_id: msg.chat.id,
      message_id: msg.message_id,
      parse_mode: "html"
    }

    const button_2 = {
      reply_markup: JSON.stringify({
         inline_keyboard: [
           [{ text: "1 Acesso 30 Dias", callback_data: "1_" }],
           [{ text: "2 Acessos 30 Dias", callback_data: "2_" }],
           [{ text: "3 Acessos 30 Dias", callback_data: "3_" }],
           [{ text: "Voltar ao Menu", callback_data: "4_" }],
         ],
       }),
      chat_id: msg.chat.id,
      message_id: msg.message_id,
      parse_mode: "html"
     };

    if(action == "1") {
      let msg_2 = "<b>ESCOLHA ALGUM DOS PLANOS ABAIXO:</b>"
      bot.editMessageText(msg_2,button_2);
    }

    if(action == "1_") {
    let msg_button = "<b>📌 DETALHES DA COMPRA 📌</b>\n\n";
    msg_button += `<b>🛍️ PRODUTO:</b> ${button_login}\n`;
    msg_button += `<b>💰 PREÇO:</b> ${config.valor_1}\n`;
    msg_button += `<b>🔒 LIMITE:</b> 1\n`;
    msg_button += `<b>📅 VALIDADE:</b> 30 Dias\n\n`;
    msg_button += `<b>Deseja continuar a compra?</b>`;


    const opts_button = {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: "Pagar com PIX", callback_data: "sim_1" }],
          [{ text: "Retornar", callback_data: "nao_1" }],
        ],
      }),
      chat_id: msg.chat.id,
      message_id: msg.message_id,
      parse_mode: "html",
    };
  bot.editMessageText(msg_button, opts_button)
}  
  
  if(action == "nao_1" || action == "nao_2" || action == "nao_3") {
  let msg_2 = "<b>ESCOLHA ALGUM DOS PLANOS ABAIXO:</b>"
  bot.editMessageText(msg_2, button_2);
}

  if(action == "2_") {
  let msg_button = "<b>📌 DETALHES DA COMPRA 📌</b>\n\n";
  msg_button += `<b>🛍️ PRODUTO:</b> ${button_login}\n`;
  msg_button += `<b>💰 PREÇO:</b> ${config.valor_2}\n`;
  msg_button += `<b>🔒 LIMITE:</b> 2\n`;
  msg_button += `<b>📅 VALIDADE:</b> 30 Dias\n\n`;
  msg_button += `<b>Deseja continuar a compra?</b>`;


  const opts_button = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: "Pagar com PIX", callback_data: "sim_2" }],
        [{ text: "Retornar", callback_data: "nao_2" }],
      ],
    }),
    chat_id: msg.chat.id,
    message_id: msg.message_id,
    parse_mode: "html",
  };
  bot.editMessageText(msg_button, opts_button)
}

  if(action == "3_") {
  let msg_button = "<b>📌 DETALHES DA COMPRA 📌</b>\n\n";
  msg_button += `<b>🛍️ PRODUTO:</b> ${button_login}\n`;
  msg_button += `<b>💰 PREÇO:</b> ${config.valor_3}\n`;
  msg_button += `<b>🔒 LIMITE:</b> 3\n`;
  msg_button += `<b>📅 VALIDADE:</b> 30 Dias\n\n`;
  msg_button += `<b>Deseja continuar a compra?</b>`;


  const opts_button = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: "Pagar com PIX", callback_data: "sim_3" }],
        [{ text: "Retornar", callback_data: "nao_3" }],
      ],
    }),
    chat_id: msg.chat.id,
    message_id: msg.message_id,
    parse_mode: "html",
  };
bot.editMessageText(msg_button, opts_button)
}

if(action == "sim_1") {
  require("../receiver/receiver_1")(bot,msg,button_login,author,PixApi)
}
if(action == "sim_2") {
  require("../receiver/receiver_2")(bot,msg,button_login,author,PixApi)
}
if(action == "sim_3") {
  require("../receiver/receiver_3")(bot,msg,button_login,author,PixApi)
}

if(action == "2") {
  require("../utils/GerarTeste.js")(bot,msg)
}

if(action == "4_") {
  bot.deleteMessage(msg.chat.id, msg.message_id)
  menu()
}

if(action == "area_") {
  let ctx = msg;
  require("../revenda/menu.js")(bot,author,ctx);
}

if(action == "4") {
  let op = {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
    parse_mode: "html"
}
      
bot.editMessageText("<b>✅ Atendimento automático finalizado.\nPara iniciar outro utilize /start</b>",op);
bot.db.delete(`Start/${msg.chat.id}/start`);
bot.removeListener("callback_query");
return;
}

if(action == "check") {
require("./check.js")(msg, bot, action);
return;
 }

let db = await bot.db.get(`CheckUser`);
db = db || {};

if(Object.keys(db).includes(action)) {
require("../utils/checkuser.js")(db[action].login,msg,bot);
return;
}
})
}