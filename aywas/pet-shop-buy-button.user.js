// ==UserScript==
// @name         Pet Shop Buy Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Tiff Zhang
// @match        http://www.aywas.com/search/*
// @grant        none
// ==/UserScript==
/* jshint -W097 */
var token = "";
var i = 0;

$(document).bind('DOMNodeInserted', function(e) {
    var target = $(e.target);
    
    if (target.hasClass("pet-area-search")) {
        if (target.children(".tiffs-buy-button").length < 1) {
            token = "";
            var shopregex = /http:\/\/www\.aywas\.com\/pet_shops\/view_shop\/\?userid=(\d+)\/?/g;
            var petregex = /http:\/\/www\.aywas\.com\/pp\/view\/(\d+)\/?/g;
            var shop_url = shopregex.exec(target.html());
            var petid = petregex.exec(target.html())[1];
            var url = "http://www.aywas.com/pet_shops/buy/?shopid=%SHOPID%&petid=" + petid;
            shop_url = shop_url[0];
            
            target.append('<form action="' + url + '" id="tiff-form-' + i + '" method="post"><input class="tiffs-buy-button" type="hidden" name="token" value="%TOKEN%" />' +
                          '<a href="#" id="tiff-button-' + i + '">Buy Pet</a></form>');
            var g = i;
            var callback = function (url) {
                $("#tiff-form-" + g).attr("action", url);
                $("#tiff-form-" + g).submit();
            }
            
            $("#tiff-button-" + i).click(function() {
               get_token(shop_url, petid, callback);
            });
            
            i++; 
        } 
    }
    /*
    if ($(".tiffs-buy-button").length == $(".pet-area-search").length && $(".pet-area-search").length > 0 && token == "") {
        $.get(shop_url, function (data) {
            var tokenregex = /name="token" value="(\w+)"/g;
            token = tokenregex.exec(data)[1];
            $(".tiffs-buy-button").val(token);
        });
    }
    */
});

function get_token(shop_url, petid, callback) {
    $.get(shop_url, function (data) {
        var tokenregex = /name="token" value="(\w+)"/g;
        var shopregex = /\/pet_shops\/buy\/\?shopid=(\d+)&petid=(\d+)/g;
        var shopid = shopregex.exec(data)[1];
        token = tokenregex.exec(data)[1];
        var url = "http://www.aywas.com/pet_shops/buy/?shopid=" + shopid + "&petid=" + petid;
        $(".tiffs-buy-button").val(token);
        callback(url);
    });
};