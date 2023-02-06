import { semanticLabels } from '../labels.js'
import { state } from '../state.js'
import { settings } from '../settings.js'

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
