/* global chrome */

window.addEventListener('DOMContentLoaded', _ => {

  const textarea = document.querySelector('textarea')
  const copyButton = document.getElementById('copy-button')
  const cutButton = document.getElementById('cut-button')
  const resetButton = document.getElementById('reset-button')
  const totalLengthOfTextElement = document.getElementById('total-length-of-text')
  const lengthOfSelectedTextElement = document.getElementById('length-of-selected-text')

  chrome.storage.sync.get(storage => {
    const height = storage.textareaHeight || app.textareaHeight
    const width = storage.textareaWidth || app.textareaWidth
    textarea.style.height = height + 'px'
    textarea.style.width = width + 'px'
    if (storage.note) {
      textarea.value = storage.note
    }
    totalLengthOfTextElement.textContent = '' + textarea.value.length
    lengthOfSelectedTextElement.textContent = '0'
  })

  textarea.addEventListener('input', e => {
    chrome.storage.sync.set({'note': e.target.value})
    totalLengthOfTextElement.textContent = e.target.value.length
    chrome.action.setBadgeText({'text': e.target.value ? '' + e.target.value.length : ''})
  })

  copyButton.addEventListener('click', _ => copyTextToClipboard(textarea.value))

  cutButton.addEventListener('click', _ => {
    copyTextToClipboard(textarea.value)
    clearNote()
  })

  resetButton.addEventListener('click', _ => confirm('Your note will be deleted!') && clearNote())

  document.addEventListener('selectionchange', _ =>
    lengthOfSelectedTextElement.textContent = '' + document.getSelection().toString().length
  )

  function copyTextToClipboard(text) {
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }

  function clearNote() {
    textarea.value = ''
    totalLengthOfTextElement.textContent = '0'
    chrome.action.setBadgeText({'text': ''})
    chrome.storage.sync.set({note: ''})
  }

})
