// JavaScript Document
$(function() {
    $(".hm3ft_03 dl:last,.index_search li:last,.hm3ft_03 dl:last,#ph_box_1 li:last,#ph_box_2 li:last").css("background", "0");
    $(".index_search li:last").css("border", "0px");
    //email yazheng
    $("#txtemail").focus(function() { $(this).addClass("hm_email_on"); });
    $("#txtemail").blur(function() { $(this).removeClass("hm_email_on"); });
    //mini_daohang
    //$("#sidetool").hover(function(){
    //		$(".sidetools").css({"right":"0px"});
    //	},function(){
    //		$(".sidetools").css({"right":"-53px"});
    //		})
    //    $(".side_nav").click(function() {
    //       
    //    });
    //右边的伸展
    $("#sidetool").hover(function() {
        $("#sidetool").stop().animate({ "right": "0" }, 900);
    }, function() {
        if ($(".mininav").css("display") == "none") {
            $("#sidetool").stop().animate({ "right": "-69px" }, 900);
        }
    });
    $(".side_nav").click(function() {
        $(".mininav").slideDown(500);
    });

    $(".closeminav a").click(function() {
        $(".mininav").slideUp(500);
    });
    $(".mininav h2").click(function() {
        $(".mininav").slideUp(500);
    });

    //lunbo
    marqueeStart(1, "left");
});
function setHover(CurrentSelectedindex, Count, Menu_Public, Content_Public, selectedclassName) {
    for (i = 1; i <= Count; i++) {
        var menu = $("#" + Menu_Public + i);
        var con = $("#" + Content_Public + i);
        if (menu != null) {
            if (i == CurrentSelectedindex) {
                menu.addClass(selectedclassName);
                con.show();
            }
            else {
                menu.removeClass(selectedclassName);
                con.hide();
            }
        }
    }
}
// 目的地获取焦点

$("#ph_box_2 li").hover(function() {
    $("#ph_box_2 li").each(function() {
        $(this).addClass("current");
        $(this).removeClass("current");
    });
    $(this).addClass("current");
},
		function() { }
	);
$("#ph_box_1 li").hover(function() {
    $("#ph_box_1 li").each(function() {
        $(this).addClass("current");
        $(this).removeClass("current");
    });
    $(this).addClass("current");
},
		function() { }
	);

//快速搜索的动态效果

$("#nav li").hover(function() {
    $(this).addClass("hover");
    $(this).children("ul li").attr('class', '');
}, function() {
    $(this).removeClass("hover");
    $(this).children("ul li").attr('class', '');
}
	);
//footer tab
$("#footer_nav li").each(function(index){
    $(this).click(function(){
      $("#footer_nav li.on").removeClass("on");
    $(this).addClass("on");
        $("#foot_xq_"+index).css("display","block").siblings("#foot_xq>div").hide();   })
})

//tab切换


$("#nav li").each(function(index) {

    $(this).mouseover(function() {

        //清除没有访问过的层，同时计算当前的相对位置，实现等位置平移效果
        $(".shot_more").css({ display: "none" });

        var height = "0px";

        //显示具体内容效果
        $(".shot_more").eq(index).css({ display: "block", top: height });
    }).mouseleave(function() {
        //  handle = setTimeout("show(" + index + ")", 2000);
        //关闭所有的层效果
        //$("div.shot_more").eq(index).css({ display: "none" });
        show(index);
    });

});

function show(index) {
    $("div.shot_more").eq(index).css({ display: "none" });
}

$(".shot_more").hover(function() {

    //获取当前选中的状态的时候让其处于显示状态
      //clearTimeout(handle);
    $('.shot_more').eq($('.shot_more').index($(this))).css({ display: "block" });
}, function() {

   // setTimeout("show1()", 1000);
    //移除当前效果，同时隐藏内容层
     $('div.shot_more').css({ display: "none" });
});

//返回顶部代码

function goTop(acceleration, time) {
    acceleration = acceleration || 0.1;
    time = time || 16;

    var x1 = 0;
    var y1 = 0;
    var x2 = 0;
    var y2 = 0;
    var x3 = 0;
    var y3 = 0;

    if (document.documentElement) {
        x1 = document.documentElement.scrollLeft || 0;
        y1 = document.documentElement.scrollTop || 0;
    }
    if (document.body) {
        x2 = document.body.scrollLeft || 0;
        y2 = document.body.scrollTop || 0;
    }
    var x3 = window.scrollX || 0;
    var y3 = window.scrollY || 0;

    // 滚动条到页面顶部的水平距离  
    var x = Math.max(x1, Math.max(x2, x3));
    // 滚动条到页面顶部的垂直距离  
    var y = Math.max(y1, Math.max(y2, y3));

    // 滚动距离 = 目前距离 / 速度, 因为距离原来越小, 速度是大于 1 的数, 所以滚动距离会越来越小  
    var speed = 1 + acceleration;
    window.scrollTo(Math.floor(x / speed), Math.floor(y / speed));

    // 如果距离不为零, 继续调用迭代本函数  
    if (x > 0 || y > 0) {
        var invokeFunction = "goTop(" + acceleration + ", " + time + ")";
        window.setTimeout(invokeFunction, time);
    }
}

//分享

function f1() {
    var txt = "佰程旅行网，" + location.href;
    if (navigator.userAgent.indexOf("Firefox") > 0) {
        alert("您的浏览器不支持复制地址连接，请复制地址栏连接分享给你的好友吧!!!");
    }
    else {
        window.clipboardData.setData("Text", txt);
        alert("已经复制到粘贴板里面，快将它分享给你好友吧！！！");
    }
}


    //滚动Banner图片的显示
    $('#slides').slides({
        preload: false,
        preloadImage: '/images/loading.gif',
        effect: 'fade',
        slideSpeed: 400,
        fadeSpeed: 100,
        play: 3000,
        pause: 100,
        hoverPause: true
    });


    //合作伙伴的轮播滚动

    //滚动

    //js无缝滚动代码


    function marqueeStart(i, direction) {
        var obj = document.getElementById("marquee" + i);
        var obj1 = document.getElementById("marquee" + i + "_1");
        var obj2 = document.getElementById("marquee" + i + "_2");

        obj2.innerHTML = obj1.innerHTML;
        var marqueeVar = window.setInterval("marqueeAA(" + i + ", '" + direction + "')", 20);
        obj.onmouseover = function() {
            window.clearInterval(marqueeVar);
        }
        obj.onmouseout = function() {
            marqueeVar = window.setInterval("marqueeAA(" + i + ", '" + direction + "')", 20);
        }
    }
    function marqueeAA(i, direction) {
        var obj = document.getElementById("marquee" + i);
        var obj1 = document.getElementById("marquee" + i + "_1");
        var obj2 = document.getElementById("marquee" + i + "_2");
        if (obj2.offsetWidth - obj.scrollLeft <= 0) {
            
                obj.scrollLeft -= obj1.offsetWidth;
            } else {
                obj.scrollLeft++;
            }
           //
    }