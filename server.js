'use strict'

const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cookieParser())

app.set('views', './views')
app.set('view engine', 'pug')

app.get('/', async (req, res) => {
    // Doesn't handle no existing boards.
    // Need to catch cookie board deleted.
    let url, options
    if (req.cookies.lastBoard) {
        // fetch boards/:id
        console.log('Fetching board from cookie.')
        url = `http://localhost:5000/boards/${req.cookies.lastBoard}`
        options = {
            method: 'GET',
        }
    }
    // else {
    //     // create new board in db
    //     console.log('No cookie - creating new board.')
    //     url = 'http://localhost:5000/boards'
    //     options = {
    //         method: 'POST',
    //     }
    // }

    const response = await fetch(url, {
        options,
    })

    const data = await response.json()

    res.render('index', {data})
})

app.use(express.static('public'))

app.listen(port, function () {
    console.log('Server is running on PORT', port)
})
