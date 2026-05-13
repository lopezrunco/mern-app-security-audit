const express = require('express')
const router = express.Router()

const checkUserCredentials = require('../middlewares/check-user-credentials')
const checkUserRole = require('../middlewares/check-user-role')

const getAllEvents = require('../controllers/event/get-all')
const getEventById = require('../controllers/event/get-by-id')
const getEventByUserId = require('../controllers/event/get-by-user-id')
const createEvent = require('../controllers/event/create')
const updateEvent = require('../controllers/event/update')
const deleteEvent = require('../controllers/event/delete')

router.get('/events', getAllEvents)
router.get('/events/:id', getEventById)
router.post('/my-events', checkUserCredentials(), checkUserRole(['ADMIN', 'CONS']), getEventByUserId)
router.post('/events/create', checkUserCredentials(), checkUserRole(['ADMIN', 'CONS']), createEvent)
router.put('/events/:id', checkUserCredentials(), checkUserRole(['ADMIN', 'CONS']), updateEvent)
router.delete('/events/:id', checkUserCredentials(), checkUserRole(['ADMIN', 'CONS']), deleteEvent)

module.exports = router