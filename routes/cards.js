const express = require('express')
// const cardController = require('../controllers/card')
const cardController = {
    getCards: function () {},
    addCard: function () {},
    editCard: function () {},
}

const router = express.Router()

router.route('/get').get(cardController.getCards)

router.route('/add').post(cardController.addCard)

router.route('/edit').patch(cardController.editCard)

module.exports = router
