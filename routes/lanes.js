const express = require('express')
// const laneController = require('../controllers/lane')

const pug = require('pug')
const laneController = {
    getLanes: async function (req, res) {
        // FetchEvent.request from client?
        const response = await fetch('http://localhost:5000/lanes', {
            method: 'GET',
        })

        data = await response.json()
        data = JSON.parse(data)

        const html = pug.renderFile(__basedir + '/views/lanePartial.pug', data)
        res.send(html)
    },
    addLane: function () {},
    editLane: function () {},
}

const router = express.Router()

router.route('/').get(laneController.getLanes)

router.route('/').post(laneController.addLane)

router.route('/').patch(laneController.editLane)

module.exports = router
