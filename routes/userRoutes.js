const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Подключение модели пользователя

// Роут для создания нового пользователя
router.post('/create', async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь уже существует' });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    return res.status(201).json({ message: 'Пользователь успешно создан' });
  } catch (error) {
    return res.status(500).json({ message: 'Что-то пошло не так', error: error.message }); // Возвращаем подробное сообщение об ошибке
  }
});

module.exports = router;
