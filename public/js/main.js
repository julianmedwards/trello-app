'use strict'

const icons = {
    plus: 'fa-plus',
    times: 'fa-times',
}

function initBtns() {
    let addLaneBtn = document.getElementById('add-lane-btn')
    addLaneBtn.querySelector('i').addEventListener('click', function () {
        toggleAdding(addLaneBtn.querySelector('i'))
    })

    let addCardBtns = document.getElementsByName('add-card-btn')
    for (let btn of addCardBtns) {
        activateButton(btn.querySelector('i'), toggleAdding)
    }

    let laneBtnSections = document.querySelectorAll('.lane > .editing-buttons')
    for (let section of laneBtnSections) {
        section.addEventListener('click', addLaneButtonListeners)
    }

    let cardBtnSections = document.querySelectorAll('.card > .editing-buttons')
    for (let section of cardBtnSections) {
        section.addEventListener('click', addCardButtonListeners)
    }
}
function addLaneButtonListeners(event) {
    let lane = event.currentTarget.parentElement
    switch (event.target.getAttribute('name')) {
        case 'left':
        case 'right':
            if (isEditing(lane.querySelector('.lane-head'))) {
                // Should add prompt to save/reset.
                cancelLaneEdit(lane.querySelector('.lane-head'))
            }
            moveLane(event.target)
            break
        case 'edit':
            if (isEditing(lane.querySelector('.lane-head'))) {
                cancelLaneEdit(lane.querySelector('.lane-head'))
                // Break here acts as toggle.
                break
            }
            editLane(event.target)
            break
        case 'delete':
            if (isEditing(lane.querySelector('.lane-head'))) {
                // Should add prompt to save/reset.
                cancelLaneEdit(lane.querySelector('.lane-head'))
            }
            delLane(event.target)
            break
    }
}
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

function activateButton(element, funct) {
    if (!element.getAttribute('data-type-click')) {
        element.setAttribute('data-type-click', funct.name)
        element.addEventListener('click', () => {
            funct(element)
        })
    }
}
function activateInput(element, funct) {
    if (!element.getAttribute('data-type-keypress')) {
        element.setAttribute('data-type-keypress', funct.name)
        element.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                console.log('Enter pressed')
                funct(element)
            }
        })
    }
}
function advanceCursor(currInput, form) {
    let formEls = Array.from(form)
    let currIndex = formEls.indexOf(currInput)
    formEls[currIndex + 1].focus()
}

// Applying new text (editing lanes/cards) allows fully empty ones
// which isn't allowed on creation. Need to add logic to check if
// there's still a value to head els when creating logic to post
// to server.
function applyNewCardText(inputs, cardDivs) {
    for (let i = 0; i < inputs.length; i++) {
        cardDivs[i].querySelector('p').textContent = inputs[i].value
        cardDivs[i].style.display = ''
        cardDivs[i].classList.remove('editing')
    }
    inputs[0].parentElement.remove()
}
function applyNewLaneText(input, laneHead) {
    laneHead.querySelector('p').textContent = input.value
    laneHead.querySelector('p').style.display = ''
    input.remove()
    laneHead.classList.remove('editing')
}

function toggleVisiblity(element) {
    if (
        element.classList.contains('hidden') ||
        element.classList.contains('visible')
    ) {
        element.classList.toggle('hidden')
        element.classList.toggle('visible')
    } else {
        element.classList.add('hidden')
    }
}
function toggleIcon(iconEl, initIcon, altIcon) {
    if (iconEl.classList.contains(initIcon)) {
        iconEl.classList.replace(initIcon, altIcon)
    } else {
        iconEl.classList.replace(altIcon, initIcon)
    }
}

function toggleAdding(button) {
    if (button.parentElement.parentElement.classList.contains('lane')) {
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
    } else if (button.parentElement.parentElement.id === 'board') {
        toggleVisiblity(button.previousElementSibling)
        toggleIcon(button, icons.plus, icons.times)
        activateInput(button.previousElementSibling.firstElementChild, addLane)
        if (button.previousElementSibling.classList.contains('visible')) {
            setTimeout(function () {
                button.previousElementSibling.firstElementChild.focus()
            }, 100)
        } else {
            document.activeElement.blur()
        }
    } else {
        console.error('Unexpected html structure when adding lane or card.')
    }
}
async function addLane(input) {
    const laneName = input.value
    if (laneName !== '') {
        input.parentElement.reset()

        const response = await postLane({laneName: laneName, cards: []})

        if (response.ok) {
            const newLane = buildLane(laneName)
            input.parentElement.parentElement.before(newLane)

            input.parentElement.reset()
            toggleAdding(input.parentElement.nextElementSibling)
        }
    } else {
        alert('Please add a name to create a new lane.')
    }
}
function moveLane(btn) {
    let lane = btn.parentElement.parentElement
    if (btn.getAttribute('name') === 'left') {
        let prev = lane.previousElementSibling
        if (prev) {
            lane.previousElementSibling.before(lane)
        } else {
            console.log('Lane is already at beginning of list.')
        }
    } else {
        let next = lane.nextElementSibling
        if (!next.getAttribute('name', 'add-btn')) {
            next.after(lane)
        } else console.log('Lane has reached end of list.')
    }
}
function editLane(btn) {
    let lane = btn.parentElement.parentElement.parentElement

    let headDiv = lane.querySelector('.lane-head')
    headDiv.classList.add('editing')

    let headEl = headDiv.querySelector('p')
    headEl.style.display = 'none'
    let name = headEl.textContent

    let input = document.createElement('input')
    input.type = 'text'
    input.value = name

    activateInput(input, () => {
        applyNewLaneText(input, headDiv)
    })
    headDiv.append(input)
    input.focus()
}
function delLane(btn) {
    let msg = 'Are you sure you want to delete this swim lane?'
    if (confirm(msg)) {
        let currLane = btn.parentElement.parentElement.parentElement
        let cards = currLane.querySelector('.card-container').children
        let lanes = document.getElementById('board').querySelectorAll('.lane')
        if (cards.length > 0 && lanes.length > 1) {
            let msg2 =
                'Would you like to move your cards to another lane before deleting?'
            if (confirm(msg2)) {
                let selectLane = prompt(
                    "Enter a number for the lane you'd like to move the cards to. (left-to-right)"
                )
                if (lanes[selectLane - 1]) {
                    if (lanes[selectLane - 1] == currLane) {
                        alert(
                            "Please select a lane other than the one you're deleting."
                        )
                    } else {
                        for (let i = 0; cards[i] != null; ) {
                            lanes[selectLane - 1]
                                .querySelector('.card-container')
                                .append(cards[i])
                        }
                        currLane.remove()
                    }
                } else {
                    alert(
                        'No lane for ' +
                            selectLane +
                            ". If you'd like to move the cards to the leftmost lane, enter '1', and so on."
                    )
                }
            } else {
                btn.parentElement.parentElement.parentElement.remove()
            }
        } else {
            btn.parentElement.parentElement.parentElement.remove()
        }
    } else console.log('Lane delete aborted.')
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
        toggleAdding(descrInput.parentElement.previousElementSibling)
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

function isEditing(element) {
    if (element.classList.contains('editing')) {
        return true
    }
}

function cancelLaneEdit(wrapper) {
    wrapper.classList.remove('editing')

    let inputs = wrapper.querySelectorAll('input')
    for (let input of inputs) {
        input.remove()
    }

    let originalTexts = wrapper.querySelectorAll('p')
    for (let text of originalTexts) {
        text.style.display = ''
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

window.onload = () => {
    initBtns()
}
