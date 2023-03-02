const UserProfile = require('../models/User')

// add user profile
const addUserProfile = async(req, res) => {
    try {
        const { firstName, middleName, lastName, email, password, role, department } = req.body
        // check if email already exists
        const existingUser = await UserProfile.findOne({email})
        if(existingUser) {
            return res.status(409).json({message: 'User already exists'})
        }
        // create new user profile
        const newUserProfile = new UserProfile({
            firstName, 
            middleName,
            lastName,
            email, 
            password,
            role,
            department
        })
        // save the user profile to database
        await newUser.UserProfile.save()
        res.status(201).json({message: 'User profile created successfully!!0'})
    } catch (err) {
        console.log(err)
        res.json(500).json({message: 'Internal server error'})
    }
}

// update user profile
const updateUserProfile = async(req,res) => {
    try {
        const {userId} = req.params
        const { firstName, middleName, lastName, email, password, department } = req.body
        // find user profile by user id
        const existingUserProfile = await UserProfile.findById(userId)
        if(!existingUserProfile) {
            return res.status(404).json({message: 'User profile not found'})
        }
        // update user profile
        existingUserProfile.firstName = firstName || existingUserProfile.firstName
        existingUserProfile.middleName = middleName || existingUserProfile.middleName
        existingUserProfile.lastName = lastName || existingUserProfile.lastName
        existingUserProfile.email = email || existingUserProfile.email
        existingUserProfile.department = department || existingUserProfile.department
        existingUserProfile.updatedTime = Date.now()

        // save updated user profile to database
        await existingUserProfile.save()
        res.status(200).json({message: 'User profile updated successfully!!'})
    } catch (err) {
        console.log(err)
        res.status(500).json({message: 'Internal server error'})
    }
}

// get user profile by user id
const getUserProfileById = async(req, res) => {
    try {
        const {userId} = req.params
        // find user profile by user id
        const userProfile = await UserProfile.findById(userId).select('-password')
        if(!userProfile) {
            return res.status(404).json({message: 'User profile not found'})
        }
        res.status(200).json(userProfile)
    } catch (err) {
        console.log(err)
        res.status(500).json({message: 'Internal server error'})
    }
}

// get all user profiles
const getAllUserProfiles = async(req,res) => {
    try {
        // find all user profiles
        const userProfiles = await UserProfile.find().select('-password')
        res.status(200).json(userProfiles)
    } catch (err) {
        console.log(err)
        res.status(500).json({message: 'Internal server error'})
    }
}

modules.exports = { addUserProfile, updateUserProfile, getUserProfileById, getAllUserProfiles }