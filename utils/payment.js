const config = require("../config.json");
const ms = require("pixapi");
const { exec } = require("child_process");
const { spawn } = require("child_process");
const { setTimeout } = require("timers/promises");
module.exports = async(bot,fatura) => {
	
	const dbref2 = await bot.db.get(`Compras/${fatura.id}`);
	
	  const opts = {
      chat_id: dbref2.chat,
      message_id: dbref2.chat,
      parse_mode: 'html'
    };
  
    const s = ms.randomNumber(1000, 10000)
    const user = `compra${s}`
    const child = spawn("bash create_login/user.sh", ["create_login/user.sh"], {
    shell: true,
    env: {
    SENHA: s,
    LOGIN: user,
    LIMITE: dbref2.login
    },
    });
    child.stdout.pipe(process.stdout);
  
      const button_pago = {
        chat_id: dbref2.chat,
        message_id: dbref2.msg_id,
        parse_mode: 'html',
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [{ text: '🔰 Dowload Aplicativo 🔰', url: config.dowload }],
            [{ text: '☎️ Suporte ao Cliente', url: config.url_suporte }],
          ]
        })
      };
  
    let msg_pago = "<b>✅ PAGAMENTO RECEBIDO !</b>\n\n" 
    msg_pago+=`<b>USUARIO:</b> <code>${user}</code>\n`
    msg_pago+=`<b>SENHA:</b> <code>${s}</code>\n`
    msg_pago+=`<b>LIMITE:</b> ${dbref2.login}\n`
    msg_pago+=`<b>EXPIRA EM:</b> 30 Dias\n\n`
    msg_pago+=`OBRIGADOª POR CONTRIBUIR COM O PROJETO 😉\n\n`
    msg_pago+="Baixe o aplicativo para conexão ou tenha suporte clicando nos botões abaixo:"
  
    let pagomsg = "<b>✅ PAGAMENTO RECEBIDO</b>\n\n"
    pagomsg+=`<b>👤 COMPRA:</b> @${dbref2.usuario}\n`
    pagomsg+=`<b>👀 LOGIN:</b> ${user}\n`
    pagomsg+= `<b>🔒 LIMITE:</b> ${dbref2.login}\n\n`
    pagomsg+=`<b>📬 COMPRA ID: ${dbref2.compra_id}</b>`
  
    bot.sendMessage(config.grupo_id,pagomsg, opts);
    bot.editMessageText(msg_pago, button_pago);
    bot.db.set(`Compras/${dbref2.compra_id}`, {pago: 'Sim'})
    await bot.db.delete(`Start/${dbref2.chat}/start`);
    
    await bot.db.addTemp({time: (2.592e+6)}, {
      chat_id: dbref2.chat,
      login: user
    })
	} 