/** @babel */
import {CompositeDisposable} from 'atom';
import {allowUnsafeNewFunction} from 'loophole';

let uglify;
allowUnsafeNewFunction(() => {
	uglify = require('uglify-js');
});

function init(editor) {
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
		atom.notifications.addError('Uglify', {detail: err.message});
		return;
	}

	const cursorPosition = editor.getCursorBufferPosition();
	const line = atom.views.getView(editor).getFirstVisibleScreenRow() +
		editor.getVerticalScrollMargin();

	if (selectedText) {
		editor.setTextInBufferRange(editor.getSelectedBufferRange(), retText);
	} else {
		editor.getBuffer().setTextViaDiff(retText);
	}

	editor.setCursorBufferPosition(cursorPosition);

	if (editor.getScreenLineCount() > line) {
		editor.scrollToScreenPosition([line, 0]);
	}
}

export const config = {
	mangle: {
		type: 'boolean',
		default: true
	}
};

export function deactivate() {
	this.subscriptions.dispose();
}

export function activate() {
	this.subscriptions = new CompositeDisposable();

	this.subscriptions.add(atom.commands.add('atom-workspace', 'uglify', () => {
		const editor = atom.workspace.getActiveTextEditor();

		if (editor) {
			init(editor);
		}
	}));
}
