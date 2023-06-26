const TelegramBot = require('node-telegram-bot-api');
const Agent = require('socks5-https-client/lib/Agent');
const axios = require('axios');
require('dotenv').config();

const TG_API = process.env.TELEGRAM_API_KEY;
const YA_API = process.env.YANDEX_API_KEY;

const bot = new TelegramBot(TG_API, { polling: true });

// bot.onText(/\/echo (.+)/, (msg, match) => {
//   const chatId = msg.chat.id;
//   const resp = match[1];

//   bot.sendMessage(chatId, resp);
// });

// bot.on('message', (msg) => {
//   // const chatId = msg.chat.id;

//   // bot.sendMessage(chatId, 'Received your message');
//   console.log(msg);
// });

bot.on('voice', (msg) => {
  const stream = bot.getFileStream(msg.voice.file_id);

  let chunks = [];
  stream.on('data', (chunk) => chunks.push(chunk));
  stream.on('end', () => {
    const axiosConfig = {
      method: 'POST',
      url: 'https://stt.api.cloud.yandex.net/speech/v1/stt:recognize',
      headers: {
        Authorization: 'Api-key ' + YA_API,
      },
      data: Buffer.concat(chunks),
    };

    axios(axiosConfig)
      .then((res) => {
        const command = res.data.result;

        console.log(msg.from.username, command);

        bot.sendMessage(msg.chat.id, command);
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
