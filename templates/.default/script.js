
"use strict";

// min count of the symbols to start seeking goods
var minSearchLetters = 2;

// set event handlers after full load DOM elements
$(document).ready(function () {

	// show XML-ID seek results - preselect list
	$('#smsn-input-xmlid').on('keyup', function (event) {
		fillGoodsList($('#smsn-input-xmlid').val(), '#smsn-preselect-list', 'smsn-preselect-item');
		//event.preventDefault();
	});

	// put goods list to a Cart
	$('#smsn-btn-add-goods-to-cart').on('click', function (event) {
		addGoodsToCart('#smsn-goods-for-adding', 'smsn-adding-item');
		fnClear(
			['#smsn-preselect-list', '#smsn-goods-for-adding'],
			[{ elem: '#smsn-input-xmlid', prop: 'value' }]
		);
		event.preventDefault();
	});

	// hide preselect list on focusout event
	$(document).mouseup(function (e) {
		var popup = $('#smsn-preselect-list');
		if (!popup.is(e.target) && popup.has(e.target).length === 0) {
			popup.hide();
		};
	});

	// add item to goods list for adding to a Cart
	$(document).on('click', '.smsn-preselect-item', function (event) {
		addGoodsForAddingItem('#smsn-goods-for-adding', this, 'smsn-adding-item');
		if ($('#smsn-chbox-xmlid-clear').is(':checked')) {
			fnClear(
				['#smsn-preselect-list'],
				[{ elem: '#smsn-input-xmlid', prop: 'value' }]
			);
		}
		//event.preventDefault();
	});

	// delete an item from the goods list for adding to a Cart
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
 * function removes element childs optionally by CSS selector
 * clears properties
 * @param {Array(string)} containers array of elements CSS selectors which childs will be removed
 * @param {Array({elem:string, prop:string})} elements array of pairs (element, property) for clear properties
 * @returns undefined
 * @example fnClear(['.container', '#memo'], [{elem:'#form input[type=text]', prop:'value'}])
 */
function fnClear(containers = [], elements = []) {
	containers.forEach(item => {
		$(item).find('*').remove();
	});
	elements.forEach(item => {
		$(item.elem).prop(item.prop, '');
	});
};

/**
 * function creates preselect list using goods where XML-ID includes xmlId
 * @param {string} xmlId get part of XML-ID for seek
 * @param {string} groupId element ID of seek result box
 * @param {string} itemClass CSS class of found XML-ID equals elements
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
					//* at first: show; at second: set position
					$(groupId).show();
					fnSetPositionPopUpForm(groupId);
				};
			}
		});
	} else {
		fnClear([groupId]);
	}
};

/**
 * function set PopUpForm position relatively anchor
 * anchor is the eltment which have an ID {PopUpForm_ID}+'-anchor'
 * @param {string} formId PopUpForm ID
 * @returns undefined;
 */
function fnSetPositionPopUpForm(formId) {
	$(formId).offset($(formId + '-anchor').offset());
}


/**
 * function fills the items conteiner by arGoods records
 * @param {array(ID, XML_ID, NAME)} arGoods array of catalog items
 * @param {string} groupId items container css selector
 * @param {string} itemClass items class name
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
 * @param {string} groupId items container CSS selector
 * @param {object} item preselect list item
 * @param {string} itemClass new items class name
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
 * function send a list of goods to server for adding to the Cart
 * @param {string} groupId goods list container ID
 * @param {string} itemClass items class name
 * @returns {array} result comments
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
 * @param {string} groupId items container CSS selector
 * @param {object} item an event sender has information about item ID to remove from the list
 * @returns undefined
 */
function deleteGoodsFromAddingItem(groupId, item) {
	var itemId = item.dataset.parentItemId;
	$(groupId).find(`[data-item-id="${itemId}"]`).remove();
}
