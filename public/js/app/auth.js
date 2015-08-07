(function() {

	// get authentication data from the form
	var getData = function() {
		return {
			"host": $('input[name="connection-auth-host"]').val(),
			"login": $('input[name="connection-auth-login"]').val(),
			"password": $('input[name="connection-auth-password"]').val(),
		};
	};

	// the exported object
	window.auth = {
		getData: getData
	};

})();
