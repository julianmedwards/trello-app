const express = require('express')

// const boardRoutes = require('./board')
const laneRoutes = require('./lanes')
// const cardRoutes = require('./cards')

const router = express.Router()

router.use('/lanes', laneRoutes)
// router.use('/cards', cardRoutes)

module.exports = router
