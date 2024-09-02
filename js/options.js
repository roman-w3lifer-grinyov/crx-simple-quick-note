/* global chrome */

window.addEventListener('DOMContentLoaded', _ => {

  const textareaHeightElement = document.getElementById('textarea-height')
  const textareaWidthElement = document.getElementById('textarea-width')
  const sidePanelModeElement = document.getElementById('side-panel-mode')

  chrome.storage.sync.get(null, storage => {
    textareaHeightElement.value = storage.textareaHeight || app.textareaHeight
    textareaWidthElement.value = storage.textareaWidth || app.textareaWidth
    sidePanelModeElement.checked = storage.sidePanelMode || app.sidePanelMode
  })

  textareaHeightElement.addEventListener('input', e => chrome.storage.sync.set({textareaHeight: e.target.value}))
  textareaWidthElement.addEventListener('input', e => chrome.storage.sync.set({textareaWidth: e.target.value}))
  sidePanelModeElement.addEventListener('change', e => {
    chrome.storage.sync.set({sidePanelMode: e.target.checked})
    e.target.checked
      ? chrome.sidePanel.setPanelBehavior({openPanelOnActionClick: true})
      : chrome.sidePanel.setPanelBehavior({openPanelOnActionClick: false})
  })

  document.getElementById('close-button').addEventListener('click', _ => close())

})
