'use strict'

// async function postBoard(data) {
//     const response = await fetch('http://localhost:5000/boards', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'text/plain',
//         },
//         body: JSON.stringify(data),
//     })

//     return response
// }

async function postLane(data) {
    const response = await fetch('http://localhost:5000/lanes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    return response
}

async function updateLane(data) {
    const response = await fetch(`http://localhost:5000/lanes/${data.laneId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data.laneData),
    })

    return response
}

async function deleteLane(data) {
    const response = await fetch(`http://localhost:5000/lanes/${data.laneId}`, {
        method: 'DELETE',
    })

    return response
}
