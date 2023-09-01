export const ids = {
  ccToolbar: 'bbcc-toolbar',
}

export const classes = {
  bitbucket: {
    reply: 'comment-editor-reply',
    edit: 'comment-editor-edit-comment',
  },
  bbcc: {
    blocking: 'bbcc-blocking',
    button: 'bbcc-button',
    container: 'bbcc-container',
    hasBlocking: 'bbcc-has-blocking',
  },
}

export const selectors_server = {
  editor: 'div.comment-editor',
  editorWrapper: 'div.comment-editor-wrapper .editor',
  toolbar: 'div.editor-toolbar-primary',
  controls: 'div.editor-controls',
  uninitializedEditable: `div.editor div[contenteditable='true']:not([data-semantic-button-initialized])`,
  cancelButton: 'button.comment-editor-cancel',
  nonCancelButton: 'button:not(.comment-editor-cancel)',
  selectMatchingText: 'pre span.cm-m-markdown.cm-strong',
  regex: 'pre span.cm-m-markdown.cm-strong',
  textNodeOffset: 'pre span.cm-m-markdown',
  textNodeEmpty: 'pre',
}

export const selectors_cloud = {
  editor: 'div.akEditor',
  editorWrapper: 'div.akEditor',
  toolbar: 'div[data-testid="ak-editor-main-toolbar"] > div[role="toolbar"] > div:last-child',
  controls: 'div[data-testid="ak-editor-secondary-toolbar"]',
  uninitializedEditable: `div[contenteditable='true']:not([data-semantic-button-initialized])`,
  cancelButton:
    'div[data-testid="ak-editor-secondary-toolbar"]  button:not([data-testid="comment-save-button"])',
  nonCancelButton:
    'div[data-testid="ak-editor-secondary-toolbar"]  button[data-testid="comment-save-button"]',
  selectMatchingText: 'p strong',
  regex: 'p strong',
  textNodeOffset: 'p',
  textNodeEmpty: 'p',
}

export const selectors =
  window.location.hostname === 'bitbucket.org' ? selectors_cloud : selectors_server
