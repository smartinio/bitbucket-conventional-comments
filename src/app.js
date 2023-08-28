import { semanticLabels } from './labels.js'
import { classes, ids, selectors } from './selectors.js'
import { state } from './state.js'
import {
  copyToClipboard,
  createClipboardReset,
  getConventionalCommentPart,
  getConventionalCommentPrefix,
  selectMatchingTextNode,
  setCursorPosition,
  setCursorToEnd,
} from './utils.js'
import { warnAboutUnconventionalComments } from './features/warnAboutUnconventionalComments.js'
import { DECORATORS_LIST_ID, DECORATORS_SELECTOR, LIST_DECORATORS } from './settings.js'

let LabelTextElement
let curentLabel = 'suggestion'
const decoratorsList = []
let listDecoratorElement

async function updateConventionCommentOnTextBox(contentEditable) {
  const semanticConfig = semanticLabels[curentLabel]
  if (!semanticConfig) {
    return
  }
  let semanticComment = `**${semanticConfig.text}${getDecorators()}:**`

  const currentPrefix = getConventionalCommentPrefix(contentEditable.innerText)
  const resetClipboard = await createClipboardReset()

  let isSelectingRange = false
  if (currentPrefix) {
    // trimming because the existing textNode in the DOM does not contain the space
    isSelectingRange = selectMatchingTextNode(contentEditable, currentPrefix.trim())
  }

  if (!isSelectingRange) {
    setCursorPosition(contentEditable, 'start')
    semanticComment += ' '
  }

  await copyToClipboard(semanticComment)
  document.execCommand('paste')

  setCursorToEnd(contentEditable)

  await resetClipboard()
}

const createClickHandler = ({ contentEditable, label, blocking }) => {
  return async (e) => {
    e.preventDefault()
    curentLabel = label
    const semanticConfig = semanticLabels[curentLabel]
    if (semanticConfig.hasBlockingOption) {
      addDecorator(blocking ? 'blocking' : 'non-blocking')
    }

    if (await state.get(DECORATORS_SELECTOR)) {
      showHideDecoratorList(true)
    }

    await updateConventionCommentOnTextBox(contentEditable)
  }
}

const createButtonWrapper = (toolbar) => {
  const buttonWrapper = toolbar.children[0].cloneNode(true)
  buttonWrapper.querySelector('input[type=file]')?.remove()
  return buttonWrapper
}

const createButton = ({ contentEditable, toolbar, container, label, blocking }) => {
  const handleClick = createClickHandler({ contentEditable, label, blocking })
  const buttonWrapper = createButtonWrapper(toolbar)
  const button = buttonWrapper.querySelector('button')
  const svgWrapper = button.querySelector('svg').parentElement
  const semanticConfig = semanticLabels[label]

  if (blocking) {
    button.setAttribute(
      'data-title',
      `${semanticConfig.text} (blocking): ${semanticConfig.description}`
    )
    button.setAttribute('alt', `${semanticConfig.text} (blocking): ${semanticConfig.description}`)
    button.classList.add(classes.bbcc.blocking)
  } else {
    button.setAttribute(
      'data-title',
      `${semanticConfig.text} (non-blocking): ${semanticConfig.description}`
    )
    button.setAttribute(
      'alt',
      `${semanticConfig.text} (non-blocking): ${semanticConfig.description}`
    )
  }

  button.addEventListener('click', handleClick)
  button.classList.add(classes.bbcc.button)
  svgWrapper.innerHTML = semanticConfig.icon
  container.appendChild(buttonWrapper)
}

const createButtonPair = ({ contentEditable, toolbar, ccToolbar, label }) => {
  const container = document.createElement('div')
  container.classList.add(classes.bbcc.container)
  createButton({ contentEditable, toolbar, container, label, blocking: false })

  if (semanticLabels[label].hasBlockingOption) {
    container.classList.add(classes.bbcc.hasBlocking)
    createButton({ contentEditable, toolbar, container, label, blocking: true })
  }

  const unsubscribe = state.subscribe(label, (shouldShow = true) => {
    if (!container.isConnected) {
      unsubscribe()
    } else if (shouldShow) {
      container.style.display = 'block'
    } else {
      container.style.display = 'none'
    }
  })

  ccToolbar.appendChild(container)
}

const createCCToolbar = ({ controls, editorWrapper, cancelButton, nonCancelButtons }) => {
  const ccToolbar = document.createElement('div')
  ccToolbar.id = ids.ccToolbar
  editorWrapper.insertBefore(ccToolbar, controls)
  if (cancelButton) cancelButton.onclick = () => ccToolbar.remove()
  if (nonCancelButtons)
    nonCancelButtons.forEach((el) => el.addEventListener('click', () => ccToolbar.remove()))

  return ccToolbar
}

const showHideDecoratorList = (shouldShow) => {
  if (shouldShow) {
    listDecoratorElement.style.display = 'flex'
  } else {
    listDecoratorElement.style.display = 'none'
  }
}

const addSemanticButtons = async (contentEditable) => {
  const childEditorWrapper = contentEditable.closest(selectors.editorWrapper)
  const editorWrapper = childEditorWrapper.parentElement
  const controls = editorWrapper.querySelector(selectors.controls)
  const toolbar = editorWrapper.querySelector(selectors.toolbar)
  const cancelButton = editorWrapper.querySelector(selectors.cancelButton)
  const nonCancelButtons = controls.querySelectorAll(selectors.nonCancelButton)
  const ccToolbar = createCCToolbar({ controls, editorWrapper, cancelButton, nonCancelButtons })
  Object.keys(semanticLabels).forEach((label) => {
    createButtonPair({ contentEditable, toolbar, ccToolbar, label })
  })

  const listDecorator = (await state.get(DECORATORS_LIST_ID)) || LIST_DECORATORS.join(',');
  ccToolbar.appendChild(createCheckboxList(listDecorator?.split(','), contentEditable));

  warnAboutUnconventionalComments({ controls, contentEditable })
}

const createCheckbox = (decorator, contentEditable) => {
  let listItem = document.createElement('li')
  listItem.classList.add('checkbox-item')

  let checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.value = decorator
  checkbox.id = decorator + '_checkbox'
  checkbox.checked = hasDecorator(decorator)
  checkbox.addEventListener('change', async function () {
    if (this.checked) {
      addDecorator(decorator)
    } else {
      removeDecorator(decorator)
    }
    await updateConventionCommentOnTextBox(contentEditable)
  })

  let label = document.createElement('label')
  label.htmlFor = decorator + '_checkbox'
  label.innerHTML = decorator

  listItem.appendChild(checkbox)
  listItem.appendChild(label)

  return listItem
}

const createCheckboxList = (lists, contentEditable) => {
  listDecoratorElement = document.createElement('ul')
  listDecoratorElement.classList.add('checkbox-list')

  const currentComment = getConventionalCommentPart(contentEditable.innerText)
  if (currentComment && currentComment.at(2)) {
    curentLabel = currentComment.at(2)
    currentComment?.at(3)?.split(',')?.forEach(addDecorator)
  }
  let textElement = createLabelElement(curentLabel)
  textElement.addEventListener('click', async function () {
    await updateConventionCommentOnTextBox(contentEditable)
  })
  listDecoratorElement.appendChild(textElement)

  listDecoratorElement.appendChild(document.createTextNode('('))
  lists.forEach(function (item, index) {
    let checkbox = createCheckbox(item, contentEditable)
    listDecoratorElement.appendChild(checkbox)
    if (index < lists.length - 1) {
      listDecoratorElement.appendChild(document.createTextNode(', '))
    }
  })
  listDecoratorElement.appendChild(document.createTextNode(')'))

  const unsubscribe = state.subscribe(DECORATORS_SELECTOR, (shouldShow = true) => {
    if (!listDecoratorElement.isConnected) {
      unsubscribe()
    } else {
      showHideDecoratorList(shouldShow)
    }
  })

  return listDecoratorElement
}

const createLabelElement = (text) => {
  LabelTextElement = document.createElement('p')
  LabelTextElement.textContent = text

  return LabelTextElement
}

function handleDecoratorsExceptions(decorator) {
  switch (decorator) {
    case 'blocking':
      removeDecorator('non-blocking')
      break
    case 'non-blocking':
      removeDecorator('blocking')
      break
  }
}

const addDecorator = (decorator) => {
  if (!hasDecorator(decorator)) {
    decoratorsList.push(decorator)
    updateCheckbox(decorator, true)
  }
  handleDecoratorsExceptions(decorator)
}

const hasDecorator = (decorator) => !!decoratorsList.includes(decorator)

const removeDecorator = (decorator) => {
  if (hasDecorator(decorator)) {
    decoratorsList.splice(decoratorsList.indexOf(decorator), 1)
    updateCheckbox(decorator, false)
  }
}

const getDecorators = () => {
  return decoratorsList.length > 0
    ? ` (${decoratorsList
        .sort((a, b) => LIST_DECORATORS.indexOf(a) - LIST_DECORATORS.indexOf(b))
        .join(',')})`
    : ''
}

const clearDecoratorsList = () => {
  decoratorsList.forEach((decorator) => updateCheckbox(decorator, false))
  decoratorsList.length = 0
}

const updateCheckbox = (decorator, checked) => {
  let checkbox = document.getElementById(decorator + '_checkbox')
  if (checkbox) {
    checkbox.checked = checked
  }
}

export const run = () => {
  document.querySelectorAll(selectors.uninitializedEditable).forEach((contentEditable) => {
    contentEditable.dataset.semanticButtonInitialized = 'true'
    addSemanticButtons(contentEditable)
  })
  setTimeout(run, 300)
}
