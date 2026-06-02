require('dotenv').config() // Load environment variables.

const mongoose = require('mongoose') // MongoDB mapper
const mongooseToJson = require('@meanie/mongoose-to-json') // Cleans the requests on _id & __v fields.
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

const getDbConnectionString = require('./utils/get-db-connection-string')
mongoose.plugin(mongooseToJson) // Loads the mongooseToJson plugin in mongoose.

const routes = require('./routes')

const app = express()

app.use(helmet())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type']
}))
app.use(express.json({ limit: '10kb' }))
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 100 : 2000,
    message: 'Too many requests from this IP, please try agin after 15 minutes.'
}))
app.use('/', routes)

// Use the imported credentials to connect to the database.
mongoose.connect(getDbConnectionString(), { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(process.env.PORT)
        console.log('Connected to database.')
    }).catch(error => {
        console.error('Database Connection Error: Failed to establish connection securely.')
    })