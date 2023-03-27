'use strict'

const APIUrl = 'http://localhost:5000'

async function patchBoardReq(boardId, boardData) {
    const response = await fetch(`${APIUrl}/boards/${boardId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(boardData),
    })

    return response
}

async function postLaneReq(boardId, laneData) {
    const response = await fetch(`${APIUrl}/boards/${boardId}/lanes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(laneData),
    })

    return response
}

async function patchLaneReq(boardId, laneData) {
    const response = await fetch(
        `${APIUrl}/boards/${boardId}/lanes/${laneData.laneId}`,
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

async function deleteAndTransferReq(boardId, laneId, destinationLaneId) {
    const response = await fetch(
        `${APIUrl}/boards/${boardId}/lanes/${laneId}/delete-and-transfer/${destinationLaneId}`,
        {
            method: 'PATCH',
        }
    )

    return response
}

async function deleteLaneReq(boardId, laneId) {
    const response = await fetch(
        `${APIUrl}/boards/${boardId}/lanes/${laneId}`,
        {
            method: 'DELETE',
        }
    )

    return response
}

async function postCardReq(boardId, laneId, cardData) {
    const response = await fetch(
        `${APIUrl}/boards/${boardId}/lanes/${laneId}/cards`,
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
        `${APIUrl}/boards/${boardId}/lanes/${laneId}/cards/${cardData.cardId}`,
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
        `${APIUrl}/boards/${boardId}/lanes/${laneId}/cards/${cardId}/move-to-lane/${destinationLaneId}`,
        {
            method: 'PATCH',
        }
    )

    return response
}

async function deleteCardReq(boardId, laneId, cardId) {
    const response = await fetch(
        `${APIUrl}/boards/${boardId}/lanes/${laneId}/cards/${cardId}`,
        {
            method: 'DELETE',
        }
    )

    return response
}
