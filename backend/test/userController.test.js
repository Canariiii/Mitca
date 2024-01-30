const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server');
const User = require('../models/user');

beforeAll(async () => {
  await mongoose.createConnection('mongodb://127.0.0.1:27017/testDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('UserController', () => {
  it('User created', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        username: 'Jose',
        email: 'test@prueba.es',
        password: '8guhgy78678gy',
        phone: '123121212',
        role: 'student',
        filename: 'facets-1.png'
      });
      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toHaveProperty('username');
      expect(response.body.data.user.username).toBe('Jose');
  })
});

describe('UserController', () => {
  it('Error 500', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        username: 'Jose',
        email: 'test@prueba.es',
        password: '1234',
        phone: '123121212',
        role: 'instructor',
        filename: 'facets-1.png'
      });
    expect(response.statusCode).toBe(500);
    expect(response.body.success).toBe(false);
  })
});

describe('UserController', () => {
  it('All users', async () => {
    const response = await request(app)
      .get('/users');
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeInstanceOf(Array);
  });
});

