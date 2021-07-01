import * as icons from './icons.js'

export const semanticLabels = {
  praise: {
    text: 'praise',
    icon: icons.trophyIcon,
    hasBlockingOption: false,
  },
  nitpick: {
    text: 'nitpick',
    icon: icons.searchIcon,
    hasBlockingOption: true,
  },
  suggestion: {
    text: 'suggestion',
    icon: icons.exclamationIcon,
    hasBlockingOption: true,
  },
  issue: {
    text: 'issue',
    icon: icons.bugIcon,
    hasBlockingOption: true,
  },
  question: {
    text: 'question',
    icon: icons.questionIcon,
    hasBlockingOption: true,
  },
  thought: {
    text: 'thought',
    icon: icons.commentIcon,
    hasBlockingOption: false,
  },
  chore: {
    text: 'chore',
    icon: icons.homeIcon,
    hasBlockingOption: true,
  },
}
