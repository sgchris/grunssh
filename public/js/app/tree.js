$(function() {
	
	var $treeWrapper = $('#files-tree-wrapper');

	// AJAX object
	var treeXHR = null;
	
	var currentRootFolder = '/';
	
	var initializeFilesTree = function(rootFolder) {
		$treeWrapper.jstree({
			'core' : {
				'data' : {
					"url" : "/files",
					"type": "post",
					"data" : function (node) {
						if (rootFolder) {
							return $.extend({"id": node.id, "rootFolder": rootFolder}, auth.getData());
						} else {
							return $.extend({"id" : node.id}, auth.getData());
						}
					},
					"dataType" : "json"
				}
			}
		});
		
		// select item in tree
		$treeWrapper.on('select_node.jstree', function(e, data) {
			
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
				data: $.extend({"id" : data.node.id}, auth.getData()),
				success: function(res) {
					if (res && res.result == 'success' && typeof(res.content) != 'undefined') {
						editor.openFile(data.node.id, res.content);
					}
				},
				dataType: 'json'
			});
		});
		
	}
	
	var getFolderFromUser = function(callbackFn) {
		var newRootFolder = prompt('Set root folder', currentRootFolder);
		if (newRootFolder && typeof(callbackFn) == 'function') {
			currentRootFolder = newRootFolder;
			callbackFn(newRootFolder);
		}
	};
	
	var setRootFolder = function() {
		getFolderFromUser(function(newRootFolder) {
			// remove the current instance
			$treeWrapper.jstree('destroy');
			
			// create new tree
			initializeFilesTree(newRootFolder);
			
			$treeWrapper.jstree('refresh');
			
			// re-bind events
			// bindTreeEvents();
		});
	};
	
	// add new folder callback
	var addNewFolder = function() {
		// get current selected folder in the tree
		var selectedNode = $treeWrapper.jstree().get_selected(true);
		if (!(selectedNode instanceof Array) || selectedNode.length != 1) {
			alert('Please specify one folder');
			return false;
		}
		selectedNode = selectedNode[0];
		
		// check that the selected item is folder
		if (!selectedNode || !selectedNode.original || selectedNode.original.type != 'folder') {
			alert('Please select a folder');
			return false;
		}
		var selectedNode = selectedNode.id;
		var newFolderName = prompt('New folder name');
		if (!newFolderName) {
			alert('No new folder name supplied');
			return false;
		}
		
		selectedNode+= '_SEP_' + newFolderName;
		
		// AJAX call to the server
		$.ajax({
			type: 'post',
			url: '/files/mkdir',
			data: $.extend({"id" : selectedNode}, auth.getData()),
			success: function(res) {
				if (res && res.result == 'success') {
					$treeWrapper.jstree('refresh');
				}
			},
			dataType: 'json'
		});
	}
	
	// add new file callback
	var addNewFile = function() {
		// get current selected folder in the tree
		var selectedNode = $treeWrapper.jstree().get_selected(true);
		if (!(selectedNode instanceof Array) || selectedNode.length != 1) {
			alert('Please specify one folder');
			return false;
		}
		selectedNode = selectedNode[0];
		
		// check that the selected item is folder
		if (!selectedNode || !selectedNode.original || selectedNode.original.type != 'folder') {
			alert('Please select a folder');
			return false;
		}
		var selectedNode = selectedNode.id;
		var newFileName = prompt('New file name');
		if (!newFileName) {
			alert('No new file name supplied');
			return false;
		}
		
		selectedNode+= '_SEP_' + newFileName;
		
		// AJAX call to the server
		$.ajax({
			type: 'post',
			url: '/files/content',
			data: $.extend({'id' : selectedNode, 'content': ''}, auth.getData()),
			success: function(res) {
				if (res && res.result == 'success') {
					$treeWrapper.jstree('refresh');
				}
			},
			dataType: 'json'
		});
	}

	// bind tree events (open, save, ...)
	var bindTreeEvents = function() {
		
		// add new folder
		$('#left-sidebar .toolbar').on('click', '#toolbar_add_folder', addNewFolder);
		
		// add new file
		$('#left-sidebar .toolbar').on('click', '#toolbar_add_file', addNewFile);
		
		// set root folder
		$('#left-sidebar .toolbar').on('click', '#toolbar_set_root_folder', setRootFolder);
		
		// refresh the tree
		$('#left-sidebar .toolbar').on('click', '#toolbar_refresh', function() {
			$treeWrapper.jstree('refresh');
		});
	}
	
	// exported object
	window.tree = {
		initialize: function() {
			initializeFilesTree();
			bindTreeEvents();
		},
		
		destroy: function() {
			// remove the current instance
			$treeWrapper.jstree('destroy');			
		}
	}
	
});
