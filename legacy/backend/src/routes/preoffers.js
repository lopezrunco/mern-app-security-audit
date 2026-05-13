const express = require('express')
const router = express.Router()

const checkUserCredentials = require('../middlewares/check-user-credentials')
const checkUserRole = require('../middlewares/check-user-role')

const getAllPreoffers = require('../controllers/preoffer/get-all')
const getPreofferById = require('../controllers/preoffer/get-by-id')
const getPreoffersByUserId = require('../controllers/preoffer/get-by-user-id')
const createPreoffer = require('../controllers/preoffer/create')
const updatePreoffer = require('../controllers/preoffer/update')
const deletePreoffer = require('../controllers/preoffer/delete')
const getPostsByTag = require('../controllers/post/get-by-tag')

router.post('/preoffers', getAllPreoffers)
router.get('/preoffers/:id', checkUserCredentials(), checkUserRole(['ADMIN', 'CONS', 'BASIC']), getPreofferById)
router.get('/preoffers/user/:id', checkUserCredentials(), checkUserRole(['ADMIN', 'CONS', 'BASIC']), getPreoffersByUserId)
router.post('/preoffers/create', checkUserCredentials(), checkUserRole(['ADMIN', 'CONS', 'BASIC']), createPreoffer)
router.put('/preoffers/:id', checkUserCredentials(), checkUserRole(['ADMIN', 'CONS']), updatePreoffer)
router.delete('/preoffers/:id', checkUserCredentials(), checkUserRole(['ADMIN', 'CONS']), deletePreoffer)

module.exports = router