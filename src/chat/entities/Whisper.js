const Whisper = (whisperText, to, user) => ({
  whisperId: user.userId + (new Date).getTime().toString(),
  whisperText,
  to,
  user
});

module.exports = Whisper;