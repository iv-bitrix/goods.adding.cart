<?php
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();

$arComponentParameters = array(
	'PARAMETERS' => array(
		'CART_BUTTON_STYLE' => array(
			'PARENT' => 'VISUAL',
			'NAME' => GetMessage('SMSN_CART_BUTTON_STILE_PARAM_CAPTION'),
			'TYPE' => 'LIST',
			// set CSS class, bootstrap is available
			'VALUES' => array(
				'btn-link' => 'btn-link',
				'btn-primary' => 'btn-primary',
			),
			'DEFAULT' => 'btn-link',
			'REFRESH' => 'N',
			'ADDITIONAL_VALUES' => 'Y',
		),
	),
);