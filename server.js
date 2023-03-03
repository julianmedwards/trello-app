'use strict'

const express = require('express')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.set('views', './views')
app.set('view engine', 'pug')

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
