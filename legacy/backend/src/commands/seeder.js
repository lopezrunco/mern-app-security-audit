require('dotenv').config() // Util to read the env variables
const bcrypt = require('bcrypt')
const faker = require('faker')
const mongoose = require('mongoose')
const getDbConnectionString = require('../utils/get-db-connection-string')
const { userModel } = require('../models/user')
const { eventModel } = require('../models/event')
const { lotModel } = require('../models/lot')
const { preofferModel } = require('../models/preoffer')

const users = []
const events = []
const lots = []
const preoffers = []
const userPassword = bcrypt.hashSync('supersecret', 2)
const numberOfUsers = 10
const numberOfEvents = 0
const numberOfLots = 0
const numberOfPreOffers = 0

// Generate users
users.push({
    nickname: 'Admin',
    email: 'email@email.com',
    password: userPassword,
    mfaEnabled: false,
    mfaSecret: '',
    role: 'ADMIN'
})
for (let userIteration = 0; userIteration < numberOfUsers; userIteration++) {
    users.push({
        nickname: faker.name.findName(),
        email: faker.internet.email(),
        password: userPassword,
        mfaEnabled: false,
        mfaSecret: '',
        role: userIteration < 3 ? 'CONS' : 'BASIC'   // First 3 users will be CONSIGNATARIOS, the rest will be BASIC
    })
}

// Generate events
for (let eventIteration = 0; eventIteration < numberOfEvents; eventIteration++) {
    events.push({
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        company: faker.commerce.productName(),
        organizer: faker.commerce.productName(),
        funder: faker.commerce.productName(),
        location: faker.commerce.productName(),
        broadcastLink: faker.commerce.productName(),
    })
}

// Generate lots
for (let lotIteration = 0; lotIteration < numberOfLots; lotIteration++) {
    lots.push({
        title: faker.commerce.productName(),
        category: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        animals: 43,
        weight: 457,
        age: 3,
        class: 'MBB',
        state: 'Regular',
        observations: 'Lorem ipsum dolor sit sament amel del rad jadar melopifunak eme tele pudar.',
        race: 'Merilin',
        certificate: faker.datatype.boolean(),
        type: 'Mocheados',
        open: faker.datatype.boolean(),
        sold: faker.datatype.boolean(),
        completed: faker.datatype.boolean(),
        YTVideoSrc: '',
        eventId: '456473455674567'
    })
}

// Generate preoffers
for (let preofferIteration = 0; preofferIteration < numberOfPreOffers; preofferIteration++) {
    preoffers.push({
        userId: '465678456345656',
        date: '9 de mayo 2023',
        amount: faker.datatype.number(500),
        accepted: faker.datatype.boolean(),
        lotId: '45678456345567'
    })
}

console.log('------------------------------------------------------------------------')
console.log(`Seeder running...`)

mongoose.connect(getDbConnectionString(), { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        Promise.all([
            userModel.insertMany(users),
            eventModel.insertMany(events),
            lotModel.insertMany(lots),
            preofferModel.insertMany(preoffers)
        ]).then(() => {
            console.log('Done!')
            console.log('------------------------------------------------------------------------')
            mongoose.connection.close()
        })
    }).catch(error => {
        console.error('Could not connect to database => ', error)
    })