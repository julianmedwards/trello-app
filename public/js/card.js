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
    activateInput(form.firstElementChild, () => {
        advanceCursor(form.firstElementChild, form)
    })
    activateInput(form.lastElementChild, addCard)

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
    if (cardName != '') {
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
        alert('Please add a name to create a card.')
    }
}

function moveCard(btn) {
    let card = btn.closest('.card')
    switch (btn.getAttribute('name')) {
        case 'up':
            let prevCard = card.previousElementSibling
            if (prevCard) {
                prevCard.before(card)
            } else {
                console.log('Card already at top.')
            }
            break
        case 'down':
            let nextCard = card.nextElementSibling
            if (nextCard) {
                nextCard.after(card)
            } else {
                console.log('Card already at bottom.')
            }
            break
        case 'left':
            let prevLane = card.closest('.lane').previousElementSibling
            if (prevLane && prevLane.classList.contains('lane')) {
                let prevLaneCards = prevLane.querySelector('.card-container')
                prevLaneCards.append(card)
            } else {
                console.log('No lane on the left to move card to.')
            }
            break
        case 'right':
            let nextLane = card.closest('.lane').nextElementSibling
            if (nextLane && nextLane.classList.contains('lane')) {
                let nextLaneCards = nextLane.querySelector('.card-container')
                nextLaneCards.append(card)
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

    activateInput(nameInput, () => {
        advanceCursor(nameInput, nameInput.parentElement)
    })
    activateInput(descrInput, () => {
        applyCardEdit([nameInput, descrInput], [headDiv, bodyDiv])
    })
    headDiv.before(editForm)
    nameInput.focus()
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
