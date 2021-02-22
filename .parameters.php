<?php
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();


$arComponentParameters = array(
	'PARAMETERS' => array(
		'START_SEEK_SYMBOL_COUNT' => array(
			'PARENT' => 'BASE',
			'NAME' => GetMessage('START_SEEK_SYMBOL_COUNT_PARAM_CAPTION'),
			'TYPE' => 'STRING',
			'DEFAULT' => '2',
		),
		// TODO send param to ajax.php
/*		'ARRAY_IBLOCK_ID' => array(
			'PARENT' => 'BASE',
			'NAME' => GetMessage('ARRAY_IBLOCK_ID_PARAM_CAPTION'),
			'TYPE' => 'STRING',
			'DEFAULT' => '3'
		),
*/		'CART_BUTTON_STYLE' => array(
			'PARENT' => 'VISUAL',
			'NAME' => GetMessage('SMSN_CART_BUTTON_STYLE_PARAM_CAPTION'),
			'TYPE' => 'LIST',
			// set CSS class, bootstrap is available
			'VALUES' => array(
				'btn-link' => 'btn-link',
				'btn-primary' => 'btn-primary',
			),
			'DEFAULT' => 'btn-link',
			'ADDITIONAL_VALUES' => 'Y'
		),
	),
);
