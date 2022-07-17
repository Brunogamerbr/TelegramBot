module.exports = async(bot,author,ctx) => {
    
    function menu_1() {
        const button = {
            parse_mode: "html",
            reply_markup: JSON.stringify({
              inline_keyboard: [
                [{ text: "Criar SSH", callback_data: "addssh" }],
                [{ text: "Criar teste SSH", callback_data: "addteste" }],
                [{ text: "Relatorio SSH", callback_data: "check_user" }],
                [{ text: "Remover SSH", callback_data: "area_" }],
                [{ text: "Renovar SSH", callback_data: "remover" }],
                [{ text: "Sair do Menu", callback_data: "4" }],
              ],
            }),
            chat_id: ctx.chat.id,
            message_id: ctx.message_id,
            parse_mode: "html"
          };
    
          let message_menu = `<b>Olá @${author}.</b>`
          bot.editMessageText(message_menu, button);
    }
    menu_1()

      bot.on("callback_query", async (callbackQuery) => {
        const action = callbackQuery.data;
        const msg = callbackQuery.message;
        
        if(action == "addssh") {
            const opts = {
            chat_id: msg.chat.id,
            message_id: msg.message_id,
            parse_mode: "html"
        }
        bot.editMessageText("👀", opts);
      }
    });
}