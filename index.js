'use strict';
var uglify = require('uglify-js');
var plugin = module.exports;

function minify() {
	var text;
	var minified;
	var isSelected = false;
	var editor = atom.workspace.getActiveEditor();

	if (!editor) {
		return;
	}

	text = editor.getSelectedText();

	if (text) {
		isSelected = true;
	} else {
		text = editor.getText();
	}

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

	if (isSelected) {
		editor.setTextInBufferRange(editor.getSelectedBufferRange(), minified);
	} else {
		editor.setText(minified);
	}
}

plugin.configDefaults = {
	mangle: true
};

plugin.activate = function () {
	return atom.workspaceView.command('uglify', minify);
};
