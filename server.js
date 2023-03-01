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

global.__basedir = __dirname

app.get('/', async (req, res) => {
    const response = await fetch('http://localhost:5000/lanes', {
        method: 'GET',
    })
    const data = await response.json()

    res.render('index', {data: JSON.parse(data)})
})

app.use(express.static('public'))

app.listen(port, function () {
    console.log('Server is running on PORT', port)
})
