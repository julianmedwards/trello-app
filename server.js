'use strict'

const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 3000
// const router = require('./router')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.set('views', './views')
app.set('view engine', 'pug')

// app.use('/upload', router)

const DATA = {
    lanes: [
        {
            laneName: 'Lane 1',
            cards: [{cardName: 'card 1', cardDescr: 'descr 1'}],
        },
        {
            laneName: 'Lane 2',
            cards: [{cardName: 'card 2', cardDescr: 'descr 2'}],
        },
    ],
}

app.get('/', (req, res) => {
    res.render('index', {DATA: DATA})
})

app.use(express.static('public'))

app.listen(port, function () {
    console.log('Server is running on PORT', port)
})
