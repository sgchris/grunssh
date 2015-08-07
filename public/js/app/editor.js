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

	var bindEditorEvents = function() {
		$('#toolbar_save_file').on('click', function() {
			var currentFile = selectedFile.get();
			if (!currentFile) {
				return;
			}
			
			var fileContent = window.editor.getValue();
			
			// cancel previous request
			editorXHR && editorXHR.abort();
			
			// notify
			selectedFile.set('Saving...');
			
			// get the content of a file
			editorXHR = $.ajax({
				type: 'post',
				url: '/files/content',
				data: $.extend({"id" : currentFile, 'content': fileContent}, auth.getData()),
				success: function(res) {
					if (res && res.result == 'success') {
						selectedFile.set('Saved!');
						setTimeout(function() {
							selectedFile.set(currentFile);
						}, 2000);
					}
				},
				dataType: 'json'
			});
		});
		
		$('#toolbar_reload_file').on('click', function() {
			var currentFile = selectedFile.get();
			if (!currentFile) {
				return;
			}
			
			// cancel previous request
			editorXHR && editorXHR.abort();
			
			// notify
			selectedFile.set('Reloading...');
			
			// get the content of a file
			editorXHR = $.ajax({
				type: 'post',
				url: '/files/content',
				data: $.extend({"id" : currentFile}, auth.getData()),
				success: function(res) {
					if (res && res.result == 'success' && typeof(res.content) != 'undefined') {
						selectedFile.set(currentFile);
						window.editor.setValue(res.content, -1);
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

