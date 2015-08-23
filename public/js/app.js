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

$(function() {
	manageResize();
	
	auth.initialize();
	editor.initialize();
});
