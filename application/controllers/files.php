<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

require_once __DIR__.'/../third_party/ssh/ssh.class.php';

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
					'id' => '/',
					'text' => '/', 
					'children' => true,
				)
			));
		} elseif ($params['id'] && $params['host'] && $params['login'] && $params['password']) {
			
			if ($params['id'] == '/') {
				echo json_encode(array(array('text' => 'root', 'children' => true)));
				return;
			}
			
			$ssh = new ssh($params['host'], $params['login'], $params['password']);
			$files = $ssh->ls($params['id']);
			$outputArray = array();
			
			foreach ($files as $fileData) {
				$outputArray[] = array(
					'id' => uniqid(), //rtrim($params['id'], '/').'/'.$fileData['name'],
					'text' => $fileData['name'],
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
