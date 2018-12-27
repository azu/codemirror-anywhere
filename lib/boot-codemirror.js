// LICENSE : MIT
"use strict";
var isInsertCSS = false;

function insertOnce() {
    if (isInsertCSS) {
        return;
    }
    require("codemirror/lib/codemirror.css");
    isInsertCSS = true;
}

function prettierCode(code) {
    const parser = 'markdown';
    const plugins = [
        require('prettier/parser-babylon'),
        require('prettier/parser-typescript'),
        require('prettier/parser-markdown'),
    ];
    const prettier = require('prettier/standalone');
    return prettier.format(code, {
        parser,
        plugins
    });
}

function getCaret(el) {
    if (el.selectionStart) {
        return el.selectionStart;
    } else if (document.selection) {
        el.focus();

        var r = document.selection.createRange();
        if (r == null) {
            return 0;
        }

        var re = el.createTextRange(),
            rc = re.duplicate();
        re.moveToBookmark(r.getBookmark());
        rc.setEndPoint('EndToStart', re);

        return rc.text.length;
    }
    return 0;
}

function onChange(originalTextArea, cm) {
    originalTextArea.value = cm.getValue();
}

function positionOfCaret(textarea) {
    var StructuredSource = require('structured-source');
    var src = new StructuredSource(textarea.value);
    var caretPosition = getCaret(textarea);
    var indexToPosition = src.indexToPosition(caretPosition);
    indexToPosition.line -= 1;
    return indexToPosition;
}

const textareaSet = new Set();

function boot(textarea) {
    if (textareaSet.has(textarea)) {
        return;
    }
    textareaSet.add(textarea);
    var CodeMirror = require("codemirror");

    require("codemirror/addon/mode/overlay.js");
    require("codemirror/mode/xml/xml.js");
    require("codemirror/mode/markdown/markdown.js");
    require("codemirror/mode/gfm/gfm.js");
    require("codemirror/mode/javascript/javascript.js");
    require("codemirror/mode/css/css.js");
    require("codemirror/mode/htmlmixed/htmlmixed.js");
    require("codemirror/mode/clike/clike.js");
    require("codemirror/mode/meta.js");
    require("codemirror/addon/edit/continuelist.js");
    insertOnce();

    const restoreTextArea = function(cm) {
        console.log("codemirror-anywhere:reset");
        var textarea = cm.getTextArea();
        cm.toTextArea();
        textarea.focus();
        textareaSet.delete(textarea);
        return false;
    };
    const formatWithPrettier = function(cm) {
        const text = cm.getValue();
        const formattedCode = prettierCode(text);
        if (formattedCode !== text) {
            cm.setValue(formattedCode);
        }
    };
    var extraKeys = {
        "Cmd-E": restoreTextArea,
        "Ctrl-E": restoreTextArea,
        /**
         * @return {boolean}
         */
        "Cmd-Enter": function(cm) {
            var textarea = cm.getTextArea();
            var keyEvent = new KeyboardEvent("keydown", {
                bubbles: true,
                cancelable: true,
                key: "enter",
                metaKey: true
            });
            textarea.dispatchEvent(keyEvent);
            return false;
        },
        "Enter": "newlineAndIndentContinueMarkdownList",
        "Cmd-Alt-F": formatWithPrettier
    };

    var position = positionOfCaret(textarea);
    var myCodeMirror = CodeMirror.fromTextArea(textarea, {
        mode: "gfm",
        lineWrapping: true,
        lineNumbers: true
    });
    myCodeMirror.setOption("extraKeys", extraKeys);
    myCodeMirror.on("change", onChange.bind(myCodeMirror, textarea));
    myCodeMirror.setCursor(position);
}

module.exports = boot;
