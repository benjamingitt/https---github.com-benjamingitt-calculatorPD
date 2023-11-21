const express = require('express');
const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy; // Импорт BearerStrategy
const User = require('../models/User'); // Подключение модели пользователя

const router = express.Router();

passport.use(
  new BearerStrategy(async (token, done) => {
    try {
      const user = await User.findOne({ token });
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

router.get('/secure', passport.authenticate('bearer', { session: false }), (req, res) => {
  res.json({ message: 'Авторизация успешна' });
});

module.exports = router;
