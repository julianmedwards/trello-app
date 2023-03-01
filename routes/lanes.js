const express = require('express')
const laneController = require('../controllers/lane')

const router = express.Router()

router.route('/').get(laneController.getLanes)

router.route('/').post(laneController.addLane)

router.route('/').patch(laneController.editLane)

module.exports = router
