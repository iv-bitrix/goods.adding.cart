
"use strict";

var minSearchLetters = 2;

// set event handlers after full load DOM elements
$(document).ready(function () {

	// XML-ID seek results PopUp form position set
	$('#smsn-form-multiple-goods').on('focus', function (event) {
		fnSetPositionPopUpForm('#smsn-preselect-list');
		//event.preventDefault();
	});

	//show XML-ID seek results
	$('#smsn-input-xmlid').on('change keyup', function (event) {
		fillGoodsList($('#smsn-input-xmlid').val(), '#smsn-preselect-list', 'smsn-preselect-item');
		//event.preventDefault();
	});

	// put goods list to a Cart
	$('#smsn-btn-add-goods-to-cart').on('click', function (event) {
		addGoodsToCart('#smsn-goods-for-adding', 'smsn-adding-item');
		event.preventDefault();
	});

	// add item to goods list for adding to a Cart
	$(document).on('click', '.smsn-preselect-item', function (event) {
		addGoodsForAddingItem('#smsn-goods-for-adding', this, 'smsn-adding-item');
		if ($('#smsn-chbox-xmlid-clear').is(':checked')) {
			$('#smsn-input-xmlid').val('');
			fnClearHideContainer('#smsn-preselect-list');
		}
		//event.preventDefault();
	});

	// delete item to goods list for adding to a Cart
	$(document).on('click', '.smsn-delete-item', function (event) {
		deleteGoodsFromAddingItem('#smsn-goods-for-adding', this);
		event.preventDefault();
	});

	// inspect adding goods quantity correctness
	$(document).on('focusout', '.smsn-quantity', function (event) {
		 if ($(this).val() < parseInt($(this).prop('min'))) {
			$(this).val(parseInt($(this).prop('min')));
		 }
	});

});

/**
 * function remove childs and hide element optionally by ID
 * @param {string} container element ID
 * @returns undefined
 */
// TODO 1) remove childs 1.1) hide optionally 2) clear .val() 
function fnClearHideContainer(container) {
	$(container).find('*').remove();
	$(container).hide();
};

/**
 * function creates preselect list using goods where XML-ID includes xmlId
 * @param xmlId string get part of XML-ID for seek
 * @param groupId string element ID of seek result box
 * @param itemClass string CSS class of found XML-ID equals elements
 * @returns undefined
 */
function fillGoodsList(xmlId, groupId, itemClass) {
	// start seeking after get more then minimum count of XML-ID symbols
	// else hide result box
	if (xmlId.length >= minSearchLetters) {
		BX.ajax.runComponentAction('samson:goods.adding.cart', 'getGoodsList', {
			mode: 'ajax',
			data: {
				xmlId: xmlId
			}
		}).then(function (response) {
			//console.log(response);
			if (response['errors'].length == 0) {
				if (fnCreateHtmlList(groupId, response['data'], itemClass) > 0) {
					$(groupId).show();
				};
			}
		});
	} else {
		fnClearHideContainer(groupId);
	}
};

/**
 * function set PopUpForm position relatively anchor
 * anchor is the eltment which have an ID {PopUpForm_ID}+'-anchor'
 * @param formId string PopUpForm ID
 * @returns undefined;
 */
function fnSetPositionPopUpForm(formId) {
	var obj = $(formId);
	var anchor = $(formId + '-anchor');
	//obj.css('position', 'fixed');
	obj.offset({ top: 0, left: 0 });
	obj.offset(anchor.offset());
}


/**
 * function fills the items conteiner by arGoods records
 * @param arGoods array of catalog items as array(ID, XML_ID, NAME)
 * @param groupId string items container css selector
 * @param itemClass string items class name
 * @returns count of found items
 */
function fnCreateHtmlList(groupId, arGoods, itemClass) {
	$(groupId).find(`.${itemClass}`).remove();
	arGoods.forEach(item => {
		let itemHtml = `<div class="${itemClass} list-group-item list-group-item-action"`
			+ `data-item-id="${item['ID']}">`
			+ `<strong>${item['XML_ID']}</strong>&nbsp;`
			+ `<span>${item['NAME']}</span></div>`;
		$(groupId).append(itemHtml);
	});
	return arGoods.length;
}

/**
 * function moves a goods item from the preselect group to the adding group
 * @param groupId string items container ID
 * @param item item from preselect list
 * @param itemClass string new items class name
 * @returns undefined
 */
function addGoodsForAddingItem(groupId, item, itemClass) {
	var itemId = item.dataset.itemId;
	var exists = $(groupId).find(`[data-item-id="${itemId}"]`);
	if (exists.length) {
		let quantity = exists.find('.smsn-quantity');
		quantity.val(parseInt(quantity.val()) + 1);
	} else {
		let itemHtml = `<div class="${itemClass} input-group" data-item-id="${itemId}">`
			+ `<div class="input-group-prepend">`
			+ `<span class="input-group-text">${$(item).children('strong').html()}</span>`
			+ `</div>`
			+ `<input type="text" class="form-control" disabled value="${$(item).children('span').html()}">`
			+ `<input type="number" value="1"  min="1" class="smsn-quantity form-control col-3">`
			+ `<div class="input-group-append">`
			+ `<span class="input-group-text smsn-delete-item" data-parent-item-id="${itemId}">X</span>`
			+ `</div>`
			+ `</div>`;
		$(groupId).prepend(itemHtml);
	}
}

/**
 * function send list of goods to server for adding to the Cart
 * @param groupId string goods list container ID
 * @param itemClass string items class name
 * @returns array of result comments
 */
function addGoodsToCart(groupId, itemClass) {
	var arGoods = [];
	$(groupId).children(`.${itemClass}`).each(function () {
		let item = {};
		item.id = this.dataset.itemId;
		item.quantity = parseInt($(this).find('.smsn-quantity').val());
		arGoods.push(item);
	});
	console.log(arGoods);
	BX.ajax.runComponentAction('samson:goods.adding.cart', 'addGoodsToCart', {
		mode: 'ajax',
		data: {
			arGoods: arGoods
		}
	}).then(function (response) {
		if (response['errors'].length == 0) {
			// TODO how mach goods added

		}
	});
	BX.onCustomEvent('OnBasketChange');
}

/**
 * function removes a goods item from the adding group
 * @param groupId string items container ID
 * @param item event sender has information about item ID to remove from the list
 * @returns undefined
 */
function deleteGoodsFromAddingItem(groupId, item) {
	var itemId = item.dataset.parentItemId;
	$(groupId).find(`[data-item-id="${itemId}"]`).remove();
}
