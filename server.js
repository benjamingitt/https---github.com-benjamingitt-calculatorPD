const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const connectDB = require('./db'); // Подключение к базе данных
const authRoutes = require('./routes/authRoutes');
const secureRoutes = require('./routes/secureRoutes');
const userRoutes = require('./routes/userRoutes');
const calculatorRoutes = require('./routes/calculatorRoutes');

require('dotenv').config();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

connectDB(); // Запуск подключения к MongoDB

app.use('/auth', authRoutes);
app.use('/api', secureRoutes, calculatorRoutes);
app.use('/users', userRoutes);

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
module.exports = app;
