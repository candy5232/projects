(function($) {
    $.fn.Tabs = function(options) {//tabs box
        var defaults = {
            clickId: ".hd",
            showBox: ".box1",
            active: "on",
            type: "mouseover"
        };
        var opts = $.extend(defaults, options);
        this.each(function() {
            var $self = $(this);
            var $li = $self.find(opts.clickId).find("li");
            var $showbox = $self.find(opts.showBox);
            $li.each(function(i) {
                var _this = $(this);
                _this.bind(opts.type, function() {
                    _this.addClass(opts.active).siblings().removeClass(opts.active);
                    $showbox.hide().eq(i).show().find("img[data-img]").each(function() {
                        var src = $(this).attr("data-img");
                        $(this).attr("src", src);
                        $(this).show().css("opacity", "1");
                    });
                    return false;
                });
            });
        });
    };
})(jQuery)
//right listTab
$.fn.ListTab = function(n, obj) {
    this.each(function() {
        $(this).find(".Mdbox a").each(function(i) {
            $(this).click(function() {
                var typeNum = $(this).parent().attr("typeNum");
                $(".hd[typeNum=" + typeNum + "] li.liflag").hide();
                var $last = $(".hd[typeNum=" + typeNum + "] li:eq(" + Number(i + n) + ")");
                $last.show().addClass("on").siblings().removeClass("on");
                $(".bd[typeNum=" + typeNum + "]").find(obj).hide();
                $(".bd[typeNum=" + typeNum + "]").find(obj).eq(i + n).show().find("img[data-img]").each(function() {
                    var src = $(this).attr("data-img");
                    $(this).attr("src", src);
                });
            });
        });
    });
};
$(function() {
    //1.72修改为1.3的滚动
    uzaiIndexBannerSlide();
    $("#slides").noTime();
    $(".infinite").noTime();
    // Hot Sale
    $(".likeList li").mouseover(function() {
        $(this).find(".H_samll").hide();
        $(this).siblings().find(".H_samll").show();
        $(this).find(".H_big").show();
        $(this).siblings().find(".H_big").hide();
        var Img = $(this).find("img[data-img]");
        Img.attr("src", Img.attr("data-img"));
    });
    //load tabs
    $(".strategy").Tabs({
        clickId: ".strategyTie",
        showBox: ".strategy-List",
        type: "mouseover"
    });

    $(".hotsell").Tabs({
        clickId: ".hd",
        showBox: ".HotListBox",
        type: "click"
    });
    //
    $(".Moremd").hover(function() {
        $(this).find(".Moremd_a").addClass("Moremd_on");
        $(this).find(".Mdbox").show();
    }, function() {
        $(this).find(".Moremd_a").removeClass("Moremd_on");
        $(this).find(".Mdbox").hide();
    });
    $(".hotsell").ListTab(5, '.HotListBox');

    //Addimg border
    $(".luxianList li").hover(function() {
        $(this).addClass("green");
    }, function() {
        $(this).removeClass("green");
    });
    //remove outline
    $(".btn,.btn1,.strategyTie li a,.hotsell .hd li a,.Mdbox a").focus(function() {
        if (this.blur) {
            $(this).blur();
        };
    });
    //destinationList
    $(".destinationList h4 a").toggle(function() {
        $(this).addClass("cur");
        $(this).parent().next().hide();
    }, function() {
        $(this).removeClass("cur");
        $(this).parent().next().show();
    });


    $(".destinationList a.cur").toggle(function() {
        $(this).removeClass("cur");
        $(this).parent().next().show();
    }, function() {
        $(this).addClass("cur");
        $(this).parent().next().hide();
    });

    $(".themeHot_top a").click(function() {
        $(this).addClass("cur").siblings().removeClass("cur");
    });
});


$(function() {
    $(".desBox-cenList").eq(0).find("img[data-img]").each(function(i) {
        var dasrc = $(this).attr("data-img");
        $(this).attr("src", dasrc);
    });
    $(".Hotcity:visible").find("img[data-img]").each(function() {
        var dasrc = $(this).attr("data-img");
         $(this).attr("src", dasrc);
    });
    $(".hd_srhBox").hover(function() {
        $(".srhBox_val").addClass("srhBox_cur");
        $(".hd_search .s1").addClass("chuizhi");
        $(".hd_srhSe").show();
    }, function() {
        $(".srhBox_val").removeClass("srhBox_cur");
        $(".hd_search .s1").removeClass("chuizhi");
        $(".hd_srhSe").hide();
    });

    $(".hd_srhSe a").click(function() {
        var val = $(this).text();
        $(this).addClass("current").siblings().removeClass("current");
        $("#srhInput").val(val);
        $(".srhBox_val").text(val);
        $(".hd_srhSe").hide();
    });
    $(".hotsell .HotListBox li:nth-child(5)").addClass("bor-bo");
    $(".desBox .HotListBox li:nth-child(6)").addClass("bor-bo");
});
//最新动态
function AutoScroll(obj) {
    var height = $(obj).find("ul li").height();
    $(obj).find("ul").animate({
        marginTop: "1px"
    }, 1000, function() {
        $(this).find("li:last").prependTo(this);
        $(this).css({ marginTop: -(height + 1) + "px" });
        var html = $(obj).html();
        $(obj).html(html);
    }
   )
}
$(function() {

    $(".J_moreitembtn").bind("click", function() {
        var that = $(this);
        if (that.hasClass("item-slow")) {
            that.removeClass("item-slow");
            that.html("更多");
            that.parents(".J_infocon").find("a:gt(12)").hide();
        } else {
            that.addClass("item-slow");
            that.html("收起");
            that.prev(".J_moreitem").show();
            that.parents(".J_infocon").find("a:gt(12)").show();
        }
    });

    $(".J_sortA[data-item='area'] a").bind("click", function() {
        $(".J_sort[data-item='info']").attr("data-val", "");
        var areaid = $(this).attr("data-area");
        if (areaid > 0) {
            var infocon = $(".J_infocon[data-a='" + areaid + "']");
            if (infocon.length > 0) {
                $("#J_infoAll").show();
                $(".J_infocon").hide();
                infocon.find("a:first").addClass("cur").siblings().removeClass("cur");
                infocon.show();
            } else {
                $("#J_infoAll").hide();
            }
        }
    });


    var timer = setInterval("AutoScroll('.newsContent')", 5000);
    $(".desBox").ListTab(8, '.desBox-cenList');
    //国内游推荐
    $(".desBox").Tabs({
        clickId: ".hd",
        showBox: ".desBox-cenList",
        type: "click"
    });
    //热门城市
    $(".desBox").Tabs({
        clickId: ".hd",
        showBox: ".Hotcity",
        type: "click"
    });

    $(".othersHot p").each(function() {
        $(this).find("a:last").css("border-right", "none");
    });
    //初始化翻页
    $(".lvyouHotList li").Pages();
    var pageHtml = $(".lvyouHotList").html();
    //筛选条件
    //扩展通用排序  J_sort为钩子  data-item为索引  data-val为值。
    function changePage() {
        $(".lvyouHotList").html(pageHtml);
        var sel = "";
        var sortDomList = $(".J_sort");
        for (var i = 0; i < sortDomList.length; i++) {
            var dom = $(sortDomList[i]);
            var item = dom.attr("data-item");
            if (item == "info") {
                item = item + "*";
            }
            var val = dom.attr("data-val");
            if (val != "") {
                sel = sel + "[data-" + item + "='" + val + "']";
            }
        }
        //价格单独排序
        var price = $(".sort-price").attr("data-price");
        if (price != "0") {
            Pricesort(".lvyouHotList li", price);
        };
        $(".lvyouHotList li" + sel).Pages();
    }
    //为J_sort checkbox排序绑定事件
    $(".J_sortCheck").bind("click", function() {
        if (this.checked) {
            $(this).attr("data-val", "1");
        } else {
            $(this).attr("data-val", "");
        }
        changePage();
    });
    //为J_sort a排序绑定事件
    $(".J_sortA a").bind("click", function() {
        var tar = $(this);
        tar.addClass("cur").siblings().removeClass("cur");
        var val = $.trim($(this).text());
        val = val == "全部" ? "" : val;
        tar.parents(".J_sortA").attr("data-val", val);
        changePage();

    });
    //默认排序
    $("a.sort-tj").click(function() {
        if (!$(this).hasClass('cur')) {
            $("a.sort-price").removeClass().addClass("sort-price").attr("data-price", "0");
            $(this).addClass("cur");
        };
        changePage();
    });
    //价格排序
    $("a.sort-price").click(function() {
        if ($(this).hasClass('cur')) {
            if ($(this).hasClass("sort-priceDown")) {
                $(this).removeClass("sort-priceDown").attr("title", "价格从低到高排序").attr("data-price", "up");
                changePage();
            } else {
                $(this).addClass("sort-priceDown").attr("title", "价格从高到低排序").attr("data-price", "down");
                changePage();
            }
        } else {
            $(this).addClass("cur").siblings().removeClass("cur");
            $(this).addClass("current").attr("title", "价格从低到高排序").attr("data-price", "up");
            changePage();
        };
    });



    //没有数的显示
    $(".noshuju a").click(function() {
        $(".noshuju").hide();
        $(".J_sort").attr("data-val", "");
        $(".J_sortA").each(function() {
            $(this).find("a:first").addClass("cur").siblings().removeClass("cur");
        });
        $("#J_infoAll").hide();

        $(".lvyou-sort input").removeAttr("checked");

        $("J_sortCheck").attr("data-val", "0").attr("checked", false);
        $("a.sort-price").removeClass().addClass("sort-price").attr("data-price", "0");
        $("a.sort-tj").addClass("cur");
        changePage();
    });


});
/*
*排序函数
*obj为排序项，order为升降序(参数为'down','up')
*/
function Pricesort(obj, order) {
    var $div = $(obj);
    var str = order;
    $div.sort(function (a, b) {
        var aa = $(a).attr("data-price");
        var bb = $(b).attr("data-price");
        if (str == "up") {
            return aa - bb;
        } else if (str == "down") {
            return bb - aa;
        };
    });
    $(".lvyouHotList").empty();
	$.each($div,function(index,data){
		$(".lvyouHotList").append(data)
	});
};
/*
*分页函数
*/
$.fn.Pages = function() {
    var currentPage = 1; //当前页
    var totalPage = 0; //总页数
    var pageSize = 10; //每页大小
    //分页
    var li = $(this);
    var listLen = li.length;
    $(".lvyouHotList li").hide();
    $(".noshuju").hide();
    if (listLen >= pageSize) {
        totalPage = listLen / pageSize;
        totalPage = listLen % pageSize == 0 ? totalPage : (totalPage + 1);
        totalPage = parseInt(totalPage);
    }
    else {
        totalPage = 1;
    }
    $(".ListLoding").show();
    setTimeout(function() { $(".ListLoding").hide(); }, 500);
    setTimeout(function() {
        for (var i = 0; i < pageSize; i++) {
            li.eq(i).show();
            var Imgsrc = li.eq(i).find("img[data-img]").attr("data-img");
            li.eq(i).find("img[data-img]").attr("src", Imgsrc);
        };
        if (listLen == 0) {
            $(".noshuju").show();
        }
    }, 500);
    $(".j-pageCurrent").text(currentPage);
    $(".j-pageAll").text(totalPage);
    $(".lvyou-pageLen i").text(listLen);
    //上一页
    function pre() {
        totalPage = $(".j-pageAll").html();
        if (currentPage > 1) {
            $(".lvyou-next").removeAttr("disabled", "disabled");
            currentPage -= 1;
            li.hide();
            $(".ListLoding").show();
            setTimeout(function() { $(".ListLoding").hide(); }, 500);
            setTimeout(function() {
                for (var i = (currentPage - 1) * pageSize; i < currentPage * pageSize; i++) {
                    li.eq(i).show();
                    var Imgsrc = li.eq(i).find("img[data-img]").attr("data-img");
                    li.eq(i).find("img[data-img]").attr("src", Imgsrc);
                }
            }, 500);
        };
        $(".j-pageCurrent").text(currentPage);
    }
    //下一页
    function next() {
        totalPage = $(".j-pageAll").html();
        if (currentPage <= (totalPage - 1)) {
            $(".lvyou-prev").removeAttr("disabled", "disabled");
            currentPage += 1;
            li.hide();
            $(".ListLoding").show();
            setTimeout(function() { $(".ListLoding").hide(); }, 500);
            setTimeout(function() {
                for (var i = (currentPage - 1) * pageSize; i < currentPage * pageSize; i++) {
                    li.eq(i).show();
                    var Imgsrc = li.eq(i).find("img[data-img]").attr("data-img");
                    li.eq(i).find("img[data-img]").attr("src", Imgsrc);
                };
            }, 500);
        };
        $(".j-pageCurrent").text(currentPage);
    };

    $(".lvyou-prev").click(function() {
        pre();
    });
    $(".lvyou-next").click(function() {
        next();
    });
};
//首页主视觉效果
var c = 0;
var s = 0;
var clock;
function uzaiIndexBannerSlide() {
    c = $("#fade li").size();
    bannermouseover();
    bannerlist();
}
function bannerAutoShow() {
    if (s >= c) {
        s = 0;
    }
    $("#fade li").eq(s).addClass('current').siblings().removeClass("current");
    $(".bannerBox a").hide().eq(s).show();
    s++;
}
function bannerlist() {
    clock = window.setInterval("bannerAutoShow()", 3000);
}
function bannermouseover() {
    $("#fade li").each(function(index) {
        $(this).bind("mouseover", function() {
            $("#fade li").eq(index).addClass('current').siblings().removeClass("current");
            $(".bannerBox a").hide().eq(index).show();
            s = index;
            window.clearInterval(clock);
        });
        $(this).bind("mouseout", function() {
            clock = window.setInterval("bannerAutoShow()", 3000);
        });
    });
};
//特惠和当季主题
(function($) {
    $.fn.noTime = function() {
        this.each(function() {
            var that = $(this);
            var $next = that.find(".next");
            var $prev = that.find(".prev");
            var $ul = $('> div', this)
            var $slider = $ul.find('> ul').width(9999);
            var $li = $slider.find('> li');
            var width = $li.outerWidth();
            $li.filter(':first').before($li.slice(-1).clone().addClass('cloned'));
            $li.filter(':last').after($li.slice(0, 1).clone().addClass('cloned'));
            var len = $li.length + 2;
            var n = 1;
            $ul.scrollLeft(width);
            if (that.prev().find(".picIndex").length > 0) {
                $(".picIndex li").eq(0).addClass("current");
            }
            $next.click(function() {
                n++;
                $ul.filter(':not(:animated)').animate({
                    scrollLeft: width * n
                }, 500, function() {
                    if (n >= len - 1) {
                        n = 1;
                        $ul.scrollLeft(width);
                    }
                });
                if (that.prev().find(".picIndex").length > 0) {
                    if (n >= len - 1) {
                        $(".picIndex li").eq(0).addClass("current").siblings().removeClass("current");
                    } else {
                        $(".picIndex li").eq(n - 1).addClass("current").siblings().removeClass("current");
                    }
                };
            });
            $prev.click(function() {
                n--;
                $ul.filter(':not(:animated)').animate({
                    scrollLeft: width * n
                }, 500, function() {
                    if (n <= 0) {
                        n = len - 2;
                        $ul.scrollLeft(width * n);
                    }
                });
                if (that.prev().find(".picIndex").length > 0) {
                    if (n <= 0) {
                        $(".picIndex li").eq(len - 3).addClass("current").siblings().removeClass("current");
                    } else {
                        $(".picIndex li").eq(n - 1).addClass("current").siblings().removeClass("current");
                    }
                };
            });

            if (that.prev().find(".picIndex").length > 0) {
                that.prev().find(".picIndex").find("li").each(function(i) {
                    $(this).click(function() {
                        $(this).addClass("current").siblings().removeClass("current");
                        $ul.filter(':not(:animated)').animate({
                            scrollLeft: width * (i + 1)
                        }, 500);
                        n = i + 1;
                    });
                });
            }
        });
    };

    $(".J_datatypeitem").hover(function(){
        $(this).addClass("item-hover");
    },function(){
        $(this).removeClass("item-hover");
    });

})(jQuery);

//left time
(function(){
	var time = new Date();

	$.ajax({
		type: "get",
		url: '/ashx/ashx_LvyoucnNewBooking.ashx?city='+uzaiGlobalConfig.nowCityID+'&type=3&time=' + time.getYear() + time.getMonth() + time.getDay() + time.getHours() + "&num=" + Math.random(),
		cache: true,
		success: function(msg) {

			var html = "";

			var query = eval("(" + msg + ")");

			for (var i = 0; i < query.length; i++) {
				html += "<li><p class='newsMsg'><span class='fr'>[" + query[i].time + "分钟前]</span>·<span class='newsContent-Name'>" + query[i].UserName + "</span>预订了</p>";
				html += "<p><a target='_blank' href='" + query[i].ProductUrl + "'>" + query[i].ProductName + "</a></p></li>";
			}

			if (html != "") {
				$(".strategy.theme").show();

				$(".strategy.theme .newsContent ul").html(html);
			}
			else {
				$(".strategy.theme").hide();
			}
		}
	});
})();