const express = require('express');
const sharp = require('sharp');
const User = require('../models/user');
const router = new express.Router();
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account');
const auth = require('../middleware/auth');
const multer = require('multer');

router.post('/user', async(req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(406).send(e);
    }
    //  user.save().then(() => {
    //      res.status(201).send(user);
    //  }).catch((e) => {
    //      res.status(400).send(e);
    //  })
})
router.post('/user/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({
            user,
            token
        });
    } catch (e) {
        res.status(400).send();
    }
})
router.post('/user/logout', auth, async(req, res) => {

    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
})
router.post('/user/logoutall', auth, async(req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
})
router.get('/user/me', auth, async(req, res) => {
        res.send(req.user);
        // try {
        //     const user = await User.find({});
        //     res.send(user);
        // } catch (e) {
        //     res.status(500).send(e);
        // }
        //  User.find({}).then((users) => {
        //      res.send(users)
        //  }).catch((e) => {
        //      res.status(500).send(e);
        //  })
    })
    // router.get('/user/:id', async(req, res) => {
    //     const _id = req.params.id;
    //     try {
    //         const user = await User.findById(_id);
    //         if (!user) {
    //             return res.status(404).send();
    //         }
    //         res.send(user);
    //     } catch (e) {
    //         res.status(500).send()
    //     }
    //     //  User.findById(_id).then((user) => {
    //     //      if (!user) {
    //     //          return res.status(404).send();
    //     //      }
    //     //      res.send(user);
    //     //  }).catch((e) => {
    //     //      res.status(500).send();
    //     //  })
    //})
router.patch('/user/me', auth, async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdate = ['name', 'email', 'password', 'age'];
    const isValidoperation = updates.every((update) => allowedUpdate.includes(update));
    if (!isValidoperation) {
        return res.status(400).send({ error: 'Invalid Updates' });
    }
    try {
        //const update = await User.findById(req.use);
        updates.forEach((up) => req.user[up] = req.body[up]);
        await req.user.save();
        //const update = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        // if (!update) {
        //     return res.status(404).send();
        // }
        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }
})
router.delete('/user/me', auth, async(req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.params.id);
        // if (!user) {
        //     return res.status(404).send();
        // }
        await req.user.remove();
        sendCancelationEmail(req.user.email, req.user.name);
        res.send(req.user);
    } catch (e) {
        res.status(400).send();
    }
})
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'));
        }
        cb(undefined, true)
    }
})
router.post('/user/me/avatar', auth, upload.single('avatar'), async(req, res) => {
    const buffer = await sharp(req.file.buffer).resize({
        width: 250,
        height: 250
    }).png().toBuffer()
    req.user.avatar = buffer;
    await req.user.save();
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
})
router.get('/user/:id/avatar', async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) {
            throw new Error();
        }
        res.set('Content-Type', 'image/png');
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})


router.delete('/user/me/avatar', auth, async(req, res) => {
    req.user.avatar = undefined;
    req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send()
})
module.exports = router;