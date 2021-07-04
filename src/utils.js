import { semanticLabels } from './labels.js'

const validPrefixes = Object.values(semanticLabels).flatMap(({ text }) => [
  `**${text}:** `,
  `**${text} (non-blocking):** `,
])

export const getConventionalCommentPrefix = (comment) => {
  for (const validPrefix of validPrefixes) {
    if (comment.startsWith(validPrefix)) {
      return validPrefix
    }
  }
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
  const span = contentEditable.querySelector('pre span.cm-m-markdown.cm-strong')
  if (span.innerText !== text) {
    return
  }
  const textNode = _findTextNode(span.childNodes)
  const range = document.createRange()
  const selection = window.getSelection()
  range.selectNode(textNode)
  selection.removeAllRanges()
  selection.addRange(range)
}

export const setCursorPosition = (contentEditable, position) => {
  const { textNode, offset } = _getTextNodeOffset(contentEditable, position)
  const range = document.createRange()
  const selection = window.getSelection()
  range.setStart(textNode, offset)
  range.collapse(true)
  selection.removeAllRanges()
  selection.addRange(range)
}

const _getTextNodeOffset = (contentEditable, position) => {
  const spans = contentEditable.querySelectorAll('pre span.cm-m-markdown')
  const spanIndex = position === 'end' ? spans.length - 1 : 0
  const span = spans[spanIndex]
  const childNodes = (span || contentEditable.querySelector('pre')).childNodes
  const textNode = _findTextNode(childNodes)
  const offset = position === 'start' ? 0 : textNode.length

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
