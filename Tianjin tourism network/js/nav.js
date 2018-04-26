// JavaScript Document
//快速搜索的动态效果

$("#nav li").hover(function() {
    $(this).addClass("hover");
    $(this).children("ul li").attr('class', '');
}, function() {
    $(this).removeClass("hover");
    $(this).children("ul li").attr('class', '');
});

//tab切换

$("#nav li").each(function(index) {

    $(this).mouseover(function() {

        //清除没有访问过的层，同时计算当前的相对位置，实现等位置平移效果
        $(".shot_more").css({
            display: "none"
        });

        var height = "0px";

        //显示具体内容效果
        $(".shot_more").eq(index).css({
            display: "block",
            top: height
        });
    }).mouseleave(function() {
        //  handle = setTimeout("show(" + index + ")", 2000);
        //关闭所有的层效果
        //$("div.shot_more").eq(index).css({ display: "none" });
        show(index);
    });

});

function show(index) {
    $("div.shot_more").eq(index).css({
        display: "none"
    });
}

$(".shot_more").hover(function() {

    //获取当前选中的状态的时候让其处于显示状态
    //clearTimeout(handle);
    $('.shot_more').eq($('.shot_more').index($(this))).css({
        display: "block"
    });
}, function() {

    // setTimeout("show1()", 1000);
    //移除当前效果，同时隐藏内容层
    $('div.shot_more').css({
        display: "none"
    });
});