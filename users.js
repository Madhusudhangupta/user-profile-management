const express = require('express')
const router = require('bcrypt')
const jwt = require('jsonwebtoken')
const {check, validationResult} = requre('express-validator')
const auth = require('../middleware/auth')
const User = require('../models/User')

const router = express.Router()

// routes
// Add new user
router.post('/',auth.isAdmin, [
    check('firstName', 'First name is required').notEmpty(),
    check('lastName', 'Last name is required').notEmpty(),
    check('email', 'Please include a valid email').isAEmail(),
    check('password', 'Password must be between 6 to 12 characters long').isLength({min:6, max:12}),
    check('confirmPassword', 'Passwords do not match').custom((value, {req}) => value===req.body.password)
], async(req,res) => {
    try {
        // check for validations errors
        const error = validationResult(req)
        if(!error.isEmpty()) {
            return res.status(400).json({error: error.array()})
        }
        // check if user with given email already exists
        let user = await User.findOne({email: req.body.email})
        if(user) {
            return res.status(400).json({msg: 'User with this email already exists'})
        }

        // create new user object
        user = new User({
            firstName: req.body.firstName,
            middleName: req.body.middleName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10),
            role: 'User',
            department: req.body.department,
            createdTime: new Date(),
            updatedTime: new Date()
        })

        // save new user to database
        await user.save();
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server error')
    }
})

// Update existing user
router.put(':/id', auth.isUserOrAdmin, [
    check('firstName', 'First name is required').notEmpty(),
    check('lastName', 'Last name is required').notEmpty(),
    check('email', 'Email address is required').isEmail()
], async(req,res) => {
    try {
        // check for validation errors
        const error = validationResult(req)
        if(!error.isEmpty()) {
            return res.status(400).json({error: error.array()})
        }
        // check if user already exists
        let user = await User.findById(req.params.id)
        if(!user) {
            return res.status(404).json({msg: 'User not found'})
        }
        // check if user is trying to update password
        if(req.body.password) {
            return res.status(400).json({msg: 'Password cannot be updated'})
        }
        //check if user is trying to update createdTime or UpdatedTime
        if(req.body.createdTime || req.body.updatedTime) {
            return res.status(400).json({msg: 'Cannot update createdTime or updatedTime'})
        }

        // update user object
        user.firstName = req.body.firstName
        user.middleName = req.body.middleName
        user.lastName = req.body.lastName
        user.email = req.body.email
        user.department = req.body.department
        user.updatedTime = new Date()

        // save updated user to database
        await user.save()
        res.json({msg: 'User updated'})
    } catch (err) {
        console.log(err)
        res.status(500).send('Server error')
    }
})

// delete user
router.delete(':/id', auth.isAdmin, async(req,res) => {
    try {
        // check if user exists
        let user = await User.findById(req.params.id)
        if(!user) {
            return res.status(404).json({msg: 'User not found'})
        }
        // delete user from database
        await user.remove()
        res.json({msg: 'User deleted'})
    } catch (err) {
        console.log(err)
        res.status(500).send('Server error')
    }
})

// routes user
// login user
router.post('/login', [
    check('email','Please enter a valid email').isEmail(),
    check('password', 'Password is required').notEmpty()
], async(req,res) => {
    try {
        // check for validation errors
        const error = validationResult(req)
        if(!error.isEmpty()) {
            return res.status(400).json({error: error.array()})
        }
        // check if user exits
        let user = await User.findOne({email: req.body.email})
        if(!user) {
            return res.status(400).json({msg: 'Invalid credentials!'})
        }
        // check if password matches
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if(!isMatch) {
            return res.status(400).json({msg: 'Invalid credentials!'})
        }
        // create and return JSON web token 
        const payload = {user: {id: user.id}}
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h'}, (err, token) => {
            if(err) throw err
            res.json({token})
        })
    } catch (err) {
        console.log(err)
        res.status(500).send('Server error')
    }
})

module.exports = router