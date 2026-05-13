const express = require('express')
const router = express.Router()

const checkUserCredentials = require('../middlewares/check-user-credentials')
const checkUserRole = require('../middlewares/check-user-role')

const getAllLots = require('../controllers/lot/get-all')
const getLotById = require('../controllers/lot/get-by-id')
const createLot = require('../controllers/lot/create')
const updateLot = require('../controllers/lot/update')
const deleteLot = require('../controllers/lot/delete')

router.post('/lots', getAllLots)
router.get('/lots/:id', getLotById)
router.post('/lots/create', checkUserCredentials(), checkUserRole(['ADMIN', 'CONS']), createLot)
router.put('/lots/:id', checkUserCredentials(), checkUserRole(['ADMIN', 'CONS']), updateLot)
router.delete('/lots/:id', checkUserCredentials(), checkUserRole(['ADMIN', 'CONS']), deleteLot)

module.exports = router