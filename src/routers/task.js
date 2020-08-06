const Task = require('../models/task')
const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')

//Get all tasks
router.get('/tasks', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ owner: req.user._id })
        res.status(200).send(tasks)
    } catch (error) {
        res.status(400).send(error)
    }
})

//get task by id
router.get('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            return res.status(400).send({ error: "not found" })
        }

        res.status(200).send(task)
    } catch (error) {
        res.status(400).json({ 'message': 'task not found' })
    }
})

//create task
router.post('/tasks', auth, async (req, res) => {

    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(200).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

//update task
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: "unknown properties" })
    }

    try {

        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)

    } catch (error) {
        return res.status(400).send({ error: "Error happened" })

    }
})

//delete task by id
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            return res.status(400).send({ error: "Task not found" })
        }
        res.status(200).send(task)

    } catch (error) {
        res.status(400).send({ error: "Error happened" })

    }
})

module.exports = router