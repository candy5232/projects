/*
* jQuery Autocomplete plugin 1.1
*
* Copyright (c) 2009 Jörn Zaefferer
*
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*
* Revision: $Id: jquery.autocomplete.js 15 2009-08-22 10:30:27Z joern.zaefferer $
*/
(function($) {
    $.fn.extend({ autocomplete: function(urlOrData, options) { var isUrl = typeof urlOrData == "string"; options = $.extend({}, $.Autocompleter.defaults, { url: isUrl ? urlOrData : null, data: isUrl ? null : urlOrData, delay: isUrl ? $.Autocompleter.defaults.delay : 10, max: options && !options.scroll ? 10 : 150 }, options); options.highlight = options.highlight || function(value) { return value; }; options.formatMatch = options.formatMatch || options.formatItem; return this.each(function() { new $.Autocompleter(this, options); }); }, result: function(handler) { return this.bind("result", handler); }, search: function(handler) { return this.trigger("search", [handler]); }, flushCache: function() { return this.trigger("flushCache"); }, setOptions: function(options) { return this.trigger("setOptions", [options]); }, unautocomplete: function() { return this.trigger("unautocomplete"); } }); $.Autocompleter = function(input, options) { var KEY = { UP: 38, DOWN: 40, DEL: 46, TAB: 9, RETURN: 13, ESC: 27, COMMA: 188, PAGEUP: 33, PAGEDOWN: 34, BACKSPACE: 8 }; var $input = $(input).attr("autocomplete", "off").addClass(options.inputClass); var timeout; var previousValue = ""; var cache = $.Autocompleter.Cache(options); var hasFocus = 0; var lastKeyPressCode; var config = { mouseDownOnSelect: false }; var select = $.Autocompleter.Select(options, input, selectCurrent, config); var blockSubmit; $.browser.opera && $(input.form).bind("submit.autocomplete", function() { if (blockSubmit) { blockSubmit = false; return false; } }); $input.bind(($.browser.opera ? "keypress" : "keydown") + ".autocomplete", function(event) { hasFocus = 1; lastKeyPressCode = event.keyCode; switch (event.keyCode) { case KEY.UP: event.preventDefault(); if (select.visible()) { select.prev(); } else { onChange(0, true); } break; case KEY.DOWN: event.preventDefault(); if (select.visible()) { select.next(); } else { onChange(0, true); } break; case KEY.PAGEUP: event.preventDefault(); if (select.visible()) { select.pageUp(); } else { onChange(0, true); } break; case KEY.PAGEDOWN: event.preventDefault(); if (select.visible()) { select.pageDown(); } else { onChange(0, true); } break; case options.multiple && $.trim(options.multipleSeparator) == "," && KEY.COMMA: case KEY.TAB: case KEY.RETURN: if (selectCurrent()) { event.preventDefault(); blockSubmit = true; return false; } break; case KEY.ESC: select.hide(); break; default: clearTimeout(timeout); timeout = setTimeout(onChange, options.delay); break; } }).focus(function() { hasFocus++; }).blur(function() { hasFocus = 0; if (!config.mouseDownOnSelect) { hideResults(); } }).click(function() { if (hasFocus++ > 1 && !select.visible()) { onChange(0, true); } }).bind("search", function() { var fn = (arguments.length > 1) ? arguments[1] : null; function findValueCallback(q, data) { var result; if (data && data.length) { for (var i = 0; i < data.length; i++) { if (data[i].result.toLowerCase() == q.toLowerCase()) { result = data[i]; break; } } } if (typeof fn == "function") fn(result); else $input.trigger("result", result && [result.data, result.value]); } $.each(trimWords($input.val()), function(i, value) { request(value, findValueCallback, findValueCallback); }); }).bind("flushCache", function() { cache.flush(); }).bind("setOptions", function() { $.extend(options, arguments[1]); if ("data" in arguments[1]) cache.populate(); }).bind("unautocomplete", function() { select.unbind(); $input.unbind(); $(input.form).unbind(".autocomplete"); }); function selectCurrent() { var selected = select.selected(); if (!selected) return false; var v = selected.result; previousValue = v; if (options.multiple) { var words = trimWords($input.val()); if (words.length > 1) { var seperator = options.multipleSeparator.length; var cursorAt = $(input).selection().start; var wordAt, progress = 0; $.each(words, function(i, word) { progress += word.length; if (cursorAt <= progress) { wordAt = i; return false; } progress += seperator; }); words[wordAt] = v; v = words.join(options.multipleSeparator); } v += options.multipleSeparator; } $input.val(v); hideResultsNow(); $input.trigger("result", [selected.data, selected.value]); return true; } function onChange(crap, skipPrevCheck) { if (lastKeyPressCode == KEY.DEL) { select.hide(); return; } var currentValue = $input.val(); if (!skipPrevCheck && currentValue == previousValue) return; previousValue = currentValue; currentValue = lastWord(currentValue); if (currentValue.length >= options.minChars) { $input.addClass(options.loadingClass); if (!options.matchCase) currentValue = currentValue.toLowerCase(); request(currentValue, receiveData, hideResultsNow); } else { stopLoading(); select.hide(); } }; function trimWords(value) { if (!value) return [""]; if (!options.multiple) return [$.trim(value)]; return $.map(value.split(options.multipleSeparator), function(word) { return $.trim(value).length ? $.trim(word) : null; }); } function lastWord(value) { if (!options.multiple) return value; var words = trimWords(value); if (words.length == 1) return words[0]; var cursorAt = $(input).selection().start; if (cursorAt == value.length) { words = trimWords(value) } else { words = trimWords(value.replace(value.substring(cursorAt), "")); } return words[words.length - 1]; } function autoFill(q, sValue) { if (options.autoFill && (lastWord($input.val()).toLowerCase() == q.toLowerCase()) && lastKeyPressCode != KEY.BACKSPACE) { $input.val($input.val() + sValue.substring(lastWord(previousValue).length)); $(input).selection(previousValue.length, previousValue.length + sValue.length); } }; function hideResults() { clearTimeout(timeout); timeout = setTimeout(hideResultsNow, 200); }; function hideResultsNow() { var wasVisible = select.visible(); select.hide(); clearTimeout(timeout); stopLoading(); if (options.mustMatch) { $input.search(function(result) { if (!result) { if (options.multiple) { var words = trimWords($input.val()).slice(0, -1); $input.val(words.join(options.multipleSeparator) + (words.length ? options.multipleSeparator : "")); } else { $input.val(""); $input.trigger("result", null); } } }); } }; function receiveData(q, data) { if (data && data.length && hasFocus) { stopLoading(); select.display(data, q); autoFill(q, data[0].value); select.show(); } else { hideResultsNow(); } }; function request(term, success, failure) { if (!options.matchCase) term = term.toLowerCase(); var data = cache.load(term); if (data && data.length) { success(term, data); } else if ((typeof options.url == "string") && (options.url.length > 0)) { var extraParams = { timestamp: +new Date() }; $.each(options.extraParams, function(key, param) { extraParams[key] = typeof param == "function" ? param() : param; }); $.ajax({ mode: "abort", port: "autocomplete" + input.name, dataType: options.dataType, url: options.url, data: $.extend({ q: lastWord(term), limit: options.max }, extraParams), success: function(data) { var parsed = options.parse && options.parse(data) || parse(data); cache.add(term, parsed); success(term, parsed); } }); } else { select.emptyList(); failure(term); } }; function parse(data) { var parsed = []; var rows = data.split("\n"); for (var i = 0; i < rows.length; i++) { var row = $.trim(rows[i]); if (row) { row = row.split("|"); parsed[parsed.length] = { data: row, value: row[0], result: options.formatResult && options.formatResult(row, row[0]) || row[0] }; } } return parsed; }; function stopLoading() { $input.removeClass(options.loadingClass); }; }; $.Autocompleter.defaults = { inputClass: "ac_input", resultsClass: "ac_results", loadingClass: "ac_loading", minChars: 1, delay: 400, matchCase: false, matchSubset: true, matchContains: false, cacheLength: 10, max: 100, mustMatch: false, extraParams: {}, selectFirst: true, formatItem: function(row) { return row[0]; }, formatMatch: null, autoFill: false, width: 0, multiple: false, multipleSeparator: ", ", highlight: function(value, term) { return value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>"); }, scroll: true, scrollHeight: 180 }; $.Autocompleter.Cache = function(options) {
        var data = {}; var length = 0; function matchSubset(s, sub) { if (!options.matchCase) s = s.toLowerCase(); var i = s.indexOf(sub); if (options.matchContains == "word") { i = s.toLowerCase().search("\\b" + sub.toLowerCase()); } if (i == -1) return false; return i == 0 || options.matchContains; }; function add(q, value) { if (length > options.cacheLength) { flush(); } if (!data[q]) { length++; } data[q] = value; } function populate() { if (!options.data) return false; var stMatchSets = {}, nullData = 0; if (!options.url) options.cacheLength = 1; stMatchSets[""] = []; for (var i = 0, ol = options.data.length; i < ol; i++) { var rawValue = options.data[i]; rawValue = (typeof rawValue == "string") ? [rawValue] : rawValue; var value = options.formatMatch(rawValue, i + 1, options.data.length); if (value === false) continue; var firstChar = value.charAt(0).toLowerCase(); if (!stMatchSets[firstChar]) stMatchSets[firstChar] = []; var row = { value: value, data: rawValue, result: options.formatResult && options.formatResult(rawValue) || value }; stMatchSets[firstChar].push(row); if (nullData++ < options.max) { stMatchSets[""].push(row); } }; $.each(stMatchSets, function(i, value) { options.cacheLength++; add(i, value); }); } setTimeout(populate, 25); function flush() { data = {}; length = 0; } return { flush: flush, add: add, populate: populate, load: function(q) {
            if (!options.cacheLength || !length) return null; if (!options.url && options.matchContains) { var csub = []; for (var k in data) { if (k.length > 0) { var c = data[k]; $.each(c, function(i, x) { if (matchSubset(x.value, q)) { csub.push(x); } }); } } return csub; } else
                if (data[q]) { return data[q]; } else
                if (options.matchSubset) { for (var i = q.length - 1; i >= options.minChars; i--) { var c = data[q.substr(0, i)]; if (c) { var csub = []; $.each(c, function(i, x) { if (matchSubset(x.value, q)) { csub[csub.length] = x; } }); return csub; } } } return null;
        }
        };
    }; $.Autocompleter.Select = function(options, input, select, config) { var CLASSES = { ACTIVE: "ac_over" }; var listItems, active = -1, data, term = "", needsInit = true, element, list; function init() { if (!needsInit) return; element = $("<div/>").hide().addClass(options.resultsClass).css("position", "absolute").appendTo(document.body); list = $("<ul/>").appendTo(element).mouseover(function(event) { if (target(event).nodeName && target(event).nodeName.toUpperCase() == 'LI') { active = $("li", list).removeClass(CLASSES.ACTIVE).index(target(event)); $(target(event)).addClass(CLASSES.ACTIVE); } }).click(function(event) { $(target(event)).addClass(CLASSES.ACTIVE); select(); input.focus(); return false; }).mousedown(function() { config.mouseDownOnSelect = true; }).mouseup(function() { config.mouseDownOnSelect = false; }); if (options.width > 0) element.css("width", options.width); needsInit = false; } function target(event) { var element = event.target; while (element && element.tagName != "LI") element = element.parentNode; if (!element) return []; return element; } function moveSelect(step) { listItems.slice(active, active + 1).removeClass(CLASSES.ACTIVE); movePosition(step); var activeItem = listItems.slice(active, active + 1).addClass(CLASSES.ACTIVE); if (options.scroll) { var offset = 0; listItems.slice(0, active).each(function() { offset += this.offsetHeight; }); if ((offset + activeItem[0].offsetHeight - list.scrollTop()) > list[0].clientHeight) { list.scrollTop(offset + activeItem[0].offsetHeight - list.innerHeight()); } else if (offset < list.scrollTop()) { list.scrollTop(offset); } } $(input).val(activeItem.text()); }; function movePosition(step) { active += step; if (active < 0) { active = listItems.size() - 1; } else if (active >= listItems.size()) { active = 0; } } function limitNumberOfItems(available) { return options.max && options.max < available ? options.max : available; } function fillList() { list.empty(); var max = limitNumberOfItems(data.length); for (var i = 0; i < max; i++) { if (!data[i]) continue; var formatted = options.formatItem(data[i].data, i + 1, max, data[i].value, term); if (formatted === false) continue; var li = $("<li/>").html(options.highlight(formatted, term)).addClass(i % 2 == 0 ? "ac_even" : "ac_odd").appendTo(list)[0]; $.data(li, "ac_data", data[i]); } listItems = list.find("li"); if (options.selectFirst) { listItems.slice(0, 1).addClass(CLASSES.ACTIVE); active = 0; } if ($.fn.bgiframe) list.bgiframe(); } return { display: function(d, q) { init(); data = d; term = q; fillList(); }, next: function() { moveSelect(1); }, prev: function() { moveSelect(-1); }, pageUp: function() { if (active != 0 && active - 8 < 0) { moveSelect(-active); } else { moveSelect(-8); } }, pageDown: function() { if (active != listItems.size() - 1 && active + 8 > listItems.size()) { moveSelect(listItems.size() - 1 - active); } else { moveSelect(8); } }, hide: function() { element && element.hide(); listItems && listItems.removeClass(CLASSES.ACTIVE); active = -1; }, visible: function() { return element && element.is(":visible"); }, current: function() { return this.visible() && (listItems.filter("." + CLASSES.ACTIVE)[0] || options.selectFirst && listItems[0]); }, show: function() { var offset = $(input).offset(); element.css({ width: typeof options.width == "string" || options.width > 0 ? options.width : $(input).width(), top: offset.top + input.offsetHeight, left: offset.left - 3 }).show(); if (options.scroll) { list.scrollTop(0); list.css({ maxHeight: options.scrollHeight, overflow: 'auto' }); if ($.browser.msie && typeof document.body.style.maxHeight === "undefined") { var listHeight = 0; listItems.each(function() { listHeight += this.offsetHeight; }); var scrollbarsVisible = listHeight > options.scrollHeight; list.css('height', scrollbarsVisible ? options.scrollHeight : listHeight); if (!scrollbarsVisible) { listItems.width(list.width() - parseInt(listItems.css("padding-left")) - parseInt(listItems.css("padding-right"))); } } } }, selected: function() { var selected = listItems && listItems.filter("." + CLASSES.ACTIVE).removeClass(CLASSES.ACTIVE); return selected && selected.length && $.data(selected[0], "ac_data"); }, emptyList: function() { list && list.empty(); }, unbind: function() { element && element.remove(); } }; }; $.fn.selection = function(start, end) { if (start !== undefined) { return this.each(function() { if (this.createTextRange) { var selRange = this.createTextRange(); if (end === undefined || start == end) { selRange.move("character", start); selRange.select(); } else { selRange.collapse(true); selRange.moveStart("character", start); selRange.moveEnd("character", end); selRange.select(); } } else if (this.setSelectionRange) { this.setSelectionRange(start, end); } else if (this.selectionStart) { this.selectionStart = start; this.selectionEnd = end; } }); } var field = this[0]; if (field.createTextRange) { var range = document.selection.createRange(), orig = field.value, teststring = "<->", textLength = range.text.length; range.text = teststring; var caretAt = field.value.indexOf(teststring); field.value = orig; this.selection(caretAt, caretAt + textLength); return { start: caretAt, end: caretAt + textLength} } else if (field.selectionStart !== undefined) { return { start: field.selectionStart, end: field.selectionEnd} } };
})(jQuery);


/*
* jqModal - Minimalist Modaling with jQuery
*   (http://dev.iceburg.net/jquery/jqModal/)
* $Version: 03/01/2009 +r14
*/
(function($) {
    $.fn.jqm = function(o) {
        var p = {
            overlay: 50,
            overlayClass: 'jqmOverlay',
            closeClass: 'jqmClose',
            trigger: '.jqModal',
            ajax: F,
            ajaxText: '',
            target: F,
            modal: F,
            toTop: F,
            onShow: F,
            onHide: F,
            onLoad: F
        };
        return this.each(function() {
            if (this._jqm) return H[this._jqm].c = $.extend({}, H[this._jqm].c, o); s++; this._jqm = s;
            H[s] = { c: $.extend(p, $.jqm.params, o), a: F, w: $(this).addClass('jqmID' + s), s: s };
            if (p.trigger) $(this).jqmAddTrigger(p.trigger);
        });
    };

    $.fn.jqmAddClose = function(e) { return hs(this, e, 'jqmHide'); };
    $.fn.jqmAddTrigger = function(e) { return hs(this, e, 'jqmShow'); };
    $.fn.jqmShow = function(t) { return this.each(function() { t = t || window.event; $.jqm.open(this._jqm, t); }); };
    $.fn.jqmHide = function(t) { return this.each(function() { t = t || window.event; $.jqm.close(this._jqm, t) }); };

    $.jqm = {
        hash: {},
        open: function(s, t) {
            var h = H[s], c = h.c, cc = '.' + c.closeClass, z = (parseInt(h.w.css('z-index'))), z = (z > 0) ? z : 10000, o = $('<div></div>').css({ height: '100%', width: '100%', position: 'fixed', left: 0, top: 0, 'z-index': z - 1, opacity: c.overlay / 100 }); if (h.a) return F; h.t = t; h.a = true; h.w.css('z-index', z);
            if (c.modal) { A.push(s); }
            else if (c.overlay > 0) h.w.jqmAddClose(o);
            else o = F;

            h.o = (o) ? o.addClass(c.overlayClass).prependTo('body') : F;
            if (ie6) { $('html,body').css({ height: '100%', width: '100%' }); if (o) { o = o.css({ position: 'absolute' })[0]; for (var y in { Top: 1, Left: 1 }) o.style.setExpression(y.toLowerCase(), "(_=(document.documentElement.scroll" + y + " || document.body.scroll" + y + "))+'px'"); } }

            if (c.ajax) {
                var r = c.target || h.w, u = c.ajax, r = (typeof r == 'string') ? $(r, h.w) : $(r), u = (u.substr(0, 1) == '@') ? $(t).attr(u.substring(1)) : u;
                r.html(c.ajaxText).load(u, function() { if (c.onLoad) c.onLoad.call(this, h); if (cc) h.w.jqmAddClose($(cc, h.w)); e(h); });
            }
            else if (cc) h.w.jqmAddClose($(cc, h.w));

            if (c.toTop && h.o) h.w.before('<span id="jqmP' + h.w[0]._jqm + '"></span>').insertAfter(h.o);
            (c.onShow) ? c.onShow(h) : h.w.show(); e(h); return F;
        },
        close: function(s) {
            var h = H[s]; if (!h.a) return F; h.a = F;
            if (A[0]) { A.pop(); if (!A[0]) L('unbind'); }
            if (h.c.toTop && h.o) $('#jqmP' + h.w[0]._jqm).after(h.w).remove();
            if (h.c.onHide) h.c.onHide(h); else { h.w.hide(); if (h.o) h.o.remove(); } return F;
        },
        params: {}
    };
    var s = 0, H = $.jqm.hash, A = [], ie6 = $.browser.msie && ($.browser.version == "6.0"), F = false,
i = $('<iframe src="javascript:false;document.write(\'\');" class="jqm"></iframe>').css({ opacity: 0 }),
e = function(h) { if (ie6) if (h.o) h.o.html('<p style="width:100%;height:100%"/>').prepend(i); else if (!$('iframe.jqm', h.w)[0]) h.w.prepend(i); f(h); },
f = function(h) { try { $(':input:visible', h.w)[0].focus(); } catch (_) { } },
L = function(t) { $()[t]("keypress", m)[t]("keydown", m)[t]("mousedown", m); },
m = function(e) { var h = H[A[A.length - 1]], r = (!$(e.target).parents('.jqmID' + h.s)[0]); if (r) f(h); return !r; },
hs = function(w, t, c) {
    return w.each(function() {
        var s = this._jqm; $(t).each(function() {
            if (!this[c]) { this[c] = []; $(this).click(function() { for (var i in { jqmShow: 1, jqmHide: 1 }) for (var s in this[i]) if (H[this[i][s]]) H[this[i][s]].w[i](this); return F; }); } this[c].push(s);
        });
    });
};
})(jQuery);


//sSubName Cookie子键名，留空表示单值Cookie
function GetCookie(sMainName, sSubName) {
    var re = new RegExp((sSubName ? sMainName + "=(?:.*?&)*?" + sSubName + "=([^&;$]*)" : sMainName + "=([^;$]*)"), "i");
    try {
        return re.test(decodeURIComponent(document.cookie)) ? RegExp["$1"] : "";
    }
    catch (err) {
        return re.test(unescape(document.cookie)) ? RegExp["$1"] : "";
    }
}

//cookie过期
function eraseCookie(name) {
    createCookie(name, "", -1);
}

//读取cookie
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
//创建cookie      
function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + ";domain=uzai.com;path=/";
}


function getURLRefer() {
    return document.referrer;
}

function getcurrentURL() {
    return location.href;
}

//dj 20120921 400推广
(function save400URLReferToCookie() {
    var cookiename = "400URLRefer";
    var resulturl = readCookie(cookiename);
    if (resulturl != null && resulturl != "")
        return;
    var referUrl = getURLRefer();      //上一次URL
	var currUrl = getcurrentURL(); //当前URL
    if(referUrl.indexOf("mafengwo")>0 || currUrl.indexOf("mafengwo1")>0){
		createCookie(cookiename, "mafengwo", 7);
	}
    
    
})();
function set400Phone(){
	var Phone = "400-000-8888";
	var cookiename = "400URLRefer";
	var c = readCookie(cookiename);
    if (c=="mafengwo"){
        Phone="400-633-2700";
	}
	$(".hd_telnumber").html(Phone);
}


//钟良敏 20120827 modify  --begin
function saveURLReferToCookie() {
    var cookiename = "uzaiURLRefer";
    var resulturl = readCookie(cookiename);
    if (resulturl != null && resulturl != "")
        return;
    var referUrl = getURLRefer();      //上一次URL
    var currentUrl = getcurrentURL();  //当前URL
    var sourceUrl = getSourceUrl(referUrl, currentUrl);
    if ((sourceUrl == null || sourceUrl == "") && referUrl != null && referUrl != "") {
        sourceUrl = referUrl;
    }
    else if ((sourceUrl == null || sourceUrl == "") && currentUrl != null && currentUrl!="") {
        sourceUrl = currentUrl;
    }
    createCookie(cookiename, sourceUrl, 1);
}

function saveCPSReferToCookie() {
    var cookiename = "uzaiNewURLRefer";
    var resulturl = readCookie(cookiename);
    var referUrl = getURLRefer();      //上一次URL
    var currentUrl = getcurrentURL();  //当前URL
    var sourceUrl = getSourceUrl(referUrl, currentUrl);
    if (sourceUrl != null && sourceUrl != "") {
        createCookie(cookiename, sourceUrl, 1);
        return;
    }
    if (resulturl != null && resulturl != "") {
        return;
    }
    if ((sourceUrl == null || sourceUrl == "") && referUrl != null && referUrl != "") {
        sourceUrl = referUrl;
    }
    else if ((sourceUrl == null || sourceUrl == "") && currentUrl != null && currentUrl != "") {
        sourceUrl = currentUrl;
    }
    createCookie(cookiename, sourceUrl, 1);
}

function getSourceUrl(referUrl, currentUrl) {
    var sourceUrl;
    if (currentUrl.indexOf("?sem") > 0 || currentUrl.indexOf("utm_source") > 0) {
        sourceUrl = currentUrl;
    }
    else if (currentUrl.indexOf("source") > 0 && currentUrl.indexOf("panku") > 0) {
        sourceUrl = currentUrl;
    }
    else if (currentUrl.indexOf("source") > 0 && currentUrl.indexOf("uzai") > 0) {
        sourceUrl = currentUrl;
    }
    else if (currentUrl.indexOf("haoid") > 0) {
        sourceUrl = currentUrl;
    }
    else if (currentUrl.indexOf("edm=kuaiqian") > 0) {
        sourceUrl = currentUrl;
    }
    else if (currentUrl.indexOf("gclid") > 0 && referUrl == "") {
        sourceUrl = 'www.baidu.com' + '--T;'
    }
    else if (currentUrl.indexOf("bdclkid") > 0 && referUrl == "") {
        sourceUrl = 'www.google.com.hk' + '--T';
    }
    else if (currentUrl.indexOf("laokehu") > 0 && referUrl.indexOf("uzai") < 0) {
        sourceUrl = referUrl + '--currentUrl';
    }
    else if (currentUrl.indexOf("uzai") > 0 && referUrl.indexOf("yiqifa.com") > 0) {
        sourceUrl = referUrl;
    }
    else if (referUrl.indexOf("uzai") < 0) {
        sourceUrl = referUrl;
    }
    else if (currentUrl.indexOf("uzai") < 0) {
        sourceUrl = currentUrl;
    }
    return sourceUrl;
}

//钟良敏 20120827 modify  --end




/**创建Cookie**/
//创建Cookie (cookie名,子键名,值)  子键名为空时value表示Cookie的值， 子键存在时，value为子键值。
//setCookie('test','u1','1')  1、存在name为'test'的Cookie，该方法做创建或修改name为u1的子键，子键值为1。 2、不存在name为'test'的Cookie，则创建Cookie再执行1、
//setCookie('test','u1') 创建或修改一个子键。有则修改无则创建。 该子键不存在值。
//setCookie('test',null,'c1=1&c2=2&c3&c4')  直接创建或修改Cookie的值， 实际上每个子键用‘&’隔开。子键名个子键值用‘=’隔开，没有‘=’表示该子键没有值，只有子键名
function setCookie(name, key, value) {
    var Days = 1;
    if (name == "yqf") {
        Days = 30;
    }
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    if (key == null || key == "") {
        document.cookie = name + "=" + encodeURI(value) + ";expires=" + exp.toGMTString() + ";domain=uzai.com;path=/";
    }
    else {
        var nameValue = getCookie(name);
        if (nameValue == "" || nameValue == null) {
            if (value != "" && value != null)
                document.cookie = name + "=" + key + "=" + encodeURI(value) + ";expires=" + exp.toGMTString() + ";domain=uzai.com;path=/";
            else
                document.cookie = name + "=" + key + ";expires=" + exp.toGMTString() + ";domain=uzai.com;path=/";
        }
        else {
            var keyValue = getCookie(name, key);
            if (keyValue != "" && keyValue != null) {
                if (value != "" && value != null)
                    nameValue = nameValue.replace(keyValue, key + "=" + encodeURI(value));
                else
                    nameValue = nameValue.replace(keyValue, key);
                document.cookie = name + "=" + nameValue + ";expires=" + exp.toGMTString() + ";domain=uzai.com;path=/";
            }
            else {
                if (value != "" && value != null)
                    document.cookie = name + "=" + nameValue + "&" + key + "=" + encodeURI(value) + ";expires=" + exp.toGMTString() + ";domain=uzai.com;path=/";
                else
                    document.cookie = name + "=" + nameValue + "&" + key + ";expires=" + exp.toGMTString() + ";domain=uzai.com;path=/";
            }
        }
    }
}

//读取cookies     (cookie名，子键名) 子键名为空的话返回该cookie值，子键存在的话返回该子键的值
function getCookie(name, key) {
    var nameValue = "";
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        nameValue = decodeURI(arr[2]);
    }
    if (key != null && key != "") {
        reg = new RegExp("([&]?)(" + key + "[=]?[^&]*)([&]?)");
        if (arr = nameValue.match(reg)) {
            return decodeURI(arr[2]);
        }
        else return "";
    }
    else {
        return nameValue;
    }
}


