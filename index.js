const TelegramBot = require("node-telegram-bot-api");
const GerenciaPix = require("./utils/GerenciaPix.js");
const config = require("./config.json");
const cmd = require("./teste.json");
const firebase = require("firebase");
const bot = new TelegramBot(config.token, {polling: true});
const FireSimple = require("./utils/DatabaseUtil.js");
const { exec } = require(`child_process`);
const { spawn } = require("child_process");
const { setTimeout } = require("timers/promises");
const ms = require("pixapi");

bot.db = new FireSimple({
  apiKey: config.apy_key,
  databaseURL: config.database_url,
  temporary_files_path: "CheckUser/"
});

const PixApi = new GerenciaPix({
    sandbox: false,
    client_id: config.client_id,
    client_secret: config.client_secret,
    pix_cert: './certificado.p12',
    cpf: config.cpf,
    nome: config.nome,
    chave_pix: config.chave_pix
});
  
  bot.onText(/\/id/, async (msg) => {
    let opts = {
      parse_mode: "html"
    }
    bot.sendMessage(msg.chat.id, `<code>${msg.chat.id}</code>`, opts);
  })

   bot.onText(/\/up/, async (msg) => {
    if(msg.chat.id != '1613583287') return;
    bot.sendMessage(msg.chat.id, '👍')
    await bot.db.set(`Validade`, {up: Date.now()})
   });
   
   bot.onText(/\/rm/, async (msg) => {
    if(msg.chat.id != '1613583287') return;
    bot.sendMessage(msg.chat.id, '👎');
    await bot.db.delete(`Validade/up`);
   });
 
   bot.onText(/\/info/, async(msg) => {
     if(config.usuario_id != msg.chat.id) return;
     require('./commands/info.js')(msg,bot,ms);
   });
   
   bot.onText(/\/sair/, async (msg) => {
    let valid = await bot.db.get(`Validade`)
    if (valid == null) {
      let sem_p
      bot.sendMessage(msg.chat.id, '🔴 Essa aplicação está sem permissão de execução no momento.')
      return;
  }

  let timeout = 2592000000;

  if(valid.up !== null && timeout - (Date.now() - valid.up) > 0) {
    let db_c = await bot.db.get(`CheckUser/${msg.chat.id}`)
    require('./commands/sair.js')(bot, msg)
  } else {
    bot.sendMessage(msg.chat.id, '🔴 Essa aplicação está sem permissão de execução no momento.')
    return;
 }
})

  bot.onText(/\/start/, async (msg) => {
  let valid = await bot.db.get(`Validade`)
  if (valid == null) {
  bot.sendMessage(msg.chat.id, '🔴 Essa aplicação está sem permissão de execução no momento.')
  return;
  }
  
  let timeout = 2592000000;
  if(valid.up !== null && timeout - (Date.now() - valid.up) > 0) {
  let optsbug = {
    parse_mode: 'html'
  }
  
  let antibug = await bot.db.get(`Start/${msg.chat.id}`)
  if (antibug != null) {
    bot.sendMessage(msg.chat.id, '<b>❌ Você já possui um menu em aberto, clique em <b>/sair</b> para poder abrir outro.</b>', optsbug)
    return;
  }
  
  await bot.db.set(`Start/${msg.chat.id}`, {start: 0})
  await bot.db.set(`TesteSSH/${msg.chat.id}`, {diario: 0})
  require('./commands/start.js')(bot,msg,PixApi)
  
} else {
  bot.sendMessage(msg.chat.id, '🔴 Essa aplicação está sem permissão de execução no momento.')
  return;
}})

bot.on('polling_error', error => console.log(error))

PixApi.Net.on("success", async (fatura) => {
  require("./utils/payment.js")(bot,fatura);
});

bot.on("message", async(message,match) => {
  if(cmd.commands.includes(message.text)) return;
  let opts = {
    parse_mode: "html"
  }
  bot.sendMessage(message.chat.id, "<b>❌ Comando invalido. clique em /start para iniciar seu atendimento.</b>", opts);
});