'use strict'

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

function toggleAddingLane(button) {
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
}

async function addLane(input) {
    const laneName = input.value
    if (laneName !== '') {
        input.parentElement.reset()

        const response = await postLane({
            boardId: document
                .getElementById('board')
                .getAttribute('data-db-id'),
            laneData: {
                laneName: laneName,
            },
        })

        if (response.ok) {
            const newLane = buildLane(laneName)
            input.parentElement.parentElement.before(newLane)

            input.parentElement.reset()
            toggleAddingLane(input.parentElement.nextElementSibling)
        } else {
            console.error('Serverside issue adding lane to board.')
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

async function delLane(btn) {
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
                const response = await deleteLane({
                    laneId: currLane.getAttribute('data-db-id'),
                })
                if (response.status === 204) {
                    currLane.remove()
                } else {
                    console.error('Serverside issue deleting lane.')
                    alert('Failed to delete lane!')
                }
            }
        } else {
            const response = await deleteLane({
                laneId: currLane.getAttribute('data-db-id'),
            })
            if (response.status === 204) {
                currLane.remove()
            } else {
                console.error('Serverside issue deleting lane.')
                alert('Failed to delete lane!')
            }
        }
    } else console.log('Lane delete aborted.')
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
