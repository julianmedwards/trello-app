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

async function patchBoardReq(boardId, boardData) {
    const response = await fetch(`http://localhost:5000/boards/${boardId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(boardData),
    })

    return response
}

async function postLaneReq(boardId, laneData) {
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

async function patchLaneReq(boardId, laneData) {
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

async function deleteLaneReq(boardId, laneId) {
    const response = await fetch(
        `http://localhost:5000/boards/${boardId}/lanes/${laneId}`,
        {
            method: 'DELETE',
        }
    )

    return response
}

async function postCardReq(boardId, laneId, cardData) {
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

async function patchCardReq(boardId, laneId, cardData) {
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

async function patchCardLocationReq(
    boardId,
    laneId,
    cardId,
    destinationLaneId
) {
    const response = await fetch(
        `http://localhost:5000/boards/${boardId}/lanes/${laneId}/cards/${cardId}/move-to-lane/${destinationLaneId}`,
        {
            method: 'PATCH',
        }
    )

    return response
}

async function deleteCardReq(boardId, laneId, cardId) {
    const response = await fetch(
        `http://localhost:5000/boards/${boardId}/lanes/${laneId}/cards/${cardId}`,
        {
            method: 'DELETE',
        }
    )

    return response
}
