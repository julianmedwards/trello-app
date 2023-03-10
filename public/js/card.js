'use strict'

function addCardButtonListeners(event) {
    let card = event.currentTarget.parentElement
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
            editCard(event.target)
            break
        case 'delete':
            if (isEditing(card.querySelector('.card-head'))) {
                cancelCardEdit(card)
            }
            delCard(event.target)
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

function addCard(descrInput) {
    let cardName = descrInput.previousElementSibling.value
    if (cardName != '') {
        let cardDescr = descrInput.value
        let cardContainer =
            descrInput.parentElement.parentElement.previousElementSibling

        const newCard = buildCard(cardName, cardDescr)
        cardContainer.append(newCard)

        descrInput.parentElement.reset()
        toggleAddingCard(descrInput.parentElement.previousElementSibling)
    } else {
        alert('Please add a name to create a card.')
    }
}

function moveCard(btn) {
    let card = btn.parentElement.parentElement
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
            let prevLane =
                card.parentElement.parentElement.previousElementSibling
            if (prevLane && prevLane.classList.contains('lane')) {
                let prevLaneCards = prevLane.querySelector('.card-container')
                prevLaneCards.append(card)
            } else {
                console.log('No lane on the left to move card to.')
            }
            break
        case 'right':
            let nextLane = card.parentElement.parentElement.nextElementSibling
            if (nextLane && nextLane.classList.contains('lane')) {
                let nextLaneCards = nextLane.querySelector('.card-container')
                nextLaneCards.append(card)
            } else {
                console.log('No lane on the right to move card to.')
            }
            break
    }
}

function editCard(btn) {
    let headDiv = btn.parentElement.parentElement.nextElementSibling
    let bodyDiv = headDiv.nextElementSibling
    headDiv.style.display = 'none'
    bodyDiv.style.display = 'none'
    headDiv.classList.add('editing')
    bodyDiv.classList.add('editing')

    let headEl = headDiv.firstElementChild
    let bodyEl = bodyDiv.firstElementChild

    let name = headEl.textContent
    let descr = bodyEl.textContent

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
        applyNewCardText([nameInput, descrInput], [headDiv, bodyDiv])
    })
    headDiv.before(editForm)
    nameInput.focus()
}

function delCard(btn) {
    let msg = 'Are you sure you want to delete this card?'
    if (confirm(msg)) {
        btn.parentElement.parentElement.parentElement.remove()
    } else console.log('Card delete aborted.')
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
