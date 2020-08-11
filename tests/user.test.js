const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Teddy',
        email: 'pereratdp@gmail.com',
        password: 'doo1234'
    }).expect(200)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Teddy',
            email: 'pereratdp@gmail.com'
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('doo1234')
})

test('Should validate user login token', async () => {
    const response = await request(app).post('/users/login').send({
        email: 'mike@example.com',
        password: 'doo123'
    }).expect(200)

    //Assert that the database wa changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should fail login with incorrect credentials', async () => {
    await request(app).post('/users/login').send({
        email: 'test@gmail.com',
        password: 'de324'
    }).expect(404)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get progile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete user', async () => {
    const response = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    //Asserting user has already been deleted
    const user = await User.findById(response.body._id)
    expect(user).toBeNull()
})

test('Should not delete user for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Tharindu Dharshana'
        }).expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toBe(response.body.name)
})

test('Should not update invalid user fields', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Melbourne'
        }).expect(400)
})