/** @babel */
import {allowUnsafeNewFunction} from 'loophole';

let uglify;
allowUnsafeNewFunction(() => {
	uglify = require('uglify-js');
});

function init() {
	const editor = atom.workspace.getActiveTextEditor();

	if (!editor) {
		return;
	}

	const selectedText = editor.getSelectedText();
	const text = selectedText || editor.getText();
	let retText = '';

	try {
		allowUnsafeNewFunction(() => {
			retText = uglify.minify(text, {
				fromString: true,
				mangle: atom.config.get('uglify.mangle')
			}).code;
		});
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

export const config = {
	mangle: {
		type: 'boolean',
		default: true
	}
};

export const activate = () => {
	atom.commands.add('atom-workspace', 'uglify', init);
};
