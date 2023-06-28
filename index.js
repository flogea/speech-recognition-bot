const TelegramBot = require('node-telegram-bot-api');
const Agent = require('socks5-https-client/lib/Agent');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const player = require('play-sound')();
require('dotenv').config();

const keyboard = require('./Keyboards');

const TG_API = process.env.TELEGRAM_API_KEY;
const YA_API = process.env.YANDEX_API_KEY;

const bot = new TelegramBot(TG_API, { polling: true });

const _LANGUAGE = '💬 Язык';
const _SPEED = '⏭ Скорость';
const _VOICE = '🔊 Голос';
const _BACK = { text: '◀️ Назад' };
const _RU = { text: 'Русский', data: 'ru-RU' };
const _ENG = { text: 'English', data: 'en-US' };
const _FAST = { text: '🏃🏼‍♂️ Быстро', data: '3.0' };
const _NORMAL = { text: '🚶🏼‍♂️ Умеренно', data: '1.0' };
const _SLOW = { text: '🐢 Медленно', data: '0.1' };

const _ALENA = { text: '👩🏼 Алена', data: 'alena' };
const _FILIPP = { text: '👱🏼 Филипп', data: 'filipp' };
const _ERMIL = { text: '👱🏼 Эрмиль', data: 'ermil' };
const _JANE = { text: '👩🏼 Женя', data: 'jane' };
const _MADIRUS = { text: '👱🏼 Мадирус', data: 'madirus' };
const _OMAZH = { text: '👩🏼 Омаж', data: 'omazh' };
const _ZAHAR = { text: '👱🏼 Захар', data: 'zahar' };

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

const state = {
  lang: 'ru-RU',
  speed: 1.0,
  format: 'mp3',
  voice: 'jane',
};

bot.onText(/\/settings/, (msg) => {
  const text = msg.text;

  console.log(msg);
  bot.sendMessage(msg.chat.id, 'Настройки', {
    reply_markup: {
      keyboard: [[_LANGUAGE, _SPEED, _VOICE]],
      resize_keyboard: true,
    },
  });
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendSticker(chatId, '');
  bot.sendMessage(chatId, '');
  bot.sendMessage(chatId, '');
});

bot.on('text', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  console.log(msg);

  switch (text) {
    case _LANGUAGE:
      bot.sendMessage(msg.chat.id, 'Выберите язык', keyboard.getLangKb(_RU, _ENG, _BACK));
      break;

    case _SPEED:
      bot.sendMessage(
        msg.chat.id,
        'Установите скорость',
        keyboard.getSpeedKb(_FAST, _NORMAL, _SLOW, _BACK),
      );
      break;

    case _VOICE:
      bot.sendMessage(
        msg.chat.id,
        'Выберите озвучку',
        keyboard.getVoiceKb(_ALENA, _FILIPP, _ERMIL, _JANE, _MADIRUS, _OMAZH, _ZAHAR, _BACK),
      );
      break;

    case _RU.text:
      state.lang = _RU.data;

      bot.sendMessage(msg.chat.id, 'Язык установлен');
      console.log(state);
      break;

    case _ENG.text:
      state.lang = _ENG.data;

      bot.sendMessage(msg.chat.id, 'Язык установлен');
      console.log(state);
      break;

    case _FAST.text:
      state.speed = _FAST.data;

      bot.sendMessage(msg.chat.id, 'Скорость установлена');
      console.log(state);
      break;

    case _NORMAL.text:
      state.speed = _NORMAL.data;

      bot.sendMessage(msg.chat.id, 'Скорость установлена');
      console.log(state);
      break;

    case _SLOW.text:
      state.speed = _SLOW.data;

      bot.sendMessage(msg.chat.id, 'Скорость установлена');
      console.log(state);
      break;

    case _ALENA.text:
      state.voice = _ALENA.data;

      bot.sendMessage(msg.chat.id, 'Голос установлен');
      console.log(state);
      break;

    case _FILIPP.text:
      state.voice = _FILIPP.data;

      bot.sendMessage(msg.chat.id, 'Голос установлен');
      console.log(state);
      break;

    case _ERMIL.text:
      state.voice = _ERMIL.data;

      bot.sendMessage(msg.chat.id, 'Голос установлен');
      console.log(state);
      break;

    case _JANE.text:
      state.voice = _JANE.data;

      bot.sendMessage(msg.chat.id, 'Голос установлен');
      console.log(state);
      break;

    case _MADIRUS.text:
      state.voice = _MADIRUS.data;

      bot.sendMessage(msg.chat.id, 'Голос установлен');
      console.log(state);
      break;

    case _OMAZH.text:
      state.voice = _OMAZH.data;

      bot.sendMessage(msg.chat.id, 'Голос установлен');
      console.log(state);
      break;

    case _ZAHAR.text:
      state.voice = _ZAHAR.data;

      bot.sendMessage(msg.chat.id, 'Голос установлен');
      console.log(state);
      break;

    case _BACK.text:
      bot.sendMessage(msg.chat.id, _BACK.text, {
        reply_markup: {
          keyboard: [[_LANGUAGE, _SPEED, _VOICE]],
          resize_keyboard: true,
        },
      });
      break;
  }
});

bot.on('text', (msg) => {
  const text = msg.text;
  const fileName = text.split(' ')[0];
  const filePath = `${fileName}.mp3`;

  const data = `${msg.from.username} -- ${text}\n`;

  fs.appendFile('usersData.txt', data, (err) => {
    if (err) throw err;
    console.log('Data has been written to file.txt');
  });

  synthesizeSpeech(text, state.lang, state.speed, state.format, state.voice)
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
