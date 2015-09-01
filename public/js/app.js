(function() {
	/**
	 * ACE API http://ace.c9.io/#nav=api&api=editor
	 * @todo
	- on reload file, save curet position
	- implement tree buttons actions
	 */
	var manageResize = function() {
		var $window = $(window);
		
		var fixSizes = function() {
			var $consoleOutput = $('#console-output')
			
			$('#left-sidebar').css({
				height: $window.innerHeight() - $('header').outerHeight() - $consoleOutput.outerHeight() - 4
			}).find('#files-tree-wrapper').css({
				height: $('#left-sidebar').height() - $('#left-sidebar ul.toolbar').outerHeight()
			});
			
			$('#main-content').css({
				width: $window.outerWidth() - $('#left-sidebar').outerWidth(),
				height: $window.innerHeight() - $('header').outerHeight() - $consoleOutput.outerHeight() - 4
			}).find('#editor-wrapper').css({
				height: $('#main-content').height() - $('#main-content ul.toolbar').outerHeight()
			});
			
			//$consoleOutput.css('width', $('window').innerWidth());
		};
		
		fixSizes();
		$window.on('resize', fixSizes);
	};

	var app = {
		log: function(msg) {
			var d = new Date();
			var hours = d.getHours();
			if (hours < 10) hours = '0' + hours;
			var minutes = d.getMinutes();
			if (minutes < 10) minutes = '0' + minutes;
			var seconds = d.getSeconds();
			if (seconds < 10) seconds = '0' + seconds;
			var dateStr = hours + ':' + minutes + ':' + seconds;
			
			var $consoleOutput = $('#console-output');
			
			// add the message
			var currentText = $consoleOutput.text();
			if (currentText.length > 0) {
				currentText+= "\n";
			}
			$consoleOutput.text(currentText + dateStr + ' ' + msg);
			
			// scroll to bottom
			$consoleOutput.scrollTop($consoleOutput[0].scrollHeight - $consoleOutput.height());
		}
	};

	$(function() {
		manageResize();
		
		window.app = app;
		
		auth.initialize();
		editor.initialize();
		
	});
})();
