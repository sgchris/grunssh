/**
 * authentication / connection form
 */
;(function() {

	// get authentication data from the form
	var getData = function() {
		return {
			"host": $('input[name="connection-auth-host"]').val(),
			"login": $('input[name="connection-auth-login"]').val(),
			"password": $('input[name="connection-auth-password"]').val(),
		};
	};
	
	// stored connections manager
	var storedConnections = {
		cookieName: 'sc',
		get: function() {
			var connections,
				connectionsStr = docCookies.getItem(storedConnections.cookieName);
				
			try {
				connections = connectionsStr && connectionsStr.length ? 
					JSON.parse(connectionsStr) : [];
			} catch (e) {
				connections = [];
			}
			
			return connections;
		},
		
		add: function(connectionDetails) {
			var currentConnections = storedConnections.get();
			currentConnections.push(connectionDetails);
			docCookies.setItem(storedConnections.cookieName, JSON.stringify(currentConnections));
		}
	};
	
	// connection to the remote server and call a callback
	var testConnection = function(successFn, failureFn) {
		$.ajax({
			type: 'post',
			url: '/auth/test',
			data: getData(), 
			success: function(res) {
				if (res && res.result == 'success') {
					if (successFn) successFn();
				} else {
					res && res.error && failureFn && failureFn(res.error);
				}
			},
			failure: failureFn,
			dataType: 'json'
		});
	}

	// bind events on the connection form
	var initConnectForm = function() {

		// connection submit action
		$('[name="connection-auth-form"]').on('submit', function(e) {
			var originalSubmitButtonVal = $('#header_button_submit').val();
			$('#header_button_submit').val('Connecting...');
			testConnection(function() {
				// set as connected
				window.auth.connected = true;
				
				// restore original button value
				$('#header_button_submit').val(originalSubmitButtonVal);
				
				// enable/disable buttons
				$('#header_button_submit').attr('disabled', true);
				$('#header_button_disconnect').removeAttr('disabled');
				$('#header_button_store_connection_in_cookie').removeAttr('disabled');
				
				// disable the inputs
				$('[name="connection-auth-form"]').find('input[type="text"], input[type="password"]').attr('disabled', true);
				
				// initialize the tree
				tree.initialize();
			}, function(errorMsg) {
				// restore original button value
				$('#header_button_submit').val(originalSubmitButtonVal);
				
				// display the error message
				alert(errorMsg);
			});

			return false;
		});

		// disconnect
		$('#header_button_disconnect').on('click', function() {
			if (!confirm('Really disconnect?')) {
				return false;
			}
			window.auth.connected = false;
			
			// enable/disable buttons
			$('#header_button_submit').removeAttr('disabled');
			$('#header_button_disconnect').attr('disabled', 'true');
			$('#header_button_store_connection_in_cookie').attr('disabled', true);
			
			// re-enable the inputs
			$('[name="connection-auth-form"]').find('input[type="text"], input[type="password"]').removeAttr('disabled');
			
			// close the tree
			tree.destroy();
		});
	}
	
	var initButtons = function() {
		if (window.auth.connected) {
			// hide "load connections button"
			document.getElementById('header_button_load_connections').classList.add('hidden');
			
			// hide "connect" button
			document.getElementById('header_button_submit').classList.add('hidden');
		} else {
			if (storedConnections.get().length > 0) {
				document.getElementById('header_button_load_connections').classList.remove('hidden');
			} else {
				document.getElementById('header_button_load_connections').classList.add('hidden');
			}
		}
	}

	// the exported object
	window.auth = {
		connected: false,

		initialize: function() {
			initConnectForm();
		},

		// get connection info from the form
		getData: getData
	};

})();
