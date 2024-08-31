;'use strict';

/* global chrome */

window.addEventListener('DOMContentLoaded', function () {

  var ext = {

    textarea: document.querySelector('textarea'),
    copyButton: document.getElementById('copy-button'),
    cutButton: document.getElementById('cut-button'),
    resetButton: document.getElementById('reset-button'),
    totalLengthOfTextElement: document.getElementById('total-length-of-text'),
    lengthOfSelectedTextElement: document.getElementById('length-of-selected-text'),

    noteLength: 0,
    storage: chrome.storage.sync,

    bootstrap: function () {
      this.storage.get(function (storage) {
        const height = (storage.textarea && storage.textarea.height) || TEXTAREA.height;
        const width = (storage.textarea && storage.textarea.width) || TEXTAREA.width;
        ext.textarea.style.height = height + 'px';
        ext.textarea.style.width = width + 'px';
        if (storage.note) {
          ext.textarea.value = storage.note;
        }
        ext._setLength();
        setBadge(ext.textarea.value);
      });
    },

    updateNote: function () {
      ext.storage.set({'note': ext.textarea.value});
      ext._setLength();
      setBadge(ext.textarea.value);
    },

    _setLength: function () {
      ext.noteLength = ext.textarea.value.length;
      ext.totalLengthOfTextElement.textContent = ext.noteLength;
    },

  };

  ext.bootstrap();

  ext.textarea.addEventListener('input', function () {
    ext.updateNote();
  });

  ext.copyButton.addEventListener('click', function () {
    copyTextToClipboard(ext.textarea.value);
  });

  ext.cutButton.addEventListener('click', function () {
    copyTextToClipboard(ext.textarea.value);
    clearNote();
  });

  ext.resetButton.addEventListener('click', function () {
    if (confirm('Your note will be deleted!')) {
      clearNote();
    }
  });

  function clearNote() {
    ext.textarea.value = '';
    ext.updateNote();
  }

  function copyTextToClipboard(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  document.addEventListener('selectionchange', _ => {
    ext.lengthOfSelectedTextElement.textContent = '' + document.getSelection().toString().length
  })

});
