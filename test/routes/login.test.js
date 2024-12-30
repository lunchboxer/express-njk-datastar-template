import assert from 'node:assert/strict'
import test from 'node:test'
import request from 'supertest'
import { app } from '../../src/app.js'

const newLocal = /Username and password are required/
const newLocal1 = /Invalid credentials/

test('Login functionality', async t => {
  await t.test('Requires username and password', async () => {
    const response = await request(app).post('/auth/login').send({}) // Empty body

    assert.strictEqual(response.status, 200, 'Should render login page')
    assert.match(response.text, newLocal, 'Should show error message')
  })

  await t.test('Rejects invalid credentials', async () => {
    const response = await request(app).post('/auth/login').send({
      username: 'nonexistent',
      password: 'wrongpassword',
    })

    assert.strictEqual(response.status, 200, 'Should render login page')
    assert.match(
      response.text,
      newLocal1,
      'Should show invalid credentials error',
    )
  })

  // Note: This test requires a known valid user in your test database
  await t.test('Successful login redirects', async () => {
    const response = await request(app).post('/auth/login').send({
      username: 'testuser',
      password: 'correctpassword',
    })

    assert.strictEqual(
      response.status,
      302,
      'Should redirect after successful login',
    )
    assert.ok(
      response.headers['set-cookie'],
      'Should set authentication cookie',
    )
  })
})
