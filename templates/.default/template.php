<?php
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();

CJSCore::Init(array('bx', 'jquery', 'ajax'));

// component will work only if iblock is included successfully
if (CModule::IncludeModule("iblock")) {

	//set the style of the button that opens a modal form for group adding goods
	$btnStyle = isset($arParams['CART_BUTTON_STYLE']) ? $arParams['CART_BUTTON_STYLE']:'btn-link';
	//default value of minimum symbols to start seeking is 2
	$symbolCount = isset($arParams['START_SEEK_SYMBOL_COUNT']) ? $arParams['START_SEEK_SYMBOL_COUNT'] : 2;

?>
	<!-- Button trigger MultipleAddingToCart modal form -->
	<button type="button" class="smsn-btn-multiple-goods btn <?= $btnStyle ?>" data-toggle="modal" data-target="#smsn_form_multiple_goods">
		<?= GetMessage("SMSN_CART_BUTTON_CAPTION") ?>
	</button>
	<!-- MultipleAddingToCart modal form -->
	<div id="smsn_form_multiple_goods" class="modal fade" tabindex="-1" aria-hidden="true">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<div>
						<div class="form-row align-items-center">
							<input type="text" id="smsn_input_xmlid" class="form-control" data-seek-symbol-count="<?= $symbolCount ?>" placeholder="<?= GetMessage("SMSN_XML_ID_INPUT_PLACEHOLDER") ?>">
						</div>
						<div class="form-check">
							<input class="form-check-input" type="checkbox" id="smsn_chbox_xmlid_clear" checked>
							<label class="form-check-label" for="smsn_chbox_xmlid_clear">
								<?= GetMessage("SMSN_XML_ID_INPUT_CLEAR_CAPTION") ?>
							</label>
						</div>
						<div class="form-row align-items-left">
							<div class="col-3"></div>
							<div id="smsn_preselect_list_anchor" class="col"></div>
						</div>
					</div>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div>
					<div class="modal-body">
						<div id="smsn_goods_for_adding"></div>
					</div>
					<div class="modal-footer">
						<button type="button" id="smsn_btn_add_goods_to_cart" class="btn btn-primary" data-dismiss="modal">
							<?= GetMessage("SMSN_ADD_TO_CART") ?>
						</button>
					</div>
				</div>
				<div id="smsn_preselect_list"></div>
			</div>
		</div>
	</div>
<?php
}
