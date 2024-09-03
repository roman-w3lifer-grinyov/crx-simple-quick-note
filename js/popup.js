
/* global chrome */

window.addEventListener('DOMContentLoaded', _ => {

  const textarea = document.querySelector('textarea')
  const copyButton = document.getElementById('copy-button')
  const cutButton = document.getElementById('cut-button')
  const resetButton = document.getElementById('reset-button')
  const totalNumberOfCharactersElement = document.getElementById('total-number-of-characters')
  const lengthOfSelectedTextElement = document.getElementById('length-of-selected-text')
  const notificationElement = document.getElementById('notification')

  chrome.storage.sync.get(storage => {
    const height = storage.textareaHeight || app.textareaHeight
    const width = storage.textareaWidth || app.textareaWidth
    textarea.style.height = height + 'px'
    textarea.style.width = width + 'px'
    if (storage.note) {
      textarea.value = storage.note
    }
    totalNumberOfCharactersElement.textContent = '' + textarea.value.length
    lengthOfSelectedTextElement.textContent = '0'
  })

  textarea.addEventListener('input', e => {
    chrome.storage.sync.set({'note': e.target.value})
    totalNumberOfCharactersElement.textContent = e.target.value.length
    chrome.action.setBadgeText({'text': e.target.value ? '' + e.target.value.length : ''})
  })

  copyButton.addEventListener('click', _ => {
    copyTextToClipboard(textarea.value)
    showNotification('Done!')
  })

  cutButton.addEventListener('click', _ => {
    copyTextToClipboard(textarea.value)
    clearNote()
    showNotification('Done!')
  })

  resetButton.addEventListener('click', _ => {
    if (confirm('Your note will be deleted!')) {
      clearNote()
      showNotification('Done!')
    }

  })

  textarea.addEventListener('selectionchange', _ =>
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
    totalNumberOfCharactersElement.textContent = '0'
    chrome.action.setBadgeText({'text': ''})
    chrome.storage.sync.set({note: ''})
  }

  function showNotification(text) {
    notificationElement.textContent = text
    notificationElement.style.visibility = 'visible'
    setTimeout(_ => notificationElement.style.visibility = 'hidden', 1000)
  }

})
