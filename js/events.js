;'use strict';

/* global chrome */

chrome.runtime.onInstalled.addListener(onInstalledAndOnStartupListener);
chrome.runtime.onStartup.addListener(onInstalledAndOnStartupListener);
chrome.tabs.onUpdated.addListener(() => onInstalledAndOnStartupListener);

function onInstalledAndOnStartupListener()
{
  chrome.storage.sync.get('note', storage => storage.note && setBadge(storage.note));
}
