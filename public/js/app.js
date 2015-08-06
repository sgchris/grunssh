/**
 * ACE API http://ace.c9.io/#nav=api&api=editor
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
	editor.setOptions({
		fontFamily: "consolas, monospace",
		fontSize: "13px",
		tabSize: 4
	});
	editor.session.setMode("ace/mode/php");	
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

var openFileXHR = null;
var bindEditorEvents = function() {
	$('#files-tree-wrapper').on('select_node.jstree', function(e, data) {
		
		// check if the node isn't file
		if (data.node.original.type != 'file') {
			return;
		}
		
		// cancel previous request
		openFileXHR && openFileXHR.abort();
		openFileXHR = $.ajax({
			type: 'post',
			url: '/files/content',
			data: $.extend({"id" : data.node.id}, getAuthData()),
			success: function(res) {
				if (res && res.result == 'success' && typeof(res.content) != 'undefined') {
					window.editor.setValue(res.content, -1);
				}
			},
			dataType: 'json'
		})
	});
}

$(function() {
	manageResize();
	
	initializeEditor();
	
	initializeFilesTree();
	
	bindEditorEvents();
});
