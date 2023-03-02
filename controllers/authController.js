const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// add admin
router.post('/admin', auth, async(req, res) => {
    const admin = new Admin(req.body)
    try {
        // check if user is admin
        if(req.user.role !== 'admin') {
            throw new Error()
        }
        // set createdTime and updatedTime
        admin.createdTime = new Date()
        admin.updatedTime = new Date()
        // hash password
        admin.password = await bcrypt.hash(admin.password, 8)
        // save admin to database
        await admin.save()
        res.status(201).send(admin)
    } catch (err) {
        console.log(err)
    }
})

// update admin
rouer.patch('/admin/"id', auth, async(req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['firstName', 'middleName', 'lastName', 'email', 'department']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({error: 'Invlid updates!!'})
    }
    try {
        // check if user is admin
        if(req.user.role !== 'admin') {
            throw new Error()
        }
        const admin = await Admin.findById(req.params.id)
        if(!admin) {
            return res.status(404).send()
        }
        // update admin fields
        updates.forEach((update) => (admin[update]=req.body[update]))
        admin.updateTime = new Date()

        //save admin to database
        await admin.save()
        res.send(admin)
    } catch (err) {
        console.log(err);
        res.status(400).send(err)
    }
})

// view admin
router.get('/admin/:id', auth, async(req,res) => {
    try {
        //  check if user is admin or requested user
        if(req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
            throw new Error()
        }
        const admin = await Admin.findById(req.params.id)
        if(!admin) {
            return res.status(404).send()
        }
        res.send(admin)
    } catch (err) {
        console.log(err)
        res.status(400).send(err)
    }
})

module.exports = router