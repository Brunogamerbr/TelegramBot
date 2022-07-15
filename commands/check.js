module.exports = async (msg, bot, action) => {

  const opt = {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
    parse_mode: "html"
  };

  let db = await bot.db.get(`CheckUser`);
  if (db == null || !db) {
    bot.editMessageText("<b>❌ Você aínda não possui nenhum login, então não será possível executar essa ação.</b>",opt);
    bot.db.delete(`Start/${msg.chat.id}/start`);
    return;
  }
  
  db = db || {};
  let names = [];
  
  for(let key in db) {
    let obj = db[key];
    if(obj.chat_id == msg.chat.id) {
      obj.key = key;
      names.push(obj);
    }
  }

  
  const buttons_check = [];
  names.forEach((name) => {
    buttons_check.push([
      {
        text: name.login,
        callback_data: name.key,
      },
    ]);
  });

  const options_check = {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
    parse_mode: "html",
    reply_markup: JSON.stringify({
      inline_keyboard: buttons_check,
    }),
  };

  let msgck = "<b>Escolha algum dos seus logins para checar a validade:</b>";
  bot.editMessageText(msgck, options_check);
};