$(function() {
	
	var $treeWrapper = $('#files-tree-wrapper');
	
	var initializeFilesTree = function() {
		$treeWrapper.jstree({
			'core' : {
				'data' : {
					"url" : "/files",
					"type": "post",
					"data" : function (node) {
						return $.extend({"id" : node.id}, auth.getData());
					},
					"dataType" : "json"
				}
			}
		});
	}

	var setRootFolder = function() {
		var getFolderFromUser = function(callbackFn) {
			var newRootFolder = prompt('Set root folder');
			if (newRootFolder && typeof(callbackFn) == 'function') {
				callbackFn(newRootFolder);
			}
		}
		
		getFolderFromUser(function(newRootFolder) {
			// remove the current instance
			$treeWrapper.jstree('destroy');
			
			// create new tree
			$treeWrapper.jstree({
				'core' : {
					'data' : {
						"url" : "/files",
						"type": "post",
						"data" : function (node) {
							console.log('node', node);
							return $.extend({"id": node.id, "rootFolder": newRootFolder}, auth.getData());
						},
						"dataType" : "json"
					}
				}
			});
			
			$treeWrapper.jstree('refresh');
			
			// re-bind events
			bindTreeEvents();
		});
	};

	// AJAX object
	var treeXHR = null;

	// bind tree events (open, save, ...)
	var bindTreeEvents = function() {
		
		// select item in tree
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
				data: $.extend({"id" : data.node.id}, auth.getData()),
				success: function(res) {
					if (res && res.result == 'success' && typeof(res.content) != 'undefined') {
						editor.openFile(data.node.id, res.content);
					}
				},
				dataType: 'json'
			});
		});
		
		// set root folder
		$('#toolbar_set_root_folder').on('click', setRootFolder);
		
		$('#toolbar_refresh').on('click', function() {
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
