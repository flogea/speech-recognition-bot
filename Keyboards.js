module.exports = {
  getLangKb(_RU, _ENG, _BACK) {
    return {
      reply_markup: {
        keyboard: [[_RU, _ENG], [_BACK]],
        resize_keyboard: true,
      },
    };
  },

  getSpeedKb(_FAST, _NORMAL, _SLOW, _BACK) {
    return {
      reply_markup: {
        keyboard: [[_FAST, _NORMAL, _SLOW], [_BACK]],
        resize_keyboard: true,
      },
    };
  },

  getVoiceKb(_ALENA, _FILIPP, _ERMIL, _JANE, _MADIRUS, _OMAZH, _ZAHAR, _BACK) {
    return {
      reply_markup: {
        keyboard: [[_ALENA, _FILIPP, _ERMIL], [_JANE, _MADIRUS, _OMAZH, _ZAHAR], [_BACK]],
        resize_keyboard: true,
      },
    };
  },
};
