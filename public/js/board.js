'use strict'

function addBoardEventListeners() {
    document.querySelector('header > h1').addEventListener('click', () => {
        startEditingBoardName(document.querySelector('header > h1'))
    })
}

function startEditingBoardName(headerText) {
    let header = headerText.parentElement
    header.classList.add('editing')

    headerText.style.display = 'none'
    let title = headerText.textContent

    let editForm = document.createElement('form')
    editForm.setAttribute('onsubmit', 'return false')
    let input = document.createElement('input')
    input.type = 'text'
    input.value = title

    editForm.append(input)

    activateInput(
        input,
        () => {
            applyBoardEdit(input, header)
        },
        cancelBoardNameEdit
    )
    headerText.before(editForm)
    input.focus()
}

async function applyBoardEdit(input, header) {
    let newTitle = input.value
    if (newTitle === header.querySelector('h1').textContent) {
        header.querySelector('h1').style.display = ''
        header.querySelector('form').remove()
        header.classList.remove('editing')
    } else {
        const response = await patchBoardReq(
            document.getElementById('board').getAttribute('data-db-id'),
            {
                boardName: newTitle,
            }
        )

        if (response.ok) {
            header.querySelector('h1').textContent = newTitle
            header.querySelector('h1').style.display = ''
            header.querySelector('form').remove()
            header.classList.remove('editing')
        } else {
            console.error('Serverside issue updating lane name.')
        }
    }
}

function cancelBoardNameEdit() {
    const header = document.querySelector('header')

    header.classList.remove('editing')
    header.querySelector('form').remove()
    header.querySelector('h1').style.display = ''
}
