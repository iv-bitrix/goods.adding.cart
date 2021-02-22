<?php
#components/bitrix/example/ajax.php

if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();

\Bitrix\Main\Loader::IncludeModule('iblock');
\Bitrix\Main\Loader::includeModule('sale');
\Bitrix\Main\Loader::includeModule('catalog');

class CGoods extends \Bitrix\Main\Engine\Controller
{

	// Reconfigure Actions
	public function configureActions()
	{
		// Reset the default filters (ActionFilter\Authentication и ActionFilter\HttpMethod)
		// The preset filters are in the folder: /bitrix/modules/main/lib/engine/actionfilter/
		return [
			'getGoodsList' => [			// Ajax-method getGoodsListAction
				'prefilters' => [],		// reset filters
			],
			'addGoodsToCart' => [		// Ajax-method addGoodsToCartAction
				'prefilters' => [],		// reset filters
			],
		];
	}

	/**
	 * gets goods where XML-ID includes $xmlId
	 * @param xmlId straing part of goods XML-ID field to seek
	 * @return array of found records
	 */
	public function getGoodsListAction($xmlId = 'none')
	{
		// TODO create param for IBLOCK_ID filter
		$arIBlockId = ['3'];	// permissible IBLOCK_ID for preselect goods

		$arItems = array();			// result array
		// TODO make configurable SQL filter by the checkbox: %xmlId or %xmlId%
		$arFilter = array('IBLOCK_ID' => $arIBlockId, 'XML_ID' => "%{$xmlId}%", 'ACTIVE' => 'Y');
		$arSelect = array('ID', 'PRODUCT_ID', 'XML_ID', 'NAME');
		$goods = CIBlockElement::GetList(
			array('ID' => 'ASC'),
			$arFilter,
			false,
			false,
			$arSelect
		);
		while ($arFields = $goods->GetNext()) {
			$arItems[] = array(
				'ID' => $arFields['ID'],
				'XML_ID' => $arFields['XML_ID'],
				'NAME' => $arFields['NAME']
			);
		}
		return $arItems;
	}

	/**
	 * adds goods to Cart by ID
	 * @param $arGoods array([id, quantity])
	 * @return array of resul messages
	 */
	public function addGoodsToCartAction($arGoods)
	{
		//*$arSmsnMonitoring = array(); // array for accumulate monitoring messages
		$arErrors = array(); // array for accumulate error messages
		// add to Cart each correct record of arGoods
		$res['success'] = true;
		foreach ($arGoods as $value) {
			$arItem = array('PRODUCT_ID' => $value['id'], 'QUANTITY' => $value['quantity']);
			//*$arSmsnMonitoring[] = $arItem;
			$basketResult = \Bitrix\Catalog\Product\Basket::addProduct($arItem);
			if ($basketResult->isSuccess()) {
				// get users Cart
				$basket = \Bitrix\Sale\Basket::loadItemsForFUser(
					\Bitrix\Sale\Fuser::getId(),
					\Bitrix\Main\Context::getCurrent()->getSite()
				);
				$refreshStrategy = \Bitrix\Sale\Basket\RefreshFactory::create(\Bitrix\Sale\Basket\RefreshFactory::TYPE_FULL);
				$basket->refresh($refreshStrategy);
				$basket->save();
			} else {
				$res['success'] = false;
				// accumulate error IDs if unsuccess goods item adding
				$arErrors[] = [$value['id'], $basketResult->getErrorMessages()];
			}
		}
		//*$res['smsnMonitoring'] = $arSmsnMonitoring;
		$res['errors'] = $arErrors;

		return $res;
	}
}
