const express = require('express')
const router = express.Router()

const checkUserCredentials = require('../middlewares/check-user-credentials')
const checkUserRole = require('../middlewares/check-user-role')

const login = require('../controllers/user/login')
const register = require('../controllers/user/register')
const getAllUsers = require('../controllers/user/get-all')
const getUserById = require('../controllers/user/get-by-id')
const updateUser = require('../controllers/user/update')
const deleteUser = require('../controllers/user/delete')

router.post('/login', login)
router.post('/register', register)
router.put('/user/:id/update', checkUserCredentials(), updateUser)
router.get('/admin/users', checkUserCredentials(), checkUserRole(['ADMIN']), getAllUsers)
router.get('/admin/users/:id', checkUserCredentials(), getUserById)
router.delete('/admin/users/:id', checkUserCredentials(), checkUserRole(['ADMIN']), deleteUser)

module.exports = router