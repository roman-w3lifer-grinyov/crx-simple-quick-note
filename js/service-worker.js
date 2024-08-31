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

function setBadgeOnInstalledAndStartup() {
  chrome.storage.sync.get('note', storage => storage.note && setBadge(storage.note));
}

chrome.runtime.onStartup.addListener(_ => setBadgeOnInstalledAndStartup());

chrome.runtime.onInstalled.addListener(_ => setBadgeOnInstalledAndStartup());
