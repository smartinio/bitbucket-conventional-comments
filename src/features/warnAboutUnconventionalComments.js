import { state } from '../state.js'
import { UNCONVENTIONAL_WARNING } from '../settings.js'
import { selectors, classes } from '../selectors.js'
import { getConventionalCommentPrefix } from '../utils.js'

export const warnAboutUnconventionalComments = ({ controls, contentEditable }) => {
  const editor = contentEditable.closest(selectors.editor)

  if (editor.classList.contains(classes.bitbucket.reply)) {
    return // don't warn on replies
  }

  if (editor.classList.contains(classes.bitbucket.edit)) {
    return // don't warn on edits
  }

  const nonCancelButtons = controls.querySelectorAll(selectors.nonCancelButton)

  const handleClick = (e) => {
    const hasConventionalCommentPrefix = !!getConventionalCommentPrefix(contentEditable.innerText)
    if (
      !hasConventionalCommentPrefix &&
      !confirm('Missing or invalid conventional comment prefix. Send anyway?')
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
