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

async function postLane(boardId, laneData) {
    const response = await fetch(
        `http://localhost:5000/boards/${boardId}/lanes`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(laneData),
        }
    )

    return response
}

async function updateLane(boardId, laneData) {
    const response = await fetch(
        `http://localhost:5000/boards/${boardId}/lanes/${laneData.laneId}`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(laneData),
        }
    )

    return response
}

async function deleteLane(boardId, laneId) {
    const response = await fetch(
        `http://localhost:5000/boards/${boardId}/lanes/${laneId}`,
        {
            method: 'DELETE',
        }
    )

    return response
}

async function postCard(boardId, laneId, cardData) {
    const response = await fetch(
        `http://localhost:5000/boards/${boardId}/lanes/${laneId}/cards`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cardData),
        }
    )

    return response
}

async function updateCard(boardId, laneId, cardData) {
    const response = await fetch(
        `http://localhost:5000/boards/${boardId}/lanes/${laneId}/cards/${cardData.cardId}`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cardData),
        }
    )

    return response
}

async function deleteCard(boardId, laneId, cardId) {
    const response = await fetch(
        `http://localhost:5000/boards/${boardId}/lanes/${laneId}/cards/${cardId}`,
        {
            method: 'DELETE',
        }
    )

    return response
}
