
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
    showNotification('Copied!')
  })

  cutButton.addEventListener('click', _ => {
    copyTextToClipboard(textarea.value)
    clearNote()
  })

  resetButton.addEventListener('click', _ => {
    if (confirm('Your note will be deleted!')) {
      clearNote()
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

  /*
   * ===================================================================================================================
   * OPTIONS
   * ===================================================================================================================
   */

  const optionsLink = document.getElementById('options-link')
  const optionsContainer = document.getElementById('options-container')
  optionsLink.addEventListener('click', _ => {
    if (optionsContainer.classList.toggle('hidden')) {
      optionsLink.textContent = 'Show options'
    } else {
      optionsLink.textContent = 'Hide options'
    }
  })
  chrome.storage.local.get(null, storage => {
    if (storage.openOptions) {
      optionsLink.click()
      chrome.storage.local.set({openOptions: false})
    }
  })

  const textareaHeightElement = document.getElementById('textarea-height')
  const textareaWidthElement = document.getElementById('textarea-width')
  const sidePanelModeElement = document.getElementById('side-panel-mode')

  chrome.storage.sync.get(null, storage => {
    textareaHeightElement.value = storage.textareaHeight || app.textareaHeight
    textareaWidthElement.value = storage.textareaWidth >= 338 ? storage.textareaWidth : app.textareaWidth
    sidePanelModeElement.checked = storage.sidePanelMode || app.sidePanelMode
  })

  textareaHeightElement.addEventListener('input', e => {
    if (e.target.value > 440) {
      e.target.value = 440
    } else if (('' + e.target.value).length === 2 && e.target.value < 16) {
      e.target.value = 16
    }
    textarea.style.height = e.target.value + 'px'
    chrome.storage.sync.set({textareaHeight: e.target.value})
  })
  textareaWidthElement.addEventListener('input', e => {
    if (e.target.value > 700) {
      e.target.value = 700
    } else if (('' + e.target.value).length === 3 && e.target.value < 338) {
      e.target.value = 338
    }
    textarea.style.width = e.target.value + 'px'
    chrome.storage.sync.set({textareaWidth: e.target.value})
  })
  sidePanelModeElement.addEventListener('change', e => {
    chrome.storage.sync.set({sidePanelMode: e.target.checked})
    if (e.target.checked) {
      close()
      chrome.tabs.query({active: true, currentWindow: true}, tabs => chrome.sidePanel.open({tabId: tabs[0].id}))
      chrome.sidePanel.setPanelBehavior({openPanelOnActionClick: true})
    } else {
      close()
      chrome.sidePanel.setPanelBehavior({openPanelOnActionClick: false})
      chrome.action.openPopup()
    }
    chrome.storage.local.set({openOptions: true})
  })

})
