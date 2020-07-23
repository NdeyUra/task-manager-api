const express = require('express');
const Tasks = require('../models/tasks');
const router = new express.Router();
const auth = require('../middleware/auth');

router.post('/task', auth, async(req, res) => {
    //    const task = new Tasks(req.body);
    const task = new Tasks({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
    //  task.save().then(() => {
    //      res.status(201).send(task);
    //  }).catch((e) => {
    //      res.status(400).send(e);
    //  })
})

router.get('/task', auth, async(req, res) => {
    const sort = {};
    const parts = req.query.sortBy.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;

    try {
        if (req.query.completed) {
            completed = req.query.completed === "true";
            const task = await Tasks.find({ owner: req.user._id, completed }, null, { sort }).limit(parseInt(req.query.limit)).skip(parseInt(req.query.skip));
            res.send(task);
        } else {
            const task = await Tasks.find({ owner: req.user._id }, null, { sort }).limit(parseInt(req.query.limit)).skip(parseInt(req.query.skip));
            res.send(task);
        }
    } catch (e) {
        res.status(500).send(e);
    }
    // Tasks.find({}).then((task) => {
    //      res.send(task);
    //  }).catch((e) => {
    //      res.status(500).send(e);
    //  })
})

router.get('/task/:id', auth, async(req, res) => {
    const _id = req.params.id;
    try {
        //const task = await Tasks.findById(_id);
        const task = await Tasks.findOne({ _id: req.params.id, owner: req.user })
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send();
    }
    //  Tasks.findById(_id).then((task) => {
    //      if (!task) {
    //          return res.status(404).send();
    //      }
    //      res.send(task);
    //  }).catch((e) => {
    //      res.status(500).send();
    //  })
})
router.patch('/task/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdate = ['description', 'completed'];
    const isValidoperation = updates.every((up) => allowedUpdate.includes(up));
    if (!isValidoperation) {
        return res.status(406).send({ error: 'Invalid update' });
    }
    try {
        //const update = await Tasks.findById(req.params.id);
        const update = await Tasks.findOne({ _id: req.params.id, owner: req.user._id });
        //const update = await Tasks.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!update) {
            return res.status(404).send();
        }
        updates.forEach((up) => update[up] = req.body[up]);
        await update.save();
        res.send(update);
    } catch (e) {
        res.status(400).send(e);
    }
})
router.delete('/task/:id', auth, async(req, res) => {
    try {
        //const task = await Tasks.findByIdAndDelete(req.params.id);
        const task = await Tasks.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(400).send();
    }
})
module.exports = router;