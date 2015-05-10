// LICENSE : MIT
"use strict";
var isInsertCSS = false;
function insertOnce() {
    if (isInsertCSS) {
        return;
    }
    var fs = require('fs');
    var insertCss = require('insert-css');
    var css = fs.readFileSync(__dirname + '/../node_modules/codemirror/lib/codemirror.css');
    insertCss(css);
    isInsertCSS = true;
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
function boot(textarea) {
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

    var restoreTextArea = function (cm) {
        var textarea = cm.getTextArea();
        var toTextArea = cm.toTextArea();
        textarea.focus();
        return false;
    };
    var extraKeys = {
        "Cmd-E": restoreTextArea,
        "Ctrl-E": restoreTextArea,
        "Cmd-Enter": function (cm) {
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
        "Enter": "newlineAndIndentContinueMarkdownList"
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