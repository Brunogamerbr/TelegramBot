const ms = require("pixapi");
const { exec } = require(`child_process`);
const { spawn } = require("child_process");
const { setTimeout } = require("timers/promises");
const config = require("../config.json");
module.exports = async(bot,msg) => {
    let c = {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
        parse_mode: "html"
      };

      let testetempo = await bot.db.get(`TesteSSH/${msg.chat.id}`);
      let timeout = 86400000;
      
      if(testetempo.tempo !== null && timeout - (Date.now() - testetempo.tempo) > 0) {
       
        bot.editMessageText("❌ Você só pode criar 1 teste a cada 24 horas.", c);
        bot.db.delete(`Start/${msg.chat.id}/start`);
        return;
   
      } else {
        
        const senhateste = ms.randomNumber(1000, 10000);
        const userteste = `TESTE${senhateste}`;
        
        const child = spawn("bash create_login/teste.sh", ["create_login/teste.sh"], {
          shell: true,
          env: {
            SENHA: senhateste,
            LOGIN: userteste,
          },
        });

        child.stdout.pipe(process.stdout);
        let pt = {
        parse_mode: "Markdown",
        };
        
        const applink = {
          chat_id: msg.chat.id,
          message_id: msg.message_id,
          parse_mode: "html",
          reply_markup: JSON.stringify({
            inline_keyboard: [
              [{ text: "🔰 Dowload Aplicativo 🔰", url: config.dowload }],
            ],
          }),
        };
        
        let testemsg;
        testemsg = `<b>✅ CRIADO COM SUCESSO !</b>\n\n`;
        testemsg += `<b>USUÁRIO:</b> <code>${userteste}</code>\n`;
        testemsg += `<b>SENHA:</b> <code>${senhateste}</code>\n`;
        testemsg += "<b>LIMITE: 1</b>\n";
        testemsg += "<b>EXPIRA EM: 1hora</b>\n\n";
        testemsg +=
          "Faça o dowload do aplicativo para conexão clicando no botão abaixo:";

        bot.editMessageText(testemsg, applink);
        await bot.db.set(`TesteSSH/${msg.chat.id}`, { tempo: Date.now() });
        await bot.db.delete(`Start/${msg.chat.id}/start`);
      }
}