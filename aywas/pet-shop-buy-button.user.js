// ==UserScript==
// @name         Pet Shop Buy Button
// @namespace    http://tampermonkey.net/
// @version      0.2
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


            var submit_form = function (petid, shopid, token) {
                var url = "http://www.aywas.com/pet_shops/buy/?shopid=" + shopid + "&petid=" + petid;
                $.post(url, {"token" : token}, function (data) {
                    var success = $(data).find("#content .page-notice.success");
                    $("#content > .page-notice:gt(3)").remove();
                    if (success.length) {
                        success.append("<br />You have bought <a target='_blank' href='http://www.aywas.com/pp/view/" + petid + "/'>pet " + petid + "</a>");
                        $("#content").prepend(success.prop('outerHTML'));
                    } else {
                        $("#content").prepend("<div class='page-notice error'>You have failed to buy <a target='_blank' href='http://www.aywas.com/pp/view/"
                                              + petid + "/'>pet " + petid + "</a></div>");
                    }

                });
            };

            $("#tiff-button-" + i).click(function() {
               get_token(shop_url, petid, submit_form);
            });

            i++;
        }
    }
});

function get_token(shop_url, petid, callback) {
    $.get(shop_url, function (data) {
        var tokenregex = /name="token" value="(\w+)"/g;
        var shopregex = /\/pet_shops\/buy\/\?shopid=(\d+)&petid=(\d+)/g;
        var shopid = shopregex.exec(data)[1];
        var token = tokenregex.exec(data)[1];
        callback(petid, shopid, token);
    });
};
