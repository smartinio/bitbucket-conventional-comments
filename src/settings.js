export const UNCONVENTIONAL_WARNING = 'unconventionalWarning'

export const  DECORATORS_SELECTOR = 'decoratorSelector';
export const settings = {
  [UNCONVENTIONAL_WARNING]: {
    description: 'Warn before sending unconventional comment',
    defaultValue: true,
  },
  [DECORATORS_SELECTOR]: {
    description: 'Display decorators selectors',
    defaultValue: true,
  },
}


export const LIST_DECORATORS = ['non-blocking', 'blocking', 'if-minor', 'todo-later', 'test', 'ui'];
