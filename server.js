const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const socketio = require('socket.io')
const cors = require('cors')

const app = express()

// set up middleware
app.use(express.json())
app.use(cors())

// set up mongoDB connection
const URI = 'mongodb://127.0.0.1/user-profile-management'
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    })
    .then(() => console.log("Database connected successfully!!!"))
    .catch(err => console.log(err))

// set up API routes
app.post('/api/users', async(req,res) => {

})

app.put('/api/users/:userId', async(req,res) => {

})

app.get('/api/users/:userId', async(req, res) => {

})

app.post('/api/admins', async(req,res) => {

})

app.put('/api/admins/:adminId', async(req,res) => {

})

app.get('/api/admins/:adminId', async(req,res) => {

})

// start server
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => console.log(`Server running at the port ${PORT}`))
const io = socketio(server)

// set up socket.io connection
io.on('connection', (socket) => {
    console.log(`A user connected`)
})