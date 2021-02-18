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

$this->IncludeComponentTemplate();
?>