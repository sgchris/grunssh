<?php if (!defined('BASEPATH')) {
	exit('No direct script access allowed');
}

require_once __DIR__ . '/../third_party/ssh/ssh.class.php';

class Auth extends CI_Controller {

	/**
	 * check connection
	 */
	public function test() {

		// check POST
		if ($this->input->server('REQUEST_METHOD', false) != 'POST') {
			echo json_encode(array(
				'result' => 'error',
				'error' => 'the action requires POST request',
			));
			return;
		}

		// check parameters
		$params = $this->input->post();
		if (empty($params) ||
			!isset($params['host']) ||
			!isset($params['login']) ||
			!isset($params['password'])
		) {
			echo json_encode(array(
				'result' => 'error',
				'error' => 'no `host`, `login` or `password` parameter',
			));
		} elseif ($params['host'] && $params['login'] && $params['password']) {
			// create the connection
			$ssh = new ssh($params['host'], $params['login'], $params['password']);
			if ($ssh->connect() === false) {
				echo json_encode(array(
					'result' => 'error',
					'error' => 'cannot connect',
				));
			} else {
				echo json_encode(array(
					'result' => 'success',
				));
			}
		}
	}

}
