const User = require('../models/User');
const app = require('../server'); 
const request = require('supertest');
const expect = require('chai').expect;

before(function (done) {
  console.log('before all');
  this.timeout(9000);
  setTimeout(done, 5000);
});

const userData = {
  username: 'testuser1',
  password: 'password',
};
after(async function () {
  await User.findOneAndDelete(userData);
});

describe('Calculette Expression', () => {
  it('should calculate expression correctly', async () => {
    const expression = '8 9 + 1 7 - *';

    const res = await request(app).post('/api/calculator').send({ expression }).set('Accept', 'application/json');

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('result', -102); // Результат вычисления вашего выражения
  });

  it('should return error if expression is not provided', async () => {
    const res = await request(app).post('/api/calculator').set('Accept', 'application/json');

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error', 'Выражение не предоставлено');
  });
});

describe('User Creation', () => {
  it('should create a new user', async () => {
    const res = await request(app).post('/users/create').send(userData);

    expect(res.statusCode).to.equal(201);
    expect(res.body).to.have.property('message', 'Пользователь успешно создан');
  });

  it('should return error for duplicate user creation', async () => {
    const userData = {
      username: 'testuser1', // Предполагается, что пользователь с таким именем уже существует
      password: 'newPassword',
    };

    const res = await request(app).post('/users/create').send(userData);

    expect(res.statusCode).to.equal(400);
    expect(res.body).to.have.property('message', 'Пользователь уже существует');
  });
  it('should authenticate user and return a token', async () => {
    const res = await request(app).post('/auth/login').send(userData);

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('token');
  });
});

// Пример теста для проверки защищенного маршрута
describe('Secure Route', () => {
  it('should access secure route with valid token', async () => {
    const authRes = await request(app).post('/auth/login').send(userData);

    const token = authRes.body.token;

    const secureRes = await request(app).get('/api/secure').set('Authorization', `Bearer ${token}`);

    expect(secureRes.statusCode).to.equal(200);
    expect(secureRes.body).to.have.property('message', 'Авторизация успешна');
  });

  it('should not access secure route without token', async () => {
    const secureRes = await request(app).get('/api/secure');

    expect(secureRes.statusCode).to.equal(401);
  });

  it('should not access secure route with invalid token', async () => {
    const secureRes = await request(app).get('/api/secure').set('Authorization', 'Bearer invalidtoken');

    expect(secureRes.statusCode).to.equal(401);
  });
});
