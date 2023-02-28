const express = require('express')
// const laneController = require('../controllers/lane')
const laneController = {
    getLanes: async function (req, res) {
        // FetchEvent.request from client?
        const response = await fetch('http://localhost:5000/lanes', {
            method: 'GET',
        })

        res.send(await response.json())
    },
    addLane: function () {},
    editLane: function () {},
}

const router = express.Router()

router.route('/').get(laneController.getLanes)

router.route('/').post(laneController.addLane)

router.route('/').patch(laneController.editLane)

module.exports = router
