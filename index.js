const TelegramBot = require('node-telegram-bot-api');
const Agent = require('socks5-https-client/lib/Agent');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const player = require('play-sound')();
require('dotenv').config();

const TG_API = process.env.TELEGRAM_API_KEY;
const YA_API = process.env.YANDEX_API_KEY;

const bot = new TelegramBot(TG_API, { polling: true });

function synthesizeSpeech(text, lang, speed, format, voice) {
  const axiosConfig = {
    method: 'POST',
    url: 'https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize',
    data: { text, lang, speed, format },
    headers: {
      Authorization: 'Api-key ' + YA_API,
      'content-type': 'multipart/form-data',
    },
    responseType: 'arraybuffer',
  };

  return axios(axiosConfig)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

function removeFile(name) {
  return fs.unlinkSync(name, (err) => console.log(err));
}

const lang = 'ru-RU';
const speed = 1.0;
const format = 'mp3';
const voice = 'jane';

bot.on('message', (msg) => {
  const text = msg.text;
  const fileName = text.split(' ')[0];
  const filePath = `${fileName}.mp3`;

  const data = `${msg.from.username} -- ${text}\n`;

  fs.appendFile('usersData.txt', data, (err) => {
    if (err) throw err;
    console.log('Data has been written to file.txt');
  });

  synthesizeSpeech(text, lang, speed, format, voice)
    .then((audioData) => {
      fs.writeFileSync(filePath, audioData, 'binary');
      player.play(filePath);

      bot.sendAudio(msg.chat.id, filePath);

      setTimeout(() => {
        removeFile(`./${fileName}.mp3`);
      }, 5000);
    })
    .catch((error) => {
      console.error(error);
    });
});

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

        const data = `${msg.from.username} -- ${command}\n`;

        fs.appendFile('usersData.txt', data, (err) => {
          if (err) throw err;
          console.log('Data has been written to file.txt');
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
