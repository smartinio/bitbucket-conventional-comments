import { semanticLabels } from './labels.js'
import { selectors, classes, ids } from './selectors.js'
import { state } from './state.js'
import {
  copyToClipboard,
  setCursorPosition,
  getConventionalCommentPrefix,
  createClipboardReset,
  selectMatchingTextNode,
} from './utils.js'
import { warnAboutUnconventionalComments } from './features/warnAboutUnconventionalComments.js'

const createClickHandler = ({ contentEditable, label, blocking }) => {
  return async (e) => {
    e.preventDefault()
    const semanticConfig = semanticLabels[label]
    const decoration = blocking || !semanticConfig.hasBlockingOption ? '' : ' (non-blocking)'
    const semanticComment = `**${semanticConfig.text}${decoration}:** `
    const currentPrefix = getConventionalCommentPrefix(contentEditable.innerText)
    const resetClipboard = await createClipboardReset()

    if (currentPrefix) {
      // trimming because the existing textNode in the DOM does not contain the space
      selectMatchingTextNode(contentEditable, currentPrefix.trim())
      await copyToClipboard(semanticComment.trim())
    } else {
      setCursorPosition(contentEditable, 'start')
      await copyToClipboard(semanticComment)
    }

    document.execCommand('paste')
    setCursorPosition(contentEditable, 'end')
    await resetClipboard()
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
    button.title = `${semanticConfig.text} (blocking)`
    button.classList.add(classes.bbcc.blocking)
  } else {
    button.title = semanticConfig.text
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
      container.style.display = 'flex'
    } else {
      container.style.display = 'none'
    }
  })

  ccToolbar.appendChild(container)
}

const createCCToolbar = ({ controls, editorWrapper, cancelButton }) => {
  const ccToolbar = document.createElement('div')
  ccToolbar.id = ids.ccToolbar
  editorWrapper.insertBefore(ccToolbar, controls)
  cancelButton.onclick = () => ccToolbar.remove()
  return ccToolbar
}

const addSemanticButtons = (contentEditable) => {
  const editorWrapper = contentEditable.closest(selectors.editorWrapper)
  const controls = editorWrapper.querySelector(selectors.controls)
  const toolbar = editorWrapper.querySelector(selectors.toolbar)
  const cancelButton = editorWrapper.querySelector(selectors.cancelButton)
  const ccToolbar = createCCToolbar({ controls, editorWrapper, cancelButton })
  Object.keys(semanticLabels).forEach((label) => {
    createButtonPair({ contentEditable, toolbar, ccToolbar, label })
  })
  warnAboutUnconventionalComments({ controls, contentEditable })
}

export const run = () => {
  document.querySelectorAll(selectors.uninitializedEditable).forEach((contentEditable) => {
    contentEditable.dataset.semanticButtonInitialized = 'true'
    addSemanticButtons(contentEditable)
  })
  setTimeout(run, 300)
}
