'use strict'

function addCardButtonListeners(event) {
    let card = event.currentTarget.closest('.card')
    switch (event.target.getAttribute('name')) {
        case 'left':
        case 'right':
        case 'up':
        case 'down':
            if (isEditing(card.querySelector('.card-head'))) {
                cancelCardEdit(card)
            }
            moveCard(event.target)
            break
        case 'edit':
            if (isEditing(card.querySelector('.card-head'))) {
                cancelCardEdit(card)
                // Break here acts as toggle.
                break
            }
            startEditingCard(event.target)
            break
        case 'delete':
            if (isEditing(card.querySelector('.card-head'))) {
                cancelCardEdit(card)
            }
            removeCard(event.target)
            break
    }
}

function toggleAddingCard(button) {
    toggleIcon(button, icons.plus, icons.times)

    let form = button.nextElementSibling
    toggleVisiblity(form)
    activateInput(
        form.firstElementChild,
        () => {
            advanceCursor(form.firstElementChild, form)
        },
        () => {
            toggleAddingCard(button)
        }
    )
    activateInput(form.lastElementChild, addCard, () => {
        toggleAddingCard(button)
    })

    if (form.classList.contains('visible')) {
        setTimeout(function () {
            form.firstElementChild.focus()
        }, 100)
    } else {
        document.activeElement.blur()
    }
}

async function addCard(descrInput) {
    let lane = descrInput.closest('.lane')
    let cardName = descrInput.previousElementSibling.value
    let cardDescr = descrInput.value
    if (cardName.trim() !== '') {
        const response = await postCardReq(
            document.getElementById('board').getAttribute('data-db-id'),
            lane.getAttribute('data-db-id'),
            {
                cardName: cardName,
                cardDescr: cardDescr,
            }
        )

        let resData = await response.json()

        if (response.ok) {
            let cardContainer = lane.querySelector('.card-container')

            const newCard = buildCard(cardName, cardDescr)
            newCard.setAttribute('data-db-id', resData.cardId)
            cardContainer.append(newCard)

            descrInput.parentElement.reset()
            toggleAddingCard(lane.querySelector('.add-new > i'))
        }
    } else {
        alert('Please add a title to create a card.')
    }
}

async function moveCard(btn) {
    let card = btn.closest('.card')
    switch (btn.getAttribute('name')) {
        case 'up':
            let prevCard = card.previousElementSibling
            if (prevCard) {
                const sequenceShift = -1
                const response = await patchCardReq(
                    document.getElementById('board').getAttribute('data-db-id'),
                    card.closest('.lane').getAttribute('data-db-id'),
                    {cardId: card.getAttribute('data-db-id'), sequenceShift}
                )

                if (response.ok) {
                    prevCard.before(card)
                } else {
                    console.error('Serverside issue moving card.')
                }
            } else {
                console.log('Card already at top.')
            }
            break
        case 'down':
            let nextCard = card.nextElementSibling
            if (nextCard) {
                const sequenceShift = 1
                const response = await patchCardReq(
                    document.getElementById('board').getAttribute('data-db-id'),
                    card.closest('.lane').getAttribute('data-db-id'),
                    {cardId: card.getAttribute('data-db-id'), sequenceShift}
                )

                if (response.ok) {
                    nextCard.after(card)
                } else {
                    console.error('Serverside issue moving card.')
                }
            } else {
                console.log('Card already at bottom.')
            }
            break
        case 'left':
            let prevLane = card.closest('.lane').previousElementSibling
            if (prevLane && prevLane.classList.contains('lane')) {
                const response = await patchCardLocationReq(
                    document.getElementById('board').getAttribute('data-db-id'),
                    card.closest('.lane').getAttribute('data-db-id'),
                    card.getAttribute('data-db-id'),
                    prevLane.getAttribute('data-db-id')
                )

                if (response.ok) {
                    let prevLaneCards =
                        prevLane.querySelector('.card-container')
                    prevLaneCards.append(card)
                } else {
                    console.error('Serverside issue moving card to lane.')
                }
            } else {
                console.log('No lane on the left to move card to.')
            }
            break
        case 'right':
            let nextLane = card.closest('.lane').nextElementSibling
            if (nextLane && nextLane.classList.contains('lane')) {
                const response = await patchCardLocationReq(
                    document.getElementById('board').getAttribute('data-db-id'),
                    card.closest('.lane').getAttribute('data-db-id'),
                    card.getAttribute('data-db-id'),
                    nextLane.getAttribute('data-db-id')
                )

                if (response.ok) {
                    let nextLaneCards =
                        nextLane.querySelector('.card-container')
                    nextLaneCards.append(card)
                } else {
                    console.error('Serverside issue moving card to lane.')
                }
            } else {
                console.log('No lane on the right to move card to.')
            }
            break
    }
}

function startEditingCard(btn) {
    let card = btn.closest('.card')
    let headDiv = card.querySelector('.card-head')
    let bodyDiv = card.querySelector('.card-body')
    headDiv.style.display = 'none'
    bodyDiv.style.display = 'none'
    headDiv.classList.add('editing')
    bodyDiv.classList.add('editing')

    let headText = headDiv.querySelector('p')
    let bodyText = bodyDiv.querySelector('p')

    let name = headText.textContent
    let descr = bodyText.textContent

    let editForm = document.createElement('form')
    editForm.setAttribute('onsubmit', 'return false')
    let nameInput = document.createElement('input')
    nameInput.type = 'text'
    nameInput.value = name
    let descrInput = document.createElement('input')
    descrInput.type = 'text'
    descrInput.value = descr

    editForm.append(nameInput, descrInput)

    activateInput(
        nameInput,
        () => {
            advanceCursor(nameInput, nameInput.parentElement)
        },
        () => {
            cancelCardEdit(card)
        }
    )
    activateInput(
        descrInput,
        () => {
            applyCardEdit([nameInput, descrInput], [headDiv, bodyDiv])
        },
        () => {
            cancelCardEdit(card)
        }
    )
    headDiv.before(editForm)
    nameInput.focus()
}

async function applyCardEdit(inputs, cardDivs) {
    if (inputs[0].value.trim() !== '') {
        let changed = false
        for (let i = 0; i < inputs.length; i++) {
            if (
                inputs[i].value !== cardDivs[i].querySelector('p').textContent
            ) {
                changed = true
                break
            }
        }

        if (changed) {
            const response = await patchCardReq(
                document.getElementById('board').getAttribute('data-db-id'),
                cardDivs[0].closest('.lane').getAttribute('data-db-id'),
                {
                    cardId: cardDivs[0]
                        .closest('.card')
                        .getAttribute('data-db-id'),
                    cardName: inputs[0].value,
                    cardDescr: inputs[1].value,
                }
            )

            if (response.ok) {
                for (let i = 0; i < inputs.length; i++) {
                    cardDivs[i].querySelector('p').textContent = inputs[i].value
                    cardDivs[i].style.display = ''
                    cardDivs[i].classList.remove('editing')
                }
                inputs[0].parentElement.remove()
            }
        } else {
            cancelCardEdit(cardDivs[0].closest('.card'))
        }
    } else {
        alert('Please include a title for the card.')
    }
}

function cancelCardEdit(wrapper) {
    let head = wrapper.querySelector('.card-head')
    let body = wrapper.querySelector('.card-body')
    head.classList.remove('editing')
    body.classList.remove('editing')

    wrapper.querySelector('form').remove()

    head.style.display = ''
    body.style.display = ''
}

async function removeCard(btn) {
    let card = btn.closest('.card')
    let lane = btn.closest('.lane')
    let msg = 'Are you sure you want to delete this card?'
    if (confirm(msg)) {
        const response = await deleteCardReq(
            document.getElementById('board').getAttribute('data-db-id'),
            lane.getAttribute('data-db-id'),
            card.getAttribute('data-db-id')
        )

        if (response.status === 204) {
            card.remove()
        } else {
            console.error('Serverside issue deleting card.')
            alert('Failed to delete card!')
        }
    } else console.log('Card delete aborted.')
}
