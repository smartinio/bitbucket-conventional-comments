import { semanticLabels } from './labels.js'
import { selectors, classes, ids } from './selectors.js'
import { state } from './state.js'
import {
  copyToClipboard,
  setCursorPosition,
  getConventionalCommentPrefix,
  createClipboardReset,
  selectMatchingTextNode,
} from './utils.js'
import { warnAboutUnconventionalComments } from './features/warnAboutUnconventionalComments.js'

let LabelTextElement;
let curentLabel;
const decoratorsList = [];
const LIST_DECORATORS = ['non-blocking', 'blocking', 'if-minor', 'test', 'ui'];

async function updateConventionCommentOnTextBox(contentEditable) {
  const semanticConfig = semanticLabels[curentLabel]
  if (!semanticConfig) {
    return;
  }
  const semanticComment = `**${semanticConfig.text}${getDecorators()}:** `
  const currentPrefix = getConventionalCommentPrefix(contentEditable.innerText)
  const resetClipboard = await createClipboardReset()

  if (currentPrefix) {
    // trimming because the existing textNode in the DOM does not contain the space
    selectMatchingTextNode(contentEditable, currentPrefix.trim())
    await copyToClipboard(semanticComment.trim())
  } else {
    setCursorPosition(contentEditable, 'start')
    await copyToClipboard(semanticComment)
  }

  document.execCommand('paste')
  setCursorPosition(contentEditable, 'end')
  await resetClipboard();
}

const createClickHandler = ({ contentEditable, label, blocking }) => {
  return async (e) => {
    e.preventDefault()
    updateCurentLabel(label);
    const semanticConfig = semanticLabels[curentLabel];
    addDecorator(blocking || !semanticConfig.hasBlockingOption ? 'blocking' : 'non-blocking');


    await updateConventionCommentOnTextBox(contentEditable);
  }
}

const createButtonWrapper = (toolbar) => {
  const buttonWrapper = toolbar.children[0].cloneNode(true)
  buttonWrapper.querySelector('input[type=file]')?.remove()
  return buttonWrapper
}

const createButton = ({ contentEditable, toolbar, container, label, blocking }) => {
  const handleClick = createClickHandler({ contentEditable, label, blocking })
  const buttonWrapper = createButtonWrapper(toolbar)
  const button = buttonWrapper.querySelector('button')
  const svgWrapper = button.querySelector('svg').parentElement
  const semanticConfig = semanticLabels[label]

  if (blocking) {
    button.setAttribute('data-title', `${semanticConfig.text}: ${semanticConfig.description}`);
    button.setAttribute('alt', `${semanticConfig.text}: ${semanticConfig.description}`);
    button.classList.add(classes.bbcc.blocking)
  } else {
    button.setAttribute('data-title', `${semanticConfig.text} (non-blocking): ${semanticConfig.description}`);
    button.setAttribute('alt', `${semanticConfig.text} (non-blocking): ${semanticConfig.description}`);
  }

  button.addEventListener('click', handleClick)
  button.classList.add(classes.bbcc.button)
  svgWrapper.innerHTML = semanticConfig.icon
  container.appendChild(buttonWrapper)
}

const createButtonPair = ({ contentEditable, toolbar, ccToolbar, label }) => {
  const container = document.createElement('div')
  container.classList.add(classes.bbcc.container)
  createButton({ contentEditable, toolbar, container, label, blocking: false })

  if (semanticLabels[label].hasBlockingOption) {
    container.classList.add(classes.bbcc.hasBlocking)
    createButton({ contentEditable, toolbar, container, label, blocking: true })
  }

  const unsubscribe = state.subscribe(label, (shouldShow = true) => {
    if (!container.isConnected) {
      unsubscribe()
    } else if (shouldShow) {
      container.style.display = 'block'
    } else {
      container.style.display = 'none'
    }
  })

  ccToolbar.appendChild(container)
}

const createCCToolbar = ({ controls, editorWrapper, cancelButton, nonCancelButtons }) => {
  const ccToolbar = document.createElement('div')
  ccToolbar.id = ids.ccToolbar
  editorWrapper.insertBefore(ccToolbar, controls)
  if (cancelButton) cancelButton.onclick = () => ccToolbar.remove();
  if (nonCancelButtons) nonCancelButtons.forEach((el) => el.addEventListener('click', () => ccToolbar.remove()))

  return ccToolbar
}


const addSemanticButtons = (contentEditable) => {
  const editorWrapper = contentEditable.closest(selectors.editorWrapper)
  const controls = editorWrapper.querySelector(selectors.controls)
  const toolbar = editorWrapper.querySelector(selectors.toolbar)
  const cancelButton = editorWrapper.querySelector(selectors.cancelButton)
  const nonCancelButtons = controls.querySelectorAll(selectors.nonCancelButton)
  const ccToolbar = createCCToolbar({ controls, editorWrapper, cancelButton, nonCancelButtons })
  Object.keys(semanticLabels).forEach((label) => {
    createButtonPair({ contentEditable, toolbar, ccToolbar, label })
  });

  ccToolbar.appendChild(createCheckboxList(LIST_DECORATORS, contentEditable))
  warnAboutUnconventionalComments({ controls, contentEditable })
}

const createCheckbox = (decorator,contentEditable)  => {
  let listItem = document.createElement("li");
  listItem.classList.add("checkbox-item");

  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.value = decorator;
  checkbox.id = decorator + "_checkbox";
  checkbox.addEventListener("change", async function () {
    if (this.checked) {
      addDecorator(decorator);
    } else {
      removeDecorator(decorator);
    }
    await updateConventionCommentOnTextBox(contentEditable)
  });

  let label = document.createElement("label");
  label.htmlFor = decorator + "_checkbox";
  label.innerHTML = decorator;

  listItem.appendChild(checkbox);
  listItem.appendChild(label);

  return listItem;
};

const createCheckboxList = (item, contentEditable) => {
  let list = document.createElement("ul");
  list.classList.add("checkbox-list");

  let textElement = createLabelElement("Label");
  list.appendChild(textElement);

  list.appendChild(document.createTextNode("("));
  LIST_DECORATORS.forEach(function(item, index) {
    let checkbox = createCheckbox(item, contentEditable);
    list.appendChild(checkbox);
    if (index < LIST_DECORATORS.length - 1) {
      list.appendChild(document.createTextNode(", "));
    }
  });
  list.appendChild(document.createTextNode(")"));

  return list;
};


const createLabelElement = text => {
  LabelTextElement = document.createElement("p");
  LabelTextElement.textContent = text;
  return LabelTextElement;
};

const updateCurentLabel = (label) => {
  curentLabel = label;
  clearDecoratorsList();
  LabelTextElement.textContent = label;
};

function handleDecoratorsExceptions(decorator) {
  switch (decorator) {
    case 'blocking':
      removeDecorator('non-blocking');
      break;
    case 'non-blocking':
      removeDecorator('blocking');
      break;
  }
}

const addDecorator = (decorator) => {
  if (!decoratorsList.includes(decorator)) {
    decoratorsList.push(decorator);
    updateCheckbox(decorator, true);
  }
  handleDecoratorsExceptions(decorator);
};



const removeDecorator = (decorator) => {
  if (decoratorsList.includes(decorator)) {
    decoratorsList.splice(decoratorsList.indexOf(decorator), 1);
    updateCheckbox(decorator, false);
  }
};

const getDecorators = () => {
  return decoratorsList.length > 0 ? ` (${decoratorsList.sort((a, b) => LIST_DECORATORS.indexOf(a) - LIST_DECORATORS.indexOf(b)).join(',')})` : '';
};

const clearDecoratorsList = () => {
  decoratorsList.forEach(decorator => updateCheckbox(decorator, false))
  decoratorsList.length = 0;
};

const updateCheckbox = (decorator, checked) => {
  let checkbox = document.getElementById(decorator + "_checkbox");
  if (checkbox) {
    checkbox.checked = checked;
  }
};


export const run = () => {
  document.querySelectorAll(selectors.uninitializedEditable).forEach((contentEditable) => {
    contentEditable.dataset.semanticButtonInitialized = 'true'
    addSemanticButtons(contentEditable)
  })
  setTimeout(run, 300)
}
