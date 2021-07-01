import { state } from '../state.js'
import { UNCONVENTIONAL_WARNING } from '../settings.js'
import { semanticLabels } from '../labels.js'
import { selectors, classes } from '../selectors.js'

const validPrefixes = Object.values(semanticLabels).flatMap(({ text }) => [
  `**${text}:** `,
  `**${text} (non-blocking):** `,
])

const hasConventionalCommentPrefix = (comment) => {
  for (const validPrefix of validPrefixes) {
    if (comment.startsWith(validPrefix)) {
      return true
    }
  }
  return false
}

export const warnAboutUnconventionalComments = ({ controls, contentEditable }) => {
  const editor = contentEditable.closest(selectors.editor)
  
  if (editor.classList.contains(classes.bitbucket.reply)) {
    return // don't warn on replies
  }
  
  const nonCancelButtons = controls.querySelectorAll(selectors.nonCancelButton)

  const handleClick = (e) => {
    if (
      !hasConventionalCommentPrefix(contentEditable.innerText) &&
      !confirm('Missing conventional comment prefix. Send anyway?')
    ) {
      e.stopImmediatePropagation()
    }
  }

  const unsubscribe = state.subscribe(UNCONVENTIONAL_WARNING, (enabled = true) => {
    if (!controls.isConnected) {
      unsubscribe()
    } else if (enabled) {
      nonCancelButtons.forEach((el) => el.addEventListener('click', handleClick))
    } else {
      nonCancelButtons.forEach((el) => el.removeEventListener('click', handleClick))
    }
  })
}
