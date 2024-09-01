/* global chrome */

chrome.runtime.onInstalled.addListener(
  _ => chrome.storage.sync.get(
    null,
    storage => chrome.action.setBadgeText({'text': storage.note && '' + storage.note.length})
  )
)
