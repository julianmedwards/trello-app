'use strict'

function addLaneButtonListeners(event) {
    let lane = event.currentTarget.parentElement
    switch (event.target.getAttribute('name')) {
        case 'left':
        case 'right':
            if (isEditing(lane.querySelector('.lane-head'))) {
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
            startEditingLane(event.target)
            break
        case 'delete':
            if (isEditing(lane.querySelector('.lane-head'))) {
                cancelLaneEdit(lane.querySelector('.lane-head'))
            }
            removeLane(event.target)
            break
    }
}

function toggleAddingLane(button) {
    toggleIcon(button, icons.plus, icons.times)

    let form = button.previousElementSibling
    toggleVisiblity(form)
    activateInput(form.querySelector('input'), addLane, () => {
        toggleAddingLane(button)
    })
    if (form.classList.contains('visible')) {
        setTimeout(function () {
            form.firstElementChild.focus()
        }, 100)
    } else {
        document.activeElement.blur()
    }
}

async function addLane(input) {
    const addDiv = input.closest('.add-new')
    const laneName = input.value
    if (laneName.trim() !== '') {
        addDiv.querySelector('form').reset()

        const response = await postLaneReq(
            document.getElementById('board').getAttribute('data-db-id'),
            {
                laneName: laneName,
            }
        )

        let resData = await response.json()

        if (response.ok) {
            const newLane = buildLane(laneName)
            newLane.setAttribute('data-db-id', resData.laneId)
            addDiv.before(newLane)

            toggleAddingLane(addDiv.querySelector('i'))
        } else {
            console.error('Serverside issue adding lane to board.')
        }
    } else {
        alert('Please add a name to create a new lane.')
    }
}

async function moveLane(btn) {
    let lane = btn.closest('.lane')
    let sequenceShift
    if (btn.getAttribute('name') === 'left') {
        let prev = lane.previousElementSibling
        if (prev) {
            sequenceShift = -1
            const response = await patchLaneReq(
                document.getElementById('board').getAttribute('data-db-id'),
                {laneId: lane.getAttribute('data-db-id'), sequenceShift}
            )

            if (response.ok) {
                prev.before(lane)
            } else {
                console.error('Serverside issue moving lane.')
            }
        } else {
            console.log('Lane is already at beginning of list.')
        }
    } else {
        let next = lane.nextElementSibling
        if (!next.getAttribute('name', 'add-btn')) {
            sequenceShift = 1
            const response = await patchLaneReq(
                document.getElementById('board').getAttribute('data-db-id'),
                {laneId: lane.getAttribute('data-db-id'), sequenceShift}
            )

            if (response.ok) {
                next.after(lane)
            } else {
                console.error('Serverside issue moving lane.')
            }
        } else {
            console.log('Lane has reached end of list.')
        }
    }
}

function startEditingLane(btn) {
    let lane = btn.closest('.lane')

    let headDiv = lane.querySelector('.lane-head')
    headDiv.classList.add('editing')

    let headEl = headDiv.querySelector('p')
    headEl.style.display = 'none'
    let name = headEl.textContent

    let input = document.createElement('input')
    input.type = 'text'
    input.value = name

    activateInput(
        input,
        () => {
            applyLaneEdit(input, headDiv)
        },
        () => {
            cancelLaneEdit(headDiv)
        }
    )
    headDiv.append(input)
    input.focus()
}

async function applyLaneEdit(input, laneHead) {
    let newLaneName = input.value
    if (newLaneName.trim() !== '') {
        if (newLaneName === laneHead.querySelector('p').textContent) {
            laneHead.querySelector('p').style.display = ''
            input.remove()
            laneHead.classList.remove('editing')
        } else {
            const response = await patchLaneReq(
                document.getElementById('board').getAttribute('data-db-id'),
                {
                    laneId: laneHead
                        .closest('.lane')
                        .getAttribute('data-db-id'),
                    laneName: newLaneName,
                }
            )

            if (response.ok) {
                laneHead.querySelector('p').textContent = newLaneName
                laneHead.querySelector('p').style.display = ''
                input.remove()
                laneHead.classList.remove('editing')
            } else {
                console.error('Serverside issue updating lane name.')
            }
        }
    } else {
        alert('Please add a name to create a new lane.')
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

async function removeLane(btn) {
    let deleteMsg = 'Are you sure you want to delete this swim lane?'
    if (confirm(deleteMsg)) {
        let currLane = btn.closest('.lane')
        let cards = currLane.querySelector('.card-container').children
        let lanes = document.getElementById('board').querySelectorAll('.lane')
        if (cards.length > 0 && lanes.length > 1) {
            let transferMsg =
                'Would you like to move your cards to another lane before deleting?'
            if (confirm(transferMsg)) {
                let selectLane = prompt(
                    "Enter a number for the lane you'd like to move the cards to. (left-to-right)"
                )
                if (lanes[selectLane - 1]) {
                    if (lanes[selectLane - 1] == currLane) {
                        alert(
                            "Please select a lane other than the one you're deleting."
                        )
                    } else {
                        const response = await deleteAndTransferReq(
                            document
                                .getElementById('board')
                                .getAttribute('data-db-id'),
                            currLane.getAttribute('data-db-id'),
                            lanes[selectLane - 1].getAttribute('data-db-id')
                        )

                        if (response.status === 204) {
                            for (let i = 0; cards[i] != null; ) {
                                lanes[selectLane - 1]
                                    .querySelector('.card-container')
                                    .append(cards[i])
                            }
                            currLane.remove()
                        } else {
                            console.error('Serverside issue deleting lane.')
                            alert('Failed to delete lane!')
                        }
                    }
                } else {
                    alert(
                        'No lane for ' +
                            selectLane +
                            ". If you'd like to move the cards to the leftmost lane, enter '1', and so on."
                    )
                }
            } else {
                const response = await deleteLaneReq(
                    document.getElementById('board').getAttribute('data-db-id'),
                    currLane.getAttribute('data-db-id')
                )
                if (response.status === 204) {
                    currLane.remove()
                } else {
                    console.error('Serverside issue deleting lane.')
                    alert('Failed to delete lane!')
                }
            }
        } else {
            const response = await deleteLaneReq(
                document.getElementById('board').getAttribute('data-db-id'),
                currLane.getAttribute('data-db-id')
            )
            if (response.status === 204) {
                currLane.remove()
            } else {
                console.error('Serverside issue deleting lane.')
                alert('Failed to delete lane!')
            }
        }
    } else console.log('Lane delete aborted.')
}
