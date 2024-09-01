/* global chrome */

window.addEventListener('DOMContentLoaded', _ => {

  const textareaHeightElement = document.getElementById('textarea-height')
  const textareaWidthElement = document.getElementById('textarea-width')

  chrome.storage.sync.get(null, storage => {
    const height = storage.textareaHeight || app.textareaHeight
    const width = storage.textareaWidth || app.textareaWidth
    textareaHeightElement.value = height
    textareaWidthElement.value = width
  })

  textareaHeightElement.addEventListener('input', e => chrome.storage.sync.set({textareaHeight: e.target.value}))
  textareaWidthElement.addEventListener('input', e => chrome.storage.sync.set({textareaWidth: e.target.value}))

  document.getElementById('close-button').addEventListener('click', _ => close())

})
