
const config = require("../config.json");
module.exports = async(bot,msg,button_login,author,PixApi) => {
    PixApi.CriarFatura(`${config.valor_1}`).then(async (res) => {

      const opts= {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
        parse_mode: "html"
      }

        let groupmsg = "<b>🛒 LINK DE PAGAMENTO GERADO 🛒</b>\n\n";
        groupmsg += `<b>👤 GERADO POR:</b> @${author}\n`;
        groupmsg += `<b>🛍️ PRODUTO:</b> ${button_login}\n\n`;
        groupmsg += `<b>📬 ID DA COMPRA:</b> ${res.id}`;
        text = `<b>✅ Copie o codigo e pague usando o copia e cola do seu banco:</b>\n\n<code>${res.codigo}</code>\n\n<b>📌 Você receberá seu acesso automáticamente após realizar o pagamento.</b>\n\n<b>📬 FATURA: #${res.id}</b>`;
        bot.db.delete(`Start/${msg.chat.id}`)
        bot.editMessageText(text, opts);
        bot.sendMessage(config.grupo_id, groupmsg, opts);
        bot.removeListener("callback_query");

        bot.db.set(`Compras/${res.id}`,{
          chat: msg.chat.id,
          compra_id: res.id,
          pago: "Não",
          usuario: author,
          login: 1,
		      msg_id: msg.message_id
        });
      });
}