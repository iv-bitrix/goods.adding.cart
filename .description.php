<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

$arComponentDescription = array(
	// component name (3 level) in components tree
	"NAME" => GetMessage("SMSN_GOODS_ADDING_CART_LIST"),
	"DESCRIPTION" => GetMessage("SMSN_GOODS_ADDING_CART_DESC"),
	"ICON" => "/images/icon.gif",
	"PATH" => array(
		"ID" => "samson",
		// 1 level name in components tree
		"NAME" => GetMessage("SMSN_GROUP_TITLE"),
		"CHILD" => array(
			"ID" => "goods_components",
			// 2 level name in components tree
			"NAME" => GetMessage("SMSN_GOODS_COMPONENTS_GROUP_TITLE")
		)
	),
);
?>