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
            // 'Access-Control-Allow-Headers':
            //     'Origin, X-Requested-With, Content-Type, Accept',
            // Accept: 'application/json',
            // 'Access-Control-Allow-Origin': '*',
            'Content-Type': 'text/plain',
        },
        body: JSON.stringify(data),
    })

    return response
}
