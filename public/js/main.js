'use strict'

const icons = {
    plus: 'fa-plus',
    times: 'fa-times',
}

function initBtns() {
    let addLaneBtn = document.getElementById('add-lane-btn')
    addLaneBtn.querySelector('i').addEventListener('click', function () {
        toggleAddingLane(addLaneBtn.querySelector('i'))
    })

    let addCardBtns = document.getElementsByName('add-card-btn')
    for (let btn of addCardBtns) {
        activateButton(btn.querySelector('i'), toggleAddingCard)
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

// ---- Move to respective files when fixed. ----
// Applying new text (editing lanes/cards) allows fully empty ones
// which isn't allowed on creation. Need to add logic to check if
// there's still a value to head els when creating logic to post
// to server.
function applyCardEdit(inputs, cardDivs) {
    for (let i = 0; i < inputs.length; i++) {
        cardDivs[i].querySelector('p').textContent = inputs[i].value
        cardDivs[i].style.display = ''
        cardDivs[i].classList.remove('editing')
    }
    inputs[0].parentElement.remove()
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

function isEditing(element) {
    if (element.classList.contains('editing')) {
        return true
    }
}

window.onload = () => {
    initBtns()
    let currentBoardId = document
        .getElementById('board')
        .getAttribute('data-db-id')
    document.cookie = `lastBoard=${currentBoardId}`
}
