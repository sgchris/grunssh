(function() {

	// object containing the ace editor object
	var editorObject = null;
	
	// create the object
	var initializeEditor = function() {
		editorObject = ace.edit('editor-wrapper');
		editorObject.setOptions({
			fontFamily: "consolas, monospace",
			fontSize: "13px",
			tabSize: 4
		});
		editorObject.session.setMode("ace/mode/php");	
		
		editorObject.commands.addCommand({
			name: 'saveFile',
			bindKey: {
				win: 'Ctrl-S',
				mac: 'Command-S',
				sender: 'editor|cli'
			},
			exec: saveCurrentFile
		});
	};
	
	// currently selected file manager (the active file on the editor)
	var selectedFile = {
		_file: null,
		
		set: function(_file) {
			selectedFile._file = _file;
			
			// display the file in the corner
			var selectedFileText = _file || '';
			if (selectedFileText.length) {
				selectedFileText = selectedFileText.replace(/_SEP_/g, '/');
			}
			$('#selected_file').text(selectedFileText);
		},
		
		get: function() {
			return selectedFile._file;
		},
		
		clear: function() {
			selectedFile.set(null);
		}
	}

	// AJAX object
	var editorXHR = null;
	
	// save the current open file in the editor
	var saveCurrentFile = function() {
		if (!window.auth.connected) {
			window.app.log('not connected');
			return;
		}
		
		var currentFile = selectedFile.get();
		if (!currentFile) {
			window.app.log('no active file');
			return;
		}
		
		var fileContent = window.editor.getObject().getValue();
		
		// cancel previous request
		editorXHR && editorXHR.abort();
		
		// notify
		window.app.log('saving "' + currentFile.replace(/_SEP_/g, '/') + '"...');
		
		// get the content of a file
		editorXHR = $.ajax({
			type: 'post',
			url: '/files/content',
			data: $.extend({"id" : currentFile, 'content': fileContent}, auth.getData()),
			success: function(res) {
				if (res && res.result == 'success') {
					window.app.log('saved successfully');
					setTimeout(function() {
						selectedFile.set(currentFile);
					}, 2000);
				} else {
					window.app.log('error saving the file');
				}
			},
			dataType: 'json'
		});
	}
	
	var bindEditorEvents = function() {
		$('#toolbar_save_file').on('click', saveCurrentFile);
		
		$('#toolbar_reload_file').on('click', function() {
			var currentFile = selectedFile.get();
			if (!currentFile) {
				window.app.log('no selected file');
				return;
			}
			
			// cancel previous request
			editorXHR && editorXHR.abort();
			
			// notify
			window.app.log('Reloading...');
			
			// save curet position
			var currentPosition = editorObject.getCursorPosition();
			
			// get the content of a file
			editorXHR = $.ajax({
				type: 'post',
				url: '/files/content',
				data: $.extend({"id" : currentFile}, auth.getData()),
				success: function(res) {
					if (res && res.result == 'success' && typeof(res.content) != 'undefined') {
						window.app.log('reload file succeeded');
						selectedFile.set(currentFile);
						editorObject.setValue(res.content, -1);
						editorObject.gotoLine(currentPosition.row + 1, currentPosition.column);
						editorObject.focus();
					} else {
						window.app.log('error reloading the file');
					}
				},
				dataType: 'json'
			});
		});
	}

	window.editor = {
		getObject: function() {
			return editorObject;
		},
		
		initialize: function() {
			initializeEditor();
			bindEditorEvents();
		},
		
		openFile: function(file, content) {
			selectedFile.set(file);
			editor.getObject().setValue(content, -1);
		}
	}
	
})();

