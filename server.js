'use strict'

const config = require('./config.js')
const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cookieParser())

app.set('views', './views')
app.set('view engine', 'pug')

app.get('/', async (req, res) => {
    // Need to catch cookie board deleted.
    let url
    if (req.cookies.lastBoard) {
        // fetch boards/:id
        console.log('Fetching board from cookie.')
        url = `http://localhost:5000/boards/${req.cookies.lastBoard}`

        const response = await requestBoardData([
            url,
            {
                method: 'GET',
            },
        ])

        if (response.status === 404) {
            console.log('Cookie board not found in db - loading default.')
            loadDefault(res)
        } else {
            loadBoardPage(res, await response.json())
        }
    } else {
        console.log('No cookie, loading default.')
        loadDefault(res)
    }
})

async function requestBoardData(params) {
    let response = await fetch(...params)

    return response
}

function loadBoardPage(res, data) {
    res.render('index', {data})
}

async function loadDefault(res) {
    const createResponse = await createDefaultBoard()

    const response = await requestBoardData([
        `http://localhost:5000/boards/${createResponse.boardId}`,
        {
            method: 'GET',
        },
    ])

    const data = await response.json()

    if (response.ok) {
        loadBoardPage(res, data)
    }
}
async function createDefaultBoard() {
    // create new board, load defaults.
    const response = await fetch('http://localhost:5000/boards', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(config.defaultBoardData),
    })

    return await response.json()
}

app.use(express.static('public'))

app.listen(port, function () {
    console.log('Server is running on PORT', port)
})
