$(function() {
	
	// cache
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
	console.log('changed');
});
