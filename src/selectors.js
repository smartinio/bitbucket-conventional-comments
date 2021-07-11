export const ids = {
  ccToolbar: 'bbcc-toolbar'  
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
    hasBlocking: 'bbcc-has-blocking'
  }
}

export const selectors = {
  editor: 'div.comment-editor',
  editorWrapper: 'div.comment-editor-wrapper',
  toolbar: 'div.editor-toolbar-primary',
  controls: 'div.editor-controls',
  uninitializedEditable: `div.editor div[contenteditable='true']:not([data-semantic-button-initialized])`,
  nonCancelButton: 'button:not(.comment-editor-cancel)',
}
