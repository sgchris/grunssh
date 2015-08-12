<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">

	<title><?php echo isset($header_title) ? htmlentities($header_title) : config_item('default_header_title');?></title>
	<meta name="description" content="<?php echo isset($header_description) ? htmlentities($header_description) : config_item('default_header_description');?>">
	<meta name="author" content="Gregory Chris">

	<!-- vendor styles -->
	<link href='http://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" href="/public/js/jstree/dist/themes/default/style.min.css?<?php echo uniqid('ver_');?>" />

	<!-- custom styles -->
	<link rel="stylesheet" href="/public/css/layout.css?v=1.0&<?php echo uniqid('ver_');?>" />
	<link rel="stylesheet" href="/public/css/styles.css?v=1.0&<?php echo uniqid('ver_');?>" />

	<!-- vendor scripts -->	
	<script src="/public/js/griquire/griquire.min.js?<?php echo uniqid('ver_');?>"></script>
	<script type="text/javascript">
	griquire([
	    "/public/js/jquery.min.js?<?php echo uniqid('ver_');?>",	           
	    "/public/js/ace-builds/src-min-noconflict/ace.js?<?php echo uniqid('ver_');?>",	           
	    "/public/js/ace-builds/src-min-noconflict/mode-php.js?<?php echo uniqid('ver_');?>",	           
	    "/public/js/jstree/dist/jstree.min.js?<?php echo uniqid('ver_');?>",	           
	    "/public/js/app/auth.js?<?php echo uniqid('ver_');?>",	           
	    "/public/js/app/tree.js?<?php echo uniqid('ver_');?>",	           
	    "/public/js/app/editor.js?<?php echo uniqid('ver_');?>",	           
	    "/public/js/app.js?<?php echo uniqid('ver_');?>",	           
	], function() {
		// all the above libs are loaded at this point
	});
	</script>
	<!-- 
	<script src="/public/js/jquery.min.js?<?php echo uniqid('ver_');?>"></script>

	<script src="/public/js/ace-builds/src-min-noconflict/ace.js?<?php echo uniqid('ver_');?>"></script>
	<script src="/public/js/ace-builds/src-min-noconflict/mode-php.js?<?php echo uniqid('ver_');?>"></script>

	<script src="/public/js/jstree/dist/jstree.min.js?<?php echo uniqid('ver_');?>"></script>

	<script src="/public/js/app/auth.js?<?php echo uniqid('ver_');?>"></script>
	<script src="/public/js/app/tree.js?<?php echo uniqid('ver_');?>"></script>
	<script src="/public/js/app/editor.js?<?php echo uniqid('ver_');?>"></script>
	<script src="/public/js/app.js?<?php echo uniqid('ver_');?>"></script>
	 -->
</head>
<body>
<header>
	<ul>
		<li class="logo">LOGO</li>
		<li>
			<form name="connection-auth-form">
			<input type="text" name="connection-auth-host" placeholder="jon.snow.wf" value="localhost" />
			<input type="text" name="connection-auth-login" placeholder="jon_snow" value="greg" />
			<input type="password" name="connection-auth-password" value="apocal12" />
			<input type="submit" value="Connect" />
			<input type="button" value="Disconnect" disabled="true" />
			</form>
		</li>
		<li>
			<ul>
				<li><a href="https://github.com/sgchris/grunssh">Github</a></li>
			</ul>
		</li>
	</ul>
</header>

<section id="content">
