
/* global chrome */

window.addEventListener('DOMContentLoaded', _ => {

  const app = {
    // https://is.gd/wPguEm
    // 360 - 8 * 2 (body margins) - 2 * 2 (textarea paddings) - 1 * 2 (textarea border)
    maxTextareaHeight: '438',
    maxTextareaWidth: '700',
    minTextareaHeight: '16',
    minTextareaWidth: '338',
    textareaHeight: '338',
    textareaWidth: '338',
    sidePanelMode: false,
    currentMode: 'popup',
  }

  const textarea = document.querySelector('textarea')
  // Control panel container
  const totalNumberOfCharactersElement = document.getElementById('total-number-of-characters')
  const resetButton = document.getElementById('reset-button')
  const cutButton = document.getElementById('cut-button')
  const copyButton = document.getElementById('copy-button')
  // Footer container
  const lengthOfSelectedTextElement = document.getElementById('length-of-selected-text')
  const notificationElement = document.getElementById('notification')
  // Options
  const optionsLink = document.getElementById('options-link')
  const optionsContainer = document.getElementById('options-container')
  const textareaHeightElement = document.getElementById('textarea-height')
  const textareaWidthElement = document.getElementById('textarea-width')
  const sidePanelModeElement = document.getElementById('side-panel-mode')

  chrome.storage.sync.get(storage => {

    let height = app.textareaHeight
    if (storage.textareaHeight) {
      if (storage.textareaHeight < app.minTextareaHeight) {
        height = textareaHeightElement.value = app.minTextareaHeight
        chrome.storage.sync.set({textareaHeight: app.minTextareaHeight})
      } else if (storage.textareaHeight > app.maxTextareaHeight) {
        height = textareaHeightElement.value = app.maxTextareaHeight
          chrome.storage.sync.set({textareaHeight: app.maxTextareaHeight})
      } else {
        height = textareaHeightElement.value = storage.textareaHeight
      }
    }

    let width = app.textareaWidth
    if (storage.currentMode === 'sidePanel') {
      app.maxTextareaWidth = app.textareaWidth
      textarea.style.maxWidth = app.textareaWidth + 'px'
      textareaWidthElement.value = app.textareaWidth
      textareaWidthElement.disabled = true
    } else {
      if (storage.textareaWidth) {
        if (storage.textareaWidth < app.minTextareaWidth) {
          width = textareaWidthElement.value = app.minTextareaWidth
          chrome.storage.sync.set({textareaWidth: app.minTextareaWidth})
        } else if (storage.textareaWidth > app.maxTextareaWidth) {
          width = textareaWidthElement.value = app.maxTextareaWidth
          chrome.storage.sync.set({textareaWidth: app.maxTextareaWidth})
        } else {
          width = textareaWidthElement.value = storage.textareaWidth
        }
      }
    }

    textarea.style.height = height + 'px'
    textarea.style.width = width + 'px'

    if (storage.note) {
      textarea.value = storage.note
    }
    totalNumberOfCharactersElement.textContent = '' + textarea.value.length
    lengthOfSelectedTextElement.textContent = '0'

    sidePanelModeElement.checked = storage.sidePanelMode

  })

  textarea.addEventListener('input', e => {
    totalNumberOfCharactersElement.textContent = e.target.value.length
    chrome.action.setBadgeText({'text': e.target.value ? '' + e.target.value.length : ''})
    chrome.storage.sync.set({'note': e.target.value})
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

  function copyTextToClipboard(text)
  {
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }

  function clearNote()
  {
    textarea.value = ''
    totalNumberOfCharactersElement.textContent = '0'
    chrome.action.setBadgeText({'text': ''})
    chrome.storage.sync.set({note: ''})
  }

  function showNotification(text)
  {
    notificationElement.textContent = text
    notificationElement.style.visibility = 'visible'
    setTimeout(_ => notificationElement.style.visibility = 'hidden', 1000)
  }

  textarea.addEventListener('selectionchange', _ =>
    lengthOfSelectedTextElement.textContent = '' + document.getSelection().toString().length
  )

  /*
   * ===================================================================================================================
   * OPTIONS
   * ===================================================================================================================
   */

  const showOptionText = 'Show options'
  const hideOptionText = 'Hide options'
  optionsLink.textContent = showOptionText
  optionsLink.addEventListener('click', e => {
    e.preventDefault()
    if (optionsContainer.classList.toggle('hidden')) {
      optionsLink.textContent = showOptionText
    } else {
      optionsLink.textContent = hideOptionText
    }
  })

  chrome.storage.local.get(null, storage => {
    if (storage.openOptions) {
      optionsLink.click()
      chrome.storage.local.set({openOptions: false})
    }
  })

  textareaHeightElement.addEventListener('input', e => {
    textarea.style.height = e.target.value + 'px'
    chrome.storage.sync.set({textareaHeight: e.target.value})
  })

  textareaWidthElement.addEventListener('input', e => {
    textarea.style.width = e.target.value + 'px'
    chrome.storage.sync.set({textareaWidth: e.target.value})
  })

  sidePanelModeElement.addEventListener('change', e => {
    chrome.storage.local.set({openOptions: true})
    chrome.storage.sync.set({sidePanelMode: e.target.checked})
    if (e.target.checked) {
      chrome.storage.sync.set({currentMode: 'sidePanel'})
      close()
      chrome.tabs.query({active: true, currentWindow: true}, tabs => chrome.sidePanel.open({tabId: tabs[0].id}))
      chrome.sidePanel.setPanelBehavior({openPanelOnActionClick: true})
    } else {
      chrome.storage.sync.set({currentMode: 'popup'})
      close()
      chrome.sidePanel.setPanelBehavior({openPanelOnActionClick: false})
      chrome.action.openPopup()
    }
  })

})
