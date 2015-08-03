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

var initializeFilesTree = function() {
	$('#files-tree-wrapper').jstree({
		'core' : {
			'data' : {
				"url" : "/files",
				"type": "post",
				"data" : function (node) {
					if (node.id == '#') node.id = '/';
					
					var authData = {
						"host": $('input[name="connection-auth-host"]').val(),
						"login": $('input[name="connection-auth-login"]').val(),
						"password": $('input[name="connection-auth-password"]').val(),
					};
					
					return $.extend({"id" : node.id}, authData);
				},
				"dataType" : "json"
			}
		}
	});
}

$(function() {
	manageResize();
	
	initializeEditor();
	
	initializeFilesTree();
});
