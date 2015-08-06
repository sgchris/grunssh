/**
 * ACE API http://ace.c9.io/#nav=api&api=editor
 * @todo
- on reload file, save curet position
- implement tree buttons actions
 */
var manageResize = function() {
	var $window = $(window);
	
	var fixSizes = function() {
		$('#left-sidebar').css({
			height: $window.outerHeight() - $('header').outerHeight()
		}).find('#files-tree-wrapper').css({
			height: $('#left-sidebar').height() - $('#left-sidebar ul.toolbar').outerHeight()
		});
		
		$('#main-content').css({
			width: $window.outerWidth() - $('#left-sidebar').outerWidth(),
			height: $window.outerHeight() - $('header').outerHeight()
		}).find('#editor-wrapper').css({
			height: $('#main-content').height() - $('#main-content ul.toolbar').outerHeight()
		});
	};
	
	fixSizes();
	$window.on('resize', fixSizes);
};

var initializeEditor = function() {
	window.editor = ace.edit('editor-wrapper');
	window.editor.setOptions({
		fontFamily: "consolas, monospace",
		fontSize: "13px",
		tabSize: 4
	});
	window.editor.session.setMode("ace/mode/php");	
};

var getAuthData = function() {
	return {
		"host": $('input[name="connection-auth-host"]').val(),
		"login": $('input[name="connection-auth-login"]').val(),
		"password": $('input[name="connection-auth-password"]').val(),
	};
};

var initializeFilesTree = function() {
	$('#files-tree-wrapper').jstree({
		'core' : {
			'data' : {
				"url" : "/files",
				"type": "post",
				"data" : function (node) {
					return $.extend({"id" : node.id}, getAuthData());
				},
				"dataType" : "json"
			}
		}
	});
}

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
var treeXHR = null;

// bind tree events (open, save, ...)
var bindTreeEvents = function() {
	$('#files-tree-wrapper').on('select_node.jstree', function(e, data) {
		// check if the node isn't file
		if (data.node.original.type != 'file') {
			return;
		}
		
		// cancel previous request
		treeXHR && treeXHR.abort();
		
		// get the content of a file
		treeXHR = $.ajax({
			type: 'post',
			url: '/files/content',
			data: $.extend({"id" : data.node.id}, getAuthData()),
			success: function(res) {
				if (res && res.result == 'success' && typeof(res.content) != 'undefined') {
					selectedFile.set(data.node.id);
					window.editor.setValue(res.content, -1);
				}
			},
			dataType: 'json'
		});
	});
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
			data: $.extend({"id" : currentFile, 'content': fileContent}, getAuthData()),
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
			data: $.extend({"id" : currentFile}, getAuthData()),
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

$(function() {
	manageResize();
	
	initializeEditor();
	
	initializeFilesTree();
	
	bindTreeEvents();
	
	bindEditorEvents();
});
