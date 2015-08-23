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

	// bind tree events (open, save, ...)
	var bindTreeEvents = function() {

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
