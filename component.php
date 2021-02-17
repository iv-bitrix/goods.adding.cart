<?php
#
# Компонент множественного добавления товаров в корзину
# Размещается в любом месте страницы в виде кнопки,
# вызывающей модальную форму подбора товаров по XML_ID
#

// TODO .gif
// TODO SEF mode
// TODO cache
// TODO param add timeout for ajax start (script.js)
// TODO add price and summ optionally
// TODO vue elements adding

if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

// $arResult['DATE'] = '';

// Компонент отработает только при успешном подключении модуля Инфоблоков
if (CModule::IncludeModule("iblock")) {
?>
	<!-- Button trigger MultipleAddingToCart modal form -->
	<button type="button" class="smsn-btn-multiple-goods btn btn-primary" data-toggle="modal" data-target="#smsn-form-multiple-goods">
		GO
	</button>
	<!-- MultipleAddingToCart modal form -->
	<div id="smsn-form-multiple-goods" class="modal fade" tabindex="-1" aria-hidden="true">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<div>
						<div class="form-row align-items-center">
							<input type="text" id="smsn-input-xmlid" class="form-control" placeholder="<?= GetMessage("SMSN_XML_ID_INPUT_PLACEHOLDER") ?>">
						</div>
						<div class="form-check">
							<input class="form-check-input" type="checkbox" id="smsn-chbox-xmlid-clear" checked>
							<label class="form-check-label" for="smsn-chbox-xmlid-clear">
								<?= GetMessage("SMSN_XML_ID_INPUT_CLEAR_CAPTION") ?>
							</label>
						</div>
						<div class="form-row align-items-left">
							<div class="col-3"></div>
							<div id="smsn-preselect-list-anchor" class="col"></div>
						</div>
					</div>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div>
					<div class="modal-body">
						<div id="smsn-goods-for-adding"></div>
					</div>
					<div class="modal-footer">
						<button type="button" id="smsn-btn-add-goods-to-cart" class="btn btn-primary" data-dismiss="modal">
							<?= GetMessage("SMSN_ADD_TO_CART") ?>
						</button>
					</div>
				</div>
				<div id="smsn-preselect-list"></div>
			</div>
		</div>
	</div>

<?php

};

$this->IncludeComponentTemplate();
?>