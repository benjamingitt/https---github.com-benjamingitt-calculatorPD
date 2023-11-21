const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

function generateToken(data) {
  const secretKey = process.env.SECRET_KEY;

  const token = jwt.sign(data, secretKey, { expiresIn: '1h' });
  return token;
}

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      let user = await User.findOne({ username, password });
      if (!user) {
        return done(null, false);
      }
      user.token = generateToken({ username });
      await user.save();

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  const token = req.user.token; // Генерация и сохранение токена для пользователя
  return res.json({ token });
});

module.exports = router;
