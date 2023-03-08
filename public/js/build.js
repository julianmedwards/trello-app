'use strict'

function buildLane(laneName) {
    let newLane = document.createElement('div')
    newLane.classList.add('lane', 'round')

    let buttons = document.createElement('div')
    buttons.classList.add('editing-buttons')
    let rightIcon = document.createElement('i')
    rightIcon.setAttribute('name', 'right')
    rightIcon.classList.add('fas', 'fa-angle-right')
    let leftIcon = document.createElement('i')
    leftIcon.setAttribute('name', 'left')
    leftIcon.classList.add('fas', 'fa-angle-left')
    let editIcon = document.createElement('i')
    editIcon.setAttribute('name', 'edit')
    editIcon.classList.add('fas', 'fa-edit')
    let delIcon = document.createElement('i')
    delIcon.setAttribute('name', 'delete')
    delIcon.classList.add('fas', 'fa-trash-alt')
    let midIcons = document.createElement('div')
    midIcons.append(editIcon, delIcon)
    buttons.append(leftIcon, midIcons, rightIcon)
    newLane.append(buttons)

    buttons.addEventListener('click', addLaneButtonListeners)

    let laneHead = document.createElement('div')
    laneHead.classList.add('lane-head')
    let laneTitle = document.createElement('p')
    laneTitle.textContent = laneName
    laneHead.append(laneTitle)
    newLane.append(laneHead)

    let cardContainer = document.createElement('div')
    cardContainer.classList.add('card-container', 'round')
    newLane.append(cardContainer)

    let addCardBtn = document.createElement('div')
    addCardBtn.classList.add('add-new', 'round')
    addCardBtn.setAttribute('name', 'add-card-btn')
    let addCardIcon = document.createElement('i')
    addCardIcon.classList.add('fas', 'fa-plus')
    addCardIcon.setAttribute('name', 'add-icon')
    let addCardForm = document.createElement('form')
    addCardForm.classList.add('hidden')
    addCardForm.setAttribute('name', 'add-form')
    addCardForm.setAttribute('onsubmit', 'return false')
    let addCardName = document.createElement('input')
    addCardName.setAttribute('placeholder', 'Name your card.')
    let addCardDescr = document.createElement('input')
    addCardDescr.setAttribute('placeholder', 'Add a card description.')

    addCardForm.append(addCardName, addCardDescr)
    addCardBtn.append(addCardIcon, addCardForm)
    newLane.append(addCardBtn)

    activateButton(addCardIcon, toggleAddingCard)

    return newLane
}

function buildCard(cardName, cardDescr) {
    let newCard = document.createElement('div')
    newCard.classList.add('card', 'round')

    let buttons = document.createElement('div')
    buttons.classList.add('editing-buttons')
    let leftIcon = document.createElement('i')
    leftIcon.setAttribute('name', 'left')
    leftIcon.classList.add('fas', 'fa-angle-left')
    let upIcon = document.createElement('i')
    upIcon.setAttribute('name', 'up')
    upIcon.classList.add('fas', 'fa-angle-up')
    let downIcon = document.createElement('i')
    downIcon.setAttribute('name', 'down')
    downIcon.classList.add('fas', 'fa-angle-down')
    let rightIcon = document.createElement('i')
    rightIcon.setAttribute('name', 'right')
    rightIcon.classList.add('fas', 'fa-angle-right')
    let editIcon = document.createElement('i')
    editIcon.setAttribute('name', 'edit')
    editIcon.classList.add('fas', 'fa-edit')
    let delIcon = document.createElement('i')
    delIcon.setAttribute('name', 'delete')
    delIcon.classList.add('fas', 'fa-trash-alt')
    let midIcons = document.createElement('div')
    midIcons.append(editIcon, delIcon)
    buttons.append(leftIcon, upIcon, midIcons, downIcon, rightIcon)
    newCard.append(buttons)

    buttons.addEventListener('click', addCardButtonListeners)

    let cardHead = document.createElement('div')
    cardHead.classList.add('card-head')
    let cardTitle = document.createElement('p')
    cardTitle.textContent = cardName

    let cardBody = document.createElement('div')
    cardBody.classList.add('card-body')
    let cardDescrEl = document.createElement('p')
    cardDescrEl.textContent = cardDescr

    cardHead.append(cardTitle)
    cardBody.append(cardDescrEl)
    newCard.append(cardHead, cardBody)

    return newCard
}
