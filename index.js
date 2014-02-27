/* global atom */
'use strict';
var uglify = require('uglify-js');
var plugin = module.exports;

function minify() {
	var editor = atom.workspace.getActiveEditor();
	var isJS = editor.getGrammar().name === 'JavaScript';
	var text = '';
	var minified = '';

	if (!editor) {
		return;
	}

	// minify only the selected text when not JS
	text = isJS ? editor.getText() : editor.getSelectedText();

	try {
		minified = uglify.minify(text, {
			fromString: true,
			mangle: atom.config.get('uglify.mangle')
		}).code;
	} catch (err) {
		console.error(err);
		atom.beep();
		return;
	}

	if (isJS) {
		editor.setText(minified);
	} else {
		editor.setTextInBufferRange(editor.getSelectedBufferRange(), minified);
	}
}

plugin.configDefaults = {
	mangle: true
};

plugin.activate = function () {
	return atom.workspaceView.command('uglify', minify);
};
