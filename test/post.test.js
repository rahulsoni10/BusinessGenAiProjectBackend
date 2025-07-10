import request from 'supertest';
import app from '../app.js';
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';

// Helper to generate unique emails
function uniqueEmail(prefix = 'user') {
  return `${prefix}${Date.now()}@example.com`;
}

describe('Post API', function () {
  let token;
  let postId;
  let userEmail = uniqueEmail('postadmin');

  before(async function () {
    // Register and login an admin user to get a token
    await request(app)
      .post('/api/users/register')
      .send({ name: 'Post Admin', email: userEmail, password: 'TestPassword123', role: 'admin' });
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: userEmail, password: 'TestPassword123' });
    token = res.body.accessToken;
  });

  it('should create a new post', async function () {
    const res = await request(app)
      .post('/api/posts/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Post',
        description: 'This is a test post',
      });
    expect(res.statusCode).to.be.oneOf([201, 200]);
    expect(res.body).to.have.property('success', true);
    expect(res.body).to.have.property('post');
    postId = res.body.post._id;
  });

  it('should create a new post with an image', async function () {
    // Use a sample image from uploads or fallback to a static image
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const files = fs.existsSync(uploadsDir) ? fs.readdirSync(uploadsDir) : [];
    const imagePath = files.length > 0 ? path.join(uploadsDir, files[0]) : path.join(process.cwd(), 'sample.png');
    const res = await request(app)
      .post('/api/posts/create')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Test Post With Image')
      .field('description', 'This is a test post with image')
      .attach('image', imagePath);
    expect(res.statusCode).to.be.oneOf([201, 200]);
    expect(res.body).to.have.property('success', true);
    expect(res.body).to.have.property('post');
    expect(res.body.post).to.have.property('image');
  });

  it('should get all posts', async function () {
    const res = await request(app)
      .get('/api/posts/')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('success', true);
    expect(res.body).to.have.property('posts');
    expect(res.body.posts).to.be.an('array');
  });

  it('should get a post by ID', async function () {
    const res = await request(app)
      .get(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('success', true);
    expect(res.body).to.have.property('post');
    expect(res.body.post).to.have.property('_id', postId);
  });

  it('should like a post', async function () {
    const res = await request(app)
      .put(`/api/posts/${postId}/like`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('success', true);
    expect(res.body).to.have.property('liked');
    expect(res.body).to.have.property('likes');
  });

  it('should update a post', async function () {
    const res = await request(app)
      .put(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Title', description: 'Updated description' });
    expect(res.statusCode).to.be.oneOf([200, 201]);
    expect(res.body).to.have.property('success', true);
    expect(res.body).to.have.property('post');
    expect(res.body.post).to.have.property('title', 'Updated Title');
  });

  it('should delete a post', async function () {
    const res = await request(app)
      .delete(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('success', true);
    expect(res.body).to.have.property('message');
  });
});
