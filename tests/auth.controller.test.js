const httpStatus = require('http-status-codes');
const request = require('supertest');
const app = require('../src/app');
const Token = require('../src/models/token');
const util = require('../src/utils/index');

// mock utility functions
jest.mock('../src/utils/index');

describe('Auth Controller', () => {
  const userLogin = {
    email: 'ogunfusika64@gmail.com',
    password: '12345678'
  };
  let newUser = {
    firstName: 'John',
    lastName: 'Wick',
    role: 'landowner'
  };
  beforeEach(() => jest.clearAllMocks());
  // tests
  it(`Register - fresh user: should return ${httpStatus.CREATED} and confirmation for valid input`, async () => {
    newUser = { ...userLogin, ...newUser };
    const res = await request(app).post('/api/auth/register').send(newUser).expect(httpStatus.CREATED);

    expect(res.body.canLogin).toBeDefined();
    // email sending should be called once at most
    expect(util.sendEmail).toBeCalledTimes(1);

    newUser.id = res.body.id;
  });
  it(`Register - existing user: should return ${httpStatus.CONFLICT} and confirmation for valid input`, async () => {
    newUser = { ...userLogin, ...newUser };

    await request(app).post('/api/auth/register').send(newUser).expect(httpStatus.CONFLICT);
    // email sending should never be called!
    expect(util.sendEmail).toBeCalledTimes(0);
  });
  it(`Login: Should return ${httpStatus.UNAUTHORIZED} for unconfirmed email`, async () => {
    await request(app).post('/api/auth/login').send(userLogin).expect(httpStatus.UNAUTHORIZED);
  });

  it(`VerifyEmail: Should return ${httpStatus.BAD_REQUEST} for incorrect token`, async () => {
    await request(app).get('/api/auth/verify/12345').expect(httpStatus.BAD_REQUEST);
  });

  it(`VerifyEmail: Should return ${httpStatus.OK} for correct token`, async () => {
    const { token } = await Token.findOne({ userId: newUser.id });
    await request(app).get(`/api/auth/verify/${token}`).expect(httpStatus.OK);
  });

  it(`Login: Should return ${httpStatus.OK} confirmed email`, async () => {
    const res = await request(app).post('/api/auth/login').send(userLogin).expect(httpStatus.OK);
    expect(res.body.accessToken).toBeDefined();
  });
});
