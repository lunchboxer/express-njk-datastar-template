import assert from 'node:assert/strict'
import test from 'node:test'
import request from 'supertest'
import { app } from '../../src/app.js'

const newLocal = /doctype html/i

test('Root route tests', async t => {
  await t.test('Returns 200 status', async () => {
    const response = await request(app).get('/')
    assert.strictEqual(
      response.status,
      200,
      'Root route should return 200 status',
    )
  })

  await t.test('Returns HTML content type', async () => {
    const response = await request(app).get('/')
    assert.strictEqual(
      response.headers['content-type'],
      'text/html; charset=utf-8',
      'Should return HTML content',
    )
  })

  await t.test('Contains valid HTML', async () => {
    const response = await request(app).get('/')
    assert.match(response.text, newLocal, 'Should contain valid html message')
  })
})
