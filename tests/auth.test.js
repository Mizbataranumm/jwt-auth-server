const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../index');

let mongoServer;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret';
  process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
  
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Auth Endpoints', () => {
  let accessToken;
  let refreshToken;
  const testUser = {
    email: 'test@example.com',
    password: 'password123'
  };

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send(testUser);
      
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    expect(res.body.user.email).toEqual(testUser.email);
  });

  it('should login an existing user', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send(testUser);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it('should get user profile with access token', async () => {
    const res = await request(app)
      .get('/auth/profile')
      .set('Authorization', `Bearer ${accessToken}`);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.user.email).toEqual(testUser.email);
  });

  it('should refresh token using refresh token', async () => {
    const res = await request(app)
      .post('/auth/refresh-token')
      .send({ refreshToken });
      
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
  });

  it('should logout user', async () => {
    const res = await request(app)
      .post('/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ refreshToken });
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Logout successful');
  });
});
