const express = require('express')
const router = express.Router()

const userRoutes = require('./users')
const adRoutes = require('./ads')
const eventRoutes = require('./events')
const lotRoutes = require('./lots')
const postRoutes = require('./posts')
const preofferRoutes = require('./preoffers')

router.use('/', userRoutes)
router.use('/', adRoutes)
router.use('/', eventRoutes)
router.use('/', lotRoutes)
router.use('/', postRoutes)
router.use('/', preofferRoutes)

module.exports = router