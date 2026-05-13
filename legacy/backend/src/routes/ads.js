const express = require('express')
const router = express.Router()

const checkUserCredentials = require('../middlewares/check-user-credentials')
const checkUserRole = require('../middlewares/check-user-role')

const createAd = require('../controllers/ad/create')
const getAllAds = require('../controllers/ad/get-all')
const deleteAd = require('../controllers/ad/delete')
const getAdById = require('../controllers/ad/get-by-id')
const getAdsByUserId = require('../controllers/ad/get-by-user-id')
const updateAd = require('../controllers/ad/update')
const getAdsByPosition = require('../controllers/ad/get-by-position')

router.post('/ads/create', checkUserCredentials(), checkUserRole(['ADMIN', 'AUTHOR']), createAd)
router.get('/ads', checkUserCredentials(), checkUserRole(['ADMIN']), getAllAds)
router.delete('/ads/:id', checkUserCredentials(), checkUserRole(['ADMIN', 'AUTHOR']), deleteAd)
router.get('/ads/:id', checkUserCredentials(), checkUserRole(['ADMIN', 'AUTHOR']), getAdById)
router.post('/my-ads', checkUserCredentials(), checkUserRole(['ADMIN', 'AUTHOR']), getAdsByUserId)
router.put('/ads/:id', checkUserCredentials(),checkUserRole(['ADMIN', 'AUTHOR']), updateAd)
router.get('/ads/position/:position', getAdsByPosition)

module.exports = router