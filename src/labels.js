import * as icons from './icons.js'

export const semanticLabels = {
  praise: {
    text: 'praise',
    description:
      'Praises highlight something positive. Try to leave at least one of these comments per review. Do not leave false praise (which can actually be damaging). Do look for something to sincerely praise.',
    icon: icons.trophyIcon,
    hasBlockingOption: false,
    defaultValue: true,
  },
  nitpick: {
    text: 'nitpick',
    description:
      'Nitpicks are trivial preference-based requests. These should be non-blocking by nature.',
    icon: icons.searchIcon,
    hasBlockingOption: false,
    defaultValue: true,
  },
  suggestion: {
    text: 'suggestion',
    description:
      "Suggestions propose improvements to the current subject. It's important to be explicit and clear on what is being suggested and why it is an improvement. Consider using patches and the blocking or non-blocking decorations to further communicate your intent.",
    icon: icons.exclamationIcon,
    hasBlockingOption: true,
    defaultValue: true,
  },
  issue: {
    text: 'issue',
    description:
      'Issues highlight specific problems with the subject under review. These problems can be user-facing or behind the scenes. It is strongly recommended to pair this comment with a suggestion. If you are not sure if a problem exists or not, consider leaving a question.',
    icon: icons.bugIcon,
    hasBlockingOption: true,
    defaultValue: true,
  },
  todo: {
    text: 'todo',
    description:
      "TODO's are small, trivial, but necessary changes. Distinguishing todo comments from issues: or suggestions: helps direct the reader's attention to comments requiring more involvement.",
    icon: icons.todoIcon,
    hasBlockingOption: true,
    defaultValue: true,
  },
  question: {
    text: 'question',
    description:
      "Questions are appropriate if you have a potential concern but are not quite sure if it's relevant or not. Asking the author for clarification or investigation can lead to a quick resolution.",
    icon: icons.questionIcon,
    hasBlockingOption: true,
    defaultValue: true,
  },
  thought: {
    text: 'thought',
    description:
      'Thoughts represent an idea that popped up from reviewing. These comments are non-blocking by nature, but they are extremely valuable and can lead to more focused initiatives and mentoring opportunities.',
    icon: icons.commentIcon,
    hasBlockingOption: false,
    defaultValue: true,
  },
  chore: {
    text: 'chore',
    description:
      'Chores are simple tasks that must be done before the subject can be “officially” accepted. Usually, these comments reference some common process. Try to leave a link to the process description so that the reader knows how to resolve the chore.',
    icon: icons.homeIcon,
    hasBlockingOption: true,
    defaultValue: true,
  },
  note: {
    text: 'note',
    description:
      'Notes are always non-blocking and simply highlight something the reader should take note of.',
    icon: icons.noteIcon,
    hasBlockingOption: false,
    defaultValue: true,
  },
  typo: {
    text: 'typo',
    description: 'Typo comments are like todo:, where the main issue is a mispelling.',
    icon: icons.typoIcon,
    hasBlockingOption: false,
    defaultValue: false,
  },
  polish: {
    text: 'polish',
    description:
      "Polish comments are like a suggestion, where there is nothing necessarily wrong with the relevant content, there's just some ways to immediately improve the quality.",
    icon: icons.polishIcon,
    hasBlockingOption: true,
    defaultValue: false,
  },
  quibble: {
    text: 'quibble',
    description:
      'Quibbles are very much like nitpick:, except it does not conjure up images of lice and animal hygiene practices.',
    icon: icons.quibbleIcon,
    hasBlockingOption: false,
    defaultValue: false,
  },
}
