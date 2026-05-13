require('dotenv').config() // Load environment variables.

const mongoose = require('mongoose') // MongoDB mapper
const mongooseToJson = require('@meanie/mongoose-to-json') // Cleans the requests on _id & __v fields.
const express = require('express')
const cors = require('cors')

const getDbConnectionString = require('./utils/get-db-connection-string')
mongoose.plugin(mongooseToJson) // Loads the mongooseToJson plugin in mongoose.

const routes = require('./routes')

const app = express()

// Middleware function that opens the API in security terms, (Connect the front-end allowing conections between the same IP).
app.use(cors())
// Understand the JSON sent by the API.
app.use(express.json())
// Routes definition.
app.use('/', routes)

// Use the imported credentials to connect to the database.
mongoose.connect(getDbConnectionString(), { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(process.env.PORT)
        console.log('Connected to database.')
    }).catch(error => {
        console.error('Could not connect to the database => ', error)
    })