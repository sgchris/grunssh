<?php if (!defined('BASEPATH')) {
	exit('No direct script access allowed');
}

require_once __DIR__ . '/../third_party/ssh/ssh.class.php';

class Files extends CI_Controller {

	protected $localTempFile;
	
	/**
	 * @brief list of file extensions that will have "code file" icon - "<>"
	 * @var array
	 */
	protected $knownCodeFileExtensions = array(
		'php','phtml','inc','html','xml','js','txt','json','yml','conf',
		'css','scss','less','sass',
		'java',
		'c','cpp','h','hpp',
		'htaccess', 'gitignore', 'gitmodules','log','md',
	);
	
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
				if (isset($params['rootFolder']) && !empty($params['rootFolder'])) {
					$rootFolder = $params['rootFolder'];
					$rootFolderId = str_replace('/', '_SEP_', $rootFolder);
					echo json_encode(array(array(
						'id' => $rootFolderId,
						'text' => $rootFolder,
						'icon' => '/public/img/ic_folder_open_black_18dp.png',
						'children' => true,
					)));
				} else {
					echo json_encode(array(array(
						'id' => '_SEP_',
						'text' => '/',
						'icon' => '/public/img/ic_folder_open_black_18dp.png',
						'children' => true,
					)));
				}
				return;
			}

			$folderToRead = str_replace('_SEP_', '/', $params['id']);
			$ssh = new ssh($params['host'], $params['login'], $params['password']);
			
			$files = $ssh->ls($folderToRead);
            
			$outputArray = array();

			foreach ($files as $fileData) {
				$fullFilePath = rtrim($folderToRead, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $fileData['name'];
				$icon = $fileData['type'] == 'dir' ? '/public/img/ic_folder_open_black_18dp.png' : '/public/img/ic_description_black_18dp.png';
				if ($fileData['type'] == 'file' && preg_match('%\.('.implode('|', $this->knownCodeFileExtensions).')$%i', $fileData['name'])) {
					$icon = '/public/img/ic_code_black_18dp.png';
				}
				$outputArray[] = array(
					'id' => str_replace(DIRECTORY_SEPARATOR, '_SEP_', $fullFilePath),
					'text' => $fileData['name'],
					'type' => $fileData['type'] == 'dir' ? 'folder' : 'file',
					'icon' => $icon,
					'children' => ($fileData['type'] == 'dir'),
				);
			}
			
			// sort - first folders A-Z, than files A-Z
			$this->sortFiles($outputArray);

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
	
	/**
	 * @brief create new folder
	 * @method POST
	 * @return  
	 */
	public function mkdir() {
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
		
		// connect to remote host
		$ssh = new ssh($params['host'], $params['login'], $params['password']);
		
		$newFolderPath = str_replace('_SEP_', '/', $params['id']);
		
		$result = $ssh->mkdir($newFolderPath);
		if ($result === false) {
			echo json_encode(array('result' => 'error', 'error' => 'cannot create folder'));
			return;
		}
		
		echo json_encode(array('result' => 'success'));
	}
	
	protected function sortFiles(array &$filesArray) {
		return usort($filesArray, function($a, $b) {
			if ($a['type'] !== $b['type']) {
				if ($a['type'] === 'folder') {
					return -1;
				} else {
					return 1;
				}
			}
			
			return strcasecmp($a['text'], $b['text']);
		});
	}
}
