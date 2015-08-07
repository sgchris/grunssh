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

	// exported object
	window.tree = {
		initialize: function() {
			initializeFilesTree();
			bindTreeEvents();
		}
	}
	
});
