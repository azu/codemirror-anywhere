// ==UserScript==
// @name        codemirror-anywhere
// @namespace   http://efcl.info/
// @description codemirror-anywhere
// @include     http://*
// @include     https://*
// @version     1
// @grant       none
// ==/UserScript==

var textAreaList = Array.from(document.getElementsByTagName("textarea"));
function textAreaHandler(event) {
    var isMetaKey = event.metaKey || event.ctrlKey;
    if (isMetaKey && event.key === "e") {
        require("./boot-codemirror")(event.target);
    }
}

textAreaList.forEach(function (textArea) {
    textArea.addEventListener("keydown", textAreaHandler);
});

