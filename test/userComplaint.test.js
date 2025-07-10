import request from 'supertest';
import app from '../app.js';
import { expect } from 'chai';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config();
}

function uniqueEmail(prefix = 'user') {
  return `${prefix}${Date.now()}@example.com`;
}

describe('User Complaint API', function () {
  this.timeout(10000); // Increase timeout for DB operations
  let token;
  let complaintId;
  let userEmail = uniqueEmail('complaintuser');

  before(async function () {
    // Register and login a user to get a token
    await request(app)
      .post('/api/users/register')
      .send({ name: 'Complaint User', email: userEmail, password: 'TestPassword123' });
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: userEmail, password: 'TestPassword123' });
    token = res.body.accessToken;
  });

  after(async () => {
    if (process.env.NODE_ENV === 'test') {
      await mongoose.connection.dropDatabase();
      await mongoose.disconnect();
    }
  });

  it('should raise a new complaint', async function () {
    const res = await request(app)
      .post('/api/complaints/raise')
      .set('Authorization', `Bearer ${token}`)
      .send({
        orderId: 'ORDER123',
        productType: 'Electronics',
        description: 'Received a damaged product',
      });
    expect(res.statusCode).to.be.oneOf([201, 200]);
    expect(res.body).to.have.property('message');
    expect(res.body).to.have.property('complaint');
    expect(res.body.complaint).to.have.property('orderId', 'ORDER123');
    complaintId = res.body.complaint._id;
  });

  it('should not raise a complaint with missing fields', async function () {
    const res = await request(app)
      .post('/api/complaints/raise')
      .set('Authorization', `Bearer ${token}`)
      .send({ orderId: 'ORDER123', productType: 'Electronics' });
    expect(res.statusCode).to.be.oneOf([400, 422]);
    expect(res.body).to.have.property('error');
  });
});
