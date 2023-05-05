import { semanticLabels } from '../labels.js'
import { state } from '../state.js'
import { DECORATORS_LIST_ID, LIST_DECORATORS, settings } from '../settings.js'

const createCheckbox = async ({ label, defaultValue }) => {
  let checked = await state.get(label)
  if (checked === undefined) {
    state.set(label, defaultValue)
    checked = defaultValue
  }
  const input = document.createElement('input')
  input.type = 'checkbox'
  input.checked = checked
  input.onchange = (e) => state.set(label, e.target.checked)
  return input
}

function getOnchangeInput(id) {
  return (e) => {
    state.set(id, e.target.value)
  }
}

const createTextBox = async ({ id, description, defaultValue }) => {
  let value = await state.get(id)
  if (value === undefined) {
    state.set(id, defaultValue)
    value = defaultValue
  }
  const input = document.createElement('input')
  input.type = 'text'
  input.id = id
  input.value = value
  input.addEventListener('input', getOnchangeInput(id))
  // Créer un élément label pour le champ d'entrée de texte
  const label = document.createElement('label')
  label.textContent = description
  label.setAttribute('for', id)

  // Ajouter l'élément label et l'élément input au div container
  const container = document.createElement('div')
  container.classList.add('text-container')
  container.appendChild(label)
  container.appendChild(input)
  return container
}

const setup = async () => {
  const settingsContainer = document.querySelector('#settings')
  const labelsContainer = document.querySelector('#labels')
  const labelConfigs = Object.entries(semanticLabels)
  const settingConfigs = Object.entries(settings)

  // Settings
  settingConfigs.map(async ([label, { defaultValue, description }]) => {
    const toggleContainer = document.createElement('div')
    const checkbox = await createCheckbox({ label, defaultValue })
    const descriptionContainer = document.createElement('span')

    descriptionContainer.innerText = description

    toggleContainer.classList.add('toggle-container')
    toggleContainer.appendChild(descriptionContainer)
    toggleContainer.appendChild(checkbox)
    settingsContainer.appendChild(toggleContainer)
  })

  // Add settings :
  settingsContainer.appendChild(
    await createTextBox({
      id: DECORATORS_LIST_ID,
      description: 'List of decorators (separated with ",")',
      defaultValue: LIST_DECORATORS.join(','),
    })
  )

  // Labels
  labelConfigs.map(async ([label, config]) => {
    const toggleContainer = document.createElement('div')
    const iconContainer = document.createElement('div')
    const labelContainer = document.createElement('span')
    const checkbox = await createCheckbox({ label, defaultValue: config.defaultValue })

    iconContainer.innerHTML = config.icon
    labelContainer.innerText = label

    toggleContainer.classList.add('toggle-container')
    toggleContainer.appendChild(iconContainer)
    toggleContainer.appendChild(labelContainer)
    toggleContainer.appendChild(checkbox)
    labelsContainer.appendChild(toggleContainer)
  })
}

setup()
