const pug = require('pug')

exports.getLanes = async function (req, res) {
    const response = await fetch('http://localhost:5000/lanes', {
        method: 'GET',
    })
    const data = await response.json()

    res.send(data)
}

exports.addLane = async function (req, res) {
    // FetchEvent.request from client?
    const response = await fetch('http://localhost:5000/lanes', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
    })

    if (response.ok) {
        const html = pug.renderFile(__basedir + '/views/lanePartial.pug', {
            data: req.body,
        })
        res.send(html)
    }
}

exports.editLane = function () {}
