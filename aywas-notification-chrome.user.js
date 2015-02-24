// ==UserScript==
// @name       Tiff's Notices Revamp
// @namespace  http://aywas.com
// @version    0.1.0.1
// @description  An improvement on the UI for notices
// @match      http://www.aywas.com/message/notices/*
// @copyright  2014+, Tiff Zhang
// ==/UserScript==

categories = [
    {'key' : 'other', 'color' : '#DCECF2'},         //0
    {'key' : 'forums', 'color' : '#beffba'},        //1
    {'key' : 'transactions', 'color' : '#ffbaba'},  //2
    {'key' : 'communication', 'color' : '#f2baff'}, //3
    {'key' : 'game', 'color' : '#fff8ba'}           //4
]

templates = [
    {
        'regex' : /<strong>(((?!\(#).)+) \(#(\d+)\)<\/strong> has sent you ([\d,]+) BP and ([\d,]+) GP. /,
        'replace' : '<a href="/up/view/$3/" class="user-name">$1</a> has sent you $4 BP and $5 GP. ',
        'category': 2
    },
    {
        'regex' : /<strong><span clas="user-name">(((?!\(#).)+) \(#(\d+)\) has replied to the message titled "([^"]+|("[^\.])+|("\.\S)+|)". <a href="http:\/\/www.aywas.com\/message\/view\/(\d+)\/">Click here to view the message<\/a>/,
        'replace' : '<a href="/up/view/$3/" class="user-name">$1</a> has replied to the message titled <a href="http://www.aywas.com/message/view/$7/">$4</a>.',
        'category': 3
    },
    {
        'regex' : /<strong>(((?!\(#).)+) \(#(\d+)\)<\/strong> has sent you ([\d,]+) <strong>([^<]+)<\/strong>.  The item\(s\) have been placed in your deposit box./,
        'replace' : '<a href="/up/view/$3/" class="user-name">$1</a> has sent you $4 <strong>$5<\/strong>.  The item\(s\) have been placed in your deposit box.',
        'category': 2
    },
    {
        'regex' : /<strong><span clas="user-name">(((?!\(#).)+) \(#(\d+)\) has sent you a message titled "([^"]+|("[^\.])+|("\.\S)+|)".  <a href="http:\/\/www.aywas.com\/message\/view\/(\d+)\/">Click here to view the message<\/a>/,
        'replace' : '<a href="/up/view/$3/" class="user-name">$1</a> has sent you the message titled <a href="http://www.aywas.com/message/view/$7/">$4</a>.',
        'category': 3
    },
    {
        'regex' : /You have recieved <strong>([\d,]+) BP<\/strong> for logging in today./,
        'category': 4
    },
    {
        'regex' : /(((?!\(#).)+)\(#(\d+)\) has mentioned you in/,
        'replace' : '<a href="/up/view/$3/" class="user-name">$1</a> has mentioned you in',
        'category': 3
    },
    {
        'regex' : 'A new post has been made by',
        'replace' : '',
        'category': 1
    },
    {
        'regex' : /<strong>([^\(]+) \(#(\d+)\)<\/strong> has recovered from it's injuries./,
        'replace' : '<a href="/pp/view/$2/">$1</a> has recovered from its injuries.',
        'category': 4
    },
    {
        'regex' : /<strong>(((?!\(#).)+) \(#(\d+)\)<\/strong> has commented on your profile!/,
        'replace' : '<a href="/up/view/$3/" class="user-name">$1</a> has commented on your profile!',
        'category': 3
    },
    
    {
        'regex' : /Why not help <span class="user-name">(((?!\(#).)+) \(#(\d+)\)<\/span>/,
        'replace' : 'Why not help <a href="/up/view/$3/" class="user-name">$1</a>',
        'category': 3
    },
]



$(document).ready(function() {
    i = 0;
    $('#noticeTable').css('border', 'none');
    $('#noticeTable > tbody > tr').each(function() {
        $(this).attr('id', "r" + i);
    
        if(i > 0) {
            $(this).addClass('notice_row');
            
            k = 0;
            template = -1;
            while(k < templates.length && template < 0) { 
                match = $(this).html().match(templates[k].regex);
                if (match) {
                    template = k;
                }
                k++;
            }
            
            cat = 0;
            if (template >= 0) {
                cat = templates[template].category;
                $(this).css('background-color', categories[cat].color);
                if (templates[template].replace) {
                    content = $(this).children('td:eq(1)');
                    content.html(content.html().replace(templates[template].regex, templates[template].replace));
                }
            }
            $(this).addClass('notice_' + categories[cat].key);
        }
        i++;
    });

    $('#r0').css('background', '#fff');
    categories[categories.length] = {'key' : 'all', 'color' : '#EFEFEF'};
    for (a = 0; a < categories.length; a++) {
        id = 'notice_' + categories[a].key;
        $('#r0 > td:last').prepend('<div id="' + id + '" class="notice_tab">' + ucfirst(categories[a].key) + '</div>');
        $('#' + id).css('float', 'left');
        $('#' + id).css('height', '26px');
        $('#' + id).css('min-width', '50px');
        $('#' + id).css('padding', '0 10px');
        $('#' + id).css('margin', '3px 8px 2px 0');
        $('#' + id).css('background-color', categories[a].color);
        $('#' + id).css('line-height', '26px');
        $('#' + id).css('cursor', 'pointer');
        
        if (categories[a].key == 'all') {
            // Add event to show all notices on click
            $('#' + id).click(function() {
                $('.notice_row').show();
            });
        } else {
            $('#' + id).click(function() {
                id = $(this).attr('id');
                $('.notice_row').hide();
                $('.' + id).show();
            });
        }
    }
})


function ucfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}