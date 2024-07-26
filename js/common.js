;'use strict';

/* global chrome */

const TEXTAREA =  {
  height: 350,
  width: 350,
};

function setBadge(note) {
  chrome.action.setBadgeText({
    'text': note.length ? String(note.length) : ''
  });
}

chrome.runtime.onInstalled.addListener(
  () => chrome.storage.sync.get('note', storage => storage.note && setBadge(storage.note))
);
