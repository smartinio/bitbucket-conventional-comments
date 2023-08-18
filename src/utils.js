import { semanticLabels } from './labels.js'
import { selectors } from './selectors.js'

const labels = Object.values(semanticLabels)
  .map(({ text }) => text)
  .join('|')
const regex = `^((?:\\*\\*)?(${labels})(?:\\s\\((.*)\\))?:(?:\\*\\*)?)(.*)$` // ^\*\*(praise|nitpick|suggestion|issue|todo|question|thought|chore|note)(?:\s?\(([\w\s,]+)\))?:\*\*\s(.*)$

export const getConventionalCommentPart = (comment) => {
  const regexObj = new RegExp(regex, 'gmi')
  return regexObj.exec(comment)
}

export const getConventionalCommentPrefix = (comment) => {
  let regExpExecArray = getConventionalCommentPart(comment)
  return regExpExecArray?.at(1) || ''
}

export const createClipboardReset = async () => {
  let resetClipboard = async () => {}

  const readPermission = await navigator.permissions.query({ name: 'clipboard-read' })
  if (['granted', 'prompt'].includes(readPermission.state)) {
    const previousClipboard = await navigator.clipboard.readText()
    resetClipboard = async () => navigator.clipboard.writeText(previousClipboard)
  }

  return resetClipboard
}

export const copyToClipboard = async (text) => {
  const writePermission = await navigator.permissions.query({ name: 'clipboard-write' })
  if (['granted', 'prompt'].includes(writePermission.state)) {
    await navigator.clipboard.writeText(text)
  } else {
    throw new Error('Failed to copy text: ' + text)
  }
}

export const selectMatchingTextNode = (contentEditable, text) => {
  const span = contentEditable.querySelector(selectors.selectMatchingText)
  if (!span?.innerText?.trim()?.includes(text?.trim())) {
    return false;
  }
  const textNode = _findTextNode(span.childNodes)

  const range = document.createRange()
  const selection = window.getSelection()
  range.selectNode(textNode)
  selection.removeAllRanges()
  selection.addRange(range);
  return true;
}

export const setCursorPosition = (contentEditable, position) => {
  let { textNode, offset } = _getTextNodeOffset(contentEditable, position)
  const range = document.createRange()
  const selection = window.getSelection()
  range.setStart(textNode, offset)
  range.collapse(true)
  selection.removeAllRanges()
  selection.addRange(range)
}

export const setCursorToEnd = (contentEditable) => {
  window.getSelection().selectAllChildren(contentEditable)
  window.getSelection().collapseToEnd()
}

const _getTextNodeOffset = (contentEditable, position) => {
  const spans = contentEditable.querySelectorAll(selectors.textNodeOffset)
  const spanIndex = position === 'end' ? spans.length - 1 : 0
  const span = spans[spanIndex]
  const childNodes = (span || contentEditable.querySelector(selectors.textNodeEmpty))?.childNodes
  let textNode = _findTextNode(childNodes)
  if (!textNode) {
    textNode = contentEditable?.firstChild || contentEditable
  }
  const offset = position === 'start' ? 0 : textNode.length ?? 0

  return { textNode, offset }
}

const _findTextNode = (childNodes) => {
  for (const child of childNodes) {
    if (child.nodeName === '#text') {
      return child
    }
    const node = _findTextNode(child.childNodes)
    if (node) {
      return node
    }
  }
  return null
}
