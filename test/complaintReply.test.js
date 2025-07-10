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

describe('Complaint Reply API', function () {
  this.timeout(10000);
  let token;
  let complaintId;
  let replyId;
  let userEmail = uniqueEmail('complaintreplyuser');

  before(async function () {
    // Register and login a user
    await request(app)
      .post('/api/users/register')
      .send({ name: 'Complaint Reply User', email: userEmail, password: 'TestPassword123', role:"admin" });
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: userEmail, password: 'TestPassword123' });
    token = res.body.accessToken;

    // Raise a complaint to reply to
    const complaintRes = await request(app)
      .post('/api/complaints/raise')
      .set('Authorization', `Bearer ${token}`)
      .send({
        orderId: 'ORDER456',
        productType: 'Books',
        description: 'Pages missing in the book',
      });
    complaintId = complaintRes.body.complaint._id;
  });

  after(async () => {
    if (process.env.NODE_ENV === 'test') {
      await mongoose.connection.dropDatabase();
      await mongoose.disconnect();
    }
  });

  it('should create a reply for a complaint', async function () {
    const res = await request(app)
      .post('/api/complaint-replies')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'We are sorry for the inconvenience. We will send a replacement.',
        complaintId,
      });
    expect(res.statusCode).to.be.oneOf([201, 200]);
    expect(res.body).to.have.property('success', true);
    expect(res.body).to.have.property('reply');
    expect(res.body.reply).to.have.property('content');
    expect(res.body.reply).to.have.property('complaint');
    replyId = res.body.reply._id;
  });

  it('should not create a reply with missing fields', async function () {
    const res = await request(app)
      .post('/api/complaint-replies')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Missing complaintId' });
    expect(res.statusCode).to.be.oneOf([400, 422]);
    expect(res.body).to.have.property('success', false);
  });
});
