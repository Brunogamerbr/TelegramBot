module.exports = async (bot, msg, database) => {
  const opts = { parse_mode: 'html' }
  let db = await bot.db.get(`Start/${msg.chat.id}`)
  
  if(db == null){ 
    bot.sendMessage(msg.chat.id, '<b>❌ Você ainda não possui um menu aberto, abra um clicando em /start</b>', opts);
  } else {
    
    bot.sendMessage(msg.chat.id, '<b>✅ Atendimento finalizado, abra outro com /start</b>', opts);
    await bot.db.delete(`Start/${msg.chat.id}/start`);
    bot.removeListener("callback_query");
  }
}