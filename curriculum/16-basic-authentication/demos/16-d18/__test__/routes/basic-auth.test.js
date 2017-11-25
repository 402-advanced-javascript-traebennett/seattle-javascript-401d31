'use strict'

const faker = require('faker')
const mocks = require('../lib/mocks')
const User = require('../../model/user')
const superagent = require('superagent')
const server = require('../../lib/server')
require('jest')

describe('Testing basic auth routes', function() {
  beforeAll(server.start)
  afterAll(server.stop)

  this.mockUserData = {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    email: faker.internet.email()
  }

  describe('POST to /api/signup', function() {
    beforeAll(() => {
      return superagent.post(':4000/api/signup')
      .send(this.mockUserData)
      .then(res => this.res = res)
    })

    test('should respond with a token', () => {
      expect(res.text).toBeTruthy()
      expect(res.text.length > 1).toBeTruthy()
    })
    test('should return a status of 201', () => {
      expect(this.res.status).toBe(201)
    })
  })

  describe('GET to /api/signin', function() {
    beforeAll(() => {
      mocks.user.createOne()
      .then(userData => {
        this.tempUser = userData.user
        let encoded = new Buffer(`${this.tempUser.username}:${this.tempUser.password}`).toString('base64')

        return superagent.get(':4000/api/signin')
        .set('Authorization', `Basic ${encoded}`)
        .then(res => this.res = res)
      })
    })

    test('should return a token', () => {
      expect(this.res.text).toBeTruthy()
      expect(this.res.text.length > 1).toBeTruthy()
    })

    test('should return a status of 200', () => {
      expect(this.res.status).toBe(200)
    })
  })
})

