<?php if (!defined('BASEPATH')) {
	exit('No direct script access allowed');
}

require_once __DIR__ . '/../third_party/ssh/ssh.class.php';

class Files extends CI_Controller {

	protected $localTempFile;
	
	public function __construct() {
		parent::__construct();
		
		// initialize name for temp file
		$this->localTempFile = sys_get_temp_dir().DIRECTORY_SEPARATOR.date('m_Y').'.tmp';
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
					'icon' => '/public/img/ic_folder_open_black_18dp.png',
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
					'icon' => $fileData['type'] == 'dir' ? '/public/img/ic_folder_open_black_18dp.png' : 'file',
					'children' => ($fileData['type'] == 'dir'),
				);
			}

			//$result = $ssh("ls -la ".escapeshellarg($params['id']));
			// load the children of `id`
			header('Content-Type: application/json');
			echo json_encode($outputArray);
		}
	}
	
	/**
	 * @brief get content of a file
	 * @param GET `path`
	 * @return
	 */
	public function content() {
		$params = $this->input->post();
		if (empty($params) ||
			!isset($params['id']) ||
			!isset($params['host']) ||
			!isset($params['login']) ||
			!isset($params['password'])
		) {
			echo json_encode(array('result' => 'error', 'error' => 'missing parameters'));
			return;
		}
		
		// get the parameter
		$filePath = $params['id'];
		$filePath = str_replace('_SEP_', DIRECTORY_SEPARATOR, $filePath);
		
		// connect to remote host
		$ssh = new ssh($params['host'], $params['login'], $params['password']);

		// if params['content'] was supplied, save the file, otherwise get the file
		if (isset($params['content'])) {
			file_put_contents($this->localTempFile, $params['content']);
			$result = $ssh->upload($this->localTempFile, $filePath);
			if ($result === false) {
				echo json_encode(array('result' => 'error', 'error' => 'cannot get remote file'));
				return;
			}
			
			echo json_encode(array('result' => 'success'));
		} else {
			// download the file to temp local file
			$result = $ssh->download($filePath, $this->localTempFile);
			if ($result === false) {
				echo json_encode(array('result' => 'error', 'error' => 'cannot get remote file'));
				return;
			}
			
			echo json_encode(array('result' => 'success', 'content' => file_get_contents($this->localTempFile)));
		}
	}	
}
