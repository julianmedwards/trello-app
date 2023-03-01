'use strict'

const icons = {
    plus: 'fa-plus',
    times: 'fa-times',
}

const BoardObj = function () {
    this.boardDiv = document.getElementById('board')
    this.toggleAdding = toggleAdding
    this.buttons = initBtns(this)
}

function initBtns(board) {
    let buttons = document.getElementsByName('add-btn')
    for (let button of buttons) {
        if (button.parentElement == board.boardDiv) {
            button.lastElementChild.addEventListener('click', function () {
                board.toggleAdding(button.lastElementChild)
            })
        } else {
            button.addEventListener('click', addCard)
        }
    }
    return buttons
}
function activateButton(element, funct) {}
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
function advanceCursor(currInput, form) {}
function replaceText(input, textEl, hiddenEl) {}
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
    // if (button.parentElement.parentElement.classList.contains('lane')) {
    //     toggleVisiblity(button.nextElementSibling)
    //     toggleIcon(button, icons.plus, icons.times)
    //     activateInput(button.nextElementSibling.firstElementChild, () => {
    //         advanceCursor(
    //             button.nextElementSibling.firstElementChild,
    //             button.nextElementSibling
    //         )
    //     })
    //     activateInput(button.nextElementSibling.lastElementChild, addCard)
    //     if (button.nextElementSibling.classList.contains('visible')) {
    //         setTimeout(function () {
    //             button.nextElementSibling.firstElementChild.focus()
    //         }, 100)
    //     } else {
    //         document.activeElement.blur()
    //     }
    // } else
    if (button.parentElement.parentElement.id === 'board') {
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

        const response = await fetch('http://localhost:3000/lanes', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({laneName: laneName, cards: []}),
        })

        const newLane = await response.text()

        input.parentElement.parentElement.insertAdjacentHTML(
            'beforebegin',
            newLane
        )

        // activateButton(rightIcon, moveLane)
        // activateButton(leftIcon, moveLane)
        // activateButton(editIcon, editLane)
        // activateButton(delIcon, delLane)
        // activateButton(addCardIcon, toggleAdding)
        // toggleAdding(input.parentElement.nextElementSibling)
    } else {
        alert('Please add a name to create a new lane.')
    }
}
function moveLane(btn) {}
function editLane(btn) {}
function delLane(btn) {}
function addCard(descrInput) {}
function moveCard(btn) {}
function editCard(btn) {}
function delCard(btn) {}

const board01 = new BoardObj()
