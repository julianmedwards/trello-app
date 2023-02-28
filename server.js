'use strict'

const express = require('express')
// const cors = require('./node_modules/cors')

const app = express()
const port = process.env.PORT || 3000
const router = require('./routes/index')

// const allowedOrigins = ['http://localhost:3000']

// const corsOptions = {
//     origin: allowedOrigins,
// }

// app.use(cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.set('views', './views')
app.set('view engine', 'pug')

app.use('/', router)

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

    // const newLaneData = {
    //     laneName: 'Lane 1',
    //     cards: [{cardName: 'card 1', cardDescr: 'descr 1'}],
    // }

    // Static page script files will listen for changes.
    // Anytime a change happens, sends requests to api routes.
    // API route functions can update database and return data/html
    // to inject into the page from pug, etc.

    // - Get API running
    // - Figure out CORS so API actually works
    // - Get it to add a new lane.

    // document
    //     .getElementById('board')
    //     .append(pug.render('mixins/lane', {laneData: newLaneData}))
})

app.use(express.static('public'))

app.listen(port, function () {
    console.log('Server is running on PORT', port)
})
