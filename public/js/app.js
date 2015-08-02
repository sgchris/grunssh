/**
 * ACE API http://ace.c9.io/#nav=api&api=editor
 */
var manageResize = function() {
	var $window = $(window);
	
	var fixSizes = function() {
		$('#left-sidebar').css({
			height: $window.outerHeight() - $('header').outerHeight()
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
}

$(function() {
	manageResize();
	
	window.editor = ace.edit('editor-wrapper');
	editor.setOptions({
		fontFamily: "consolas, monospace",
		fontSize: "13px",
		tabSize: 4
	});
	editor.session.setMode("ace/mode/php");
	
});
