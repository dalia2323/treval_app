const request = require('supertest');
const app = require('../../server/server'); 
describe('Test /api/getCity endpoint', () => {
  test('It should respond with city data', async () => {
    const response = await request(app)
      .post('/api/getCity')
      .send({ city: 'Paris' })
      .expect(200);

    expect(response.body).toHaveProperty('name', 'Paris');
    expect(response.body).toHaveProperty('lat');
    expect(response.body).toHaveProperty('lng');
  });

  test('It should respond with error if city is missing', async () => {
    const response = await request(app)
      .post('/api/getCity')
      .send({})
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });
});