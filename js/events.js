;'use strict';

/* global chrome */

chrome.runtime.onInstalled.addListener(
  () => chrome.storage.sync.get('note', storage => storage.note && setBadge(storage.note))
);
