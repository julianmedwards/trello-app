'use strict'

async function postLane(data) {
    const response = await fetch('http://localhost:5000/lanes', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
        },
        body: JSON.stringify(data),
    })

    return response
}
