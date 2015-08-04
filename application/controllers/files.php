<?php if (!defined('BASEPATH')) {
	exit('No direct script access allowed');
}

require_once __DIR__ . '/../third_party/ssh/ssh.class.php';

class Files extends CI_Controller {

	public function __construct() {
		parent::__construct();
	}

	public function index() {
		$params = $this->input->post();
		if (empty($params) ||
			!isset($params['id']) ||
			!isset($params['host']) ||
			!isset($params['login']) ||
			!isset($params['password'])
		) {
			echo json_encode(array(
				array(
					'text' => '/',
					'children' => true,
				),
			));
		} elseif ($params['id'] && $params['host'] && $params['login'] && $params['password']) {

			if ($params['id'] == '#') {
				echo json_encode(array(array(
					'id' => '_SEP_',
					'text' => '/',
					'children' => true,
				)));
				return;
			}

			$folderToRead = str_replace('_SEP_', DIRECTORY_SEPARATOR, $params['id']);
			$ssh = new ssh($params['host'], $params['login'], $params['password']);
			$files = $ssh->ls($folderToRead);
			$outputArray = array();

			foreach ($files as $fileData) {
				$fullFilePath = rtrim($folderToRead, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $fileData['name'];
				$outputArray[] = array(
					'id' => str_replace(DIRECTORY_SEPARATOR, '_SEP_', $fullFilePath),
					'text' => $fileData['name'],
					'type' => $fileData['type'] == 'dir' ? 'folder' : 'file',
					'children' => ($fileData['type'] == 'dir'),
				);
			}

			//$result = $ssh("ls -la ".escapeshellarg($params['id']));
			// load the children of `id`
			header('Content-Type: application/json');
			echo json_encode($outputArray);
		}
	}
}
