'use strict';
var uglify = require('uglify-js');
var plugin = module.exports;

function init() {
	var editor = atom.workspace.getActiveEditor();

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

plugin.configDefaults = {
	mangle: true
};

plugin.activate = function () {
	atom.workspaceView.command('uglify', init);
};
