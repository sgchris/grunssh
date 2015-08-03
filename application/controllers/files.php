<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

require_once __DIR__.'/../third_party/ssh/src/Neto/net/ssh';

class Files extends CI_Controller {

	public function __construct() {
		parent::__construct();
	}

	public function index() {
		$params = $this->input->post();
		if (empty($params)) {
			echo json_encode(array(
				array(
					'id' => '/',
					'text' => '/', 
					'children' => false
				)
			));
		} elseif (isset($params['id']) && !empty($params['id'])) {
			// load the children of `id`
			echo json_encode(array(
				array(
					'text' => '/', 
					'children' => false
				)
			));
		}
	}
}
