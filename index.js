'use strict';
var uglify = require('uglify-js');

function init() {
	var editor = atom.workspace.getActiveTextEditor();

	if (!editor) {
		return;
	}

	var selectedText = editor.getSelectedText();
	var text = selectedText || editor.getText();
	var retText = '';

	try {
		retText = uglify.minify(text, {
			fromString: true,
			mangle: atom.config.get('uglify.mangle')
		}).code;
	} catch (err) {
		console.error(err);
		atom.beep();
		return;
	}

	if (selectedText) {
		editor.setTextInBufferRange(editor.getSelectedBufferRange(), retText);
	} else {
		editor.setText(retText);
	}
}

exports.config = {
	mangle: {
		type: 'boolean',
		default: true
	}
};

exports.activate = function () {
	atom.commands.add('atom-text-editor', 'uglify', init);
};
