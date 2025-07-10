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

let token, postId, commentId;

before(async () => {
  // Register and login an admin user
  const email = uniqueEmail('commentuser');
  await request(app)
    .post('/api/users/register')
    .send({ name: 'Comment User', email, password: 'TestPassword123', role: 'admin' });
  const res = await request(app)
    .post('/api/users/login')
    .send({ email, password: 'TestPassword123' });
  token = res.body.accessToken;

  // Create a post to comment on
  const postRes = await request(app)
    .post('/api/posts/create')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Comment Test Post', description: 'For comment tests' });
  postId = postRes.body.post._id;
});

after(async () => {
  if (process.env.NODE_ENV === 'test') {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }
});

describe('Comment API', function () {
  it('should create a comment on a post', async function () {
    const res = await request(app)
      .post('/api/comments/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'This is a test comment',
        postId,
      });
    expect(res.statusCode).to.be.oneOf([201, 200]);
    expect(res.body).to.have.property('success', true);
    expect(res.body).to.have.property('comment');
    expect(res.body.comment).to.have.property('content', 'This is a test comment');
    commentId = res.body.comment._id;
  });

  it('should not create a comment without content', async function () {
    const res = await request(app)
      .post('/api/comments/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ postId });
    expect(res.statusCode).to.be.oneOf([400, 422, 500]);
    expect(res.body).to.have.property('success', false);
  });

  it('should not create a comment without postId', async function () {
    const res = await request(app)
      .post('/api/comments/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Missing postId' });
    expect(res.statusCode).to.be.oneOf([400, 422, 500]);
    expect(res.body).to.have.property('success', false);
  });
});
