const User = require('../models/user')
const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})

//get user profile
router.get('/users/me', auth, async (req, res) => {

    res.send(req.user)
})

//update user
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allwedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allwedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'unknown properties' })
    }

    try {
        console.log(req.user)
        const user = req.user
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()

        res.send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

//create user
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

//login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        return res.status(404).send({ error })
    }
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch (error) {
        res.status(400).send()
    }
})

//upload profile pic
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    try {
        const bufffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
        req.user.avatar = bufffer
        await req.user.save()
        res.status(200).send()
    } catch (error) {
        res.status(400).send(error)
    }
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

//delete avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    req.user.save()

    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

//logout currunt session
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send({ error: "error happened" })
    }
})

//logout all sessions
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send({ error: "something went wrong" })
    }
})

//Delete User
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)

    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router