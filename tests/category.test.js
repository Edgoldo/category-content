const request = require('supertest');
const mongoose = require("mongoose");

const app = require('../dist/server');
const { Category } = require('../dist/models/Category');

describe('Categories API', () => {
  afterEach(async () => {
    await mongoose.connection.close();
  });

  describe('GET api/categories/', () => {
    it('should return a list of categories', async () => {
      // Consulta
      const response = await request(app).get('/api/categories/summary');

      // Verificación
      expect(response.status).toBe(200);
    });
  });
});
