import * as icons from './icons.js'

export const semanticLabels = {
  praise: {
    text: 'praise',
    description: 'praise',
    icon: icons.trophyIcon,
    hasBlockingOption: false,
  },
  nitpick: {
    text: 'nitpick',
    description: 'nitpick',
    icon: icons.searchIcon,
    hasBlockingOption: false,
  },
  suggestion: {
    text: 'suggestion',
    description: 'suggestion',
    icon: icons.exclamationIcon,
    hasBlockingOption: true,
  },
  issue: {
    text: 'issue',
    description: 'issue',
    icon: icons.bugIcon,
    hasBlockingOption: true,
  },
  todo: {
    text: 'todo',
    description: 'todo',
    icon: icons.todoIcon,
    hasBlockingOption: true,
  },
  question: {
    text: 'question',
    description: 'question',
    icon: icons.questionIcon,
    hasBlockingOption: true,
  },
  thought: {
    text: 'thought',
    description: 'thought',
    icon: icons.commentIcon,
    hasBlockingOption: false,
  },
  chore: {
    text: 'chore',
    description: 'chore',
    icon: icons.homeIcon,
    hasBlockingOption: true,
  },
  note: {
    text: 'note',
    description: 'note',
    icon: icons.noteIcon,
    hasBlockingOption: false,
  },
  typo: {
    text: 'typo',
    description: 'typo',
    icon: icons.typoIcon,
    hasBlockingOption: false,
  },
  polish: {
    text: 'polish',
    description: 'polish',
    icon: icons.polishIcon,
    hasBlockingOption: true,
  },
  quibble: {
    text: 'quibble',
    description: 'quibble',
    icon: icons.quibbleIcon,
    hasBlockingOption: false,
  },
}
