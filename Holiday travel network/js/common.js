/*
*@ Common.js
*@ v3.0
*@ 2012-09-06
*/

//提前加载区
$(function () {
    if (uzaiGlobalConfig.userName == null || uzaiGlobalConfig.userName == '') {
        $('#weclome').hide();
        $('.b_menuitemTrim2').hide().next('.verline_gray').hide();
        $('.b_menuitemTrim1').show();
    }
    else {
        var userName = uzaiGlobalConfig.userName;
        var thumbName = userName.length > 15 ? userName.substring(0, 12) + '...' : userName;

        $('#weclome').show().find('b').html("<a href='http://u.uzai.com/manage/personal-info'>" + thumbName + "</a>");
        $('.b_menuitemTrim1').hide().next('.verline_gray').hide();
        $('.b_menuitemTrim2').show();
    }

    $('#drTip').mouseenter(function () {
        $('.popUb').show();
    }).mouseleave(function () {
        $('.popUb').hide();
    });


    //head search 8.16
    $(".hd_srhBox").hover(function() {
        $(".srhBox_val").addClass("srhBox_cur");
        $(".hd_search .s1").addClass("chuizhi");
        $(".hd_srhSe").show();
	return false;
    }, function() {
        $(".srhBox_val").removeClass("srhBox_cur");
        $(".hd_search .s1").removeClass("chuizhi");
        $(".hd_srhSe").hide();
	return false;
    });

    $(".hd_srhSe a").click(function() {
        var val = $(this).attr("val"); //取val属性 涂丁一 2012-08-17
        var text = $(this).text(); 
        $(this).addClass("current").siblings().removeClass("current");
        $("#srhInput").val(val);
        $(".srhBox_val").text(text);
        $(".hd_srhSe").hide();
	return false;
    });


});

//历史记录和心愿
function parentHide() {
    $(".fn-browseOne").hide();
    $(".fn-browseTitle li").removeClass("on");
};

function clearscan(his) {
    createCookie(his + "ID", "");
    createCookie(his + "PN", "");
    createCookie(his + "PNE", "");
    createCookie(his + "URL", "");
    createCookie(his + "picURL", "");
    createCookie(his + "price", "");
};
function UpdateHistory(object) {
    if (!uzaiGlobalConfig.userID) {
        if (readCookie("his1ID") != object.pid && readCookie("his1ID") != null && readCookie("his2ID") != object.pid && readCookie("his2ID") != null) {
            createCookie("his3ID", readCookie("his2ID"));
            createCookie("his3PN", readCookie("his2PN"));
            createCookie("his3PNE", readCookie("his2PNE"));
            createCookie("his3URL", readCookie("his2URL"));
            createCookie("his3picURL", readCookie("his2picURL"));
            createCookie("his3price", readCookie("his2price"));
        }
        if (readCookie("his1ID") != object.pid && readCookie("his1ID") != null) {
            createCookie("his2ID", readCookie("his1ID"));
            createCookie("his2PN", readCookie("his1PN"));
            createCookie("his2PNE", readCookie("his1PNE"));
            createCookie("his2URL", readCookie("his1URL"));
            createCookie("his2picURL", readCookie("his1picURL"));
            createCookie("his2price", readCookie("his1price"));
        }
        createCookie("his1ID", object.pid);
        createCookie("his1PN", escape(object.pname));
        createCookie("his1PNE", escape(object.pnameEx));
        createCookie("his1URL", object.pURL);
        createCookie("his1picURL", object.picURL);
        createCookie("his1price", object.price);
    }
    else {
       object.uid = uzaiGlobalConfig.userID;
       object.uname = uzaiGlobalConfig.userName;
        $.get("/ScanRecord/Add/", object);
    }
    DisplayScanRecord();
}

function DisplayScanRecord() {
    if (!uzaiGlobalConfig.userID) {
        $("#rs-browseMsg").empty();
        setScanByCookie("his1");
        setScanByCookie("his2");
        setScanByCookie("his3");
    }
    else {
        $("#rs-tips").text("");
        setScanByData({ id: "-1", pageIndex: "0" });
    } 
}

function setScanByCookie(his) {
    var temp = $("#template");
    if (readCookie(his + "ID")) {
        $(temp).find("img").attr("src", readCookie(his + "picURL"));
        var pdtname = unescape(readCookie(his + "PN"));
        $(temp).find(".fn-ListLink a").attr("title", pdtname);
        if (pdtname.length > 14) {
            pdtname = pdtname.substring(0, 14) + "...";
        }
        $(temp).find(".fn-ListLink a").text(pdtname);
        var pne = unescape(readCookie(his + "PNE"));
        $(temp).find(".fn-ListMsg p:last").text(pne.substring(0, 20));
        $(temp).find("a:lt(3)").each(function() { $(this).attr("href", readCookie(his + "URL") + "?laiyuan=zuijinliulan&sign=no") });
        var price = readCookie(his + "price");
        if (price <= 0) { price = "请电询"; }
        else{price = "￥" + readCookie(his + "price");}
        $(temp).find("span").text(price);
        $(temp).find(".fn-removeJL").attr("id", his);
        $(".fn-browseMsg").append($(temp).html());
    }
}
function setScanByData(object) {
    
    $.get("/ScanRecord/Delete/?rand=" + Math.random(), { id: object.id, pageIndex: object.pageIndex, uid: uzaiGlobalConfig.userID }, function(data) {
        $("#rs-browseMsg").remove();
        $("#rs-browseBot").remove();
        $("#rs-browseTop").after(data);
    });
}

function delscan(id) {
    if (uzaiGlobalConfig.userID) {
        setScanByData({ id: id, pageIndex: $("#pageIndex").val() });
    }
    else {
        $("#rs-browseMsg #" + id).remove();
        clearscan(id);
    }
}
function delallscan() {
    $(".fn-zhezao").show();
    $(".fn-browsethick").show();
}
function cutpage(pageNum) {
    setScanByData({ id: "-1", pageIndex: pageNum });
}

$(function() {

	//time
	$(".fn-browseTime input").each(function(i){
		$(this).click(function(){
			if(i==2){
				$(".fn-other").show();
			}else{
				$(".fn-other").hide();
			}
		});
	});
    //鼠标放上去状态
    $(".fn-browseTitle li").hover(function() {
        $(this).addClass("cur");
    }, function() {
        $(this).removeClass("cur");
    });
    $("div.fn-browseTop a").click(function() {
        parentHide();
        return false;
    });
    //tabs切换
    $(".fn-browseTitle li").each(function(i) {
        $(this).click(function() {
            $(this).addClass("on").siblings().removeClass("on");
            $(".fn-browseOne").hide().eq(i).show();
            $(this).blur();
        });
    });
    //删除单个
    $(".fn-removeJL").live("click", function() {
        $(this).parents(".fn-browseList").remove();
        clearscan($(this).attr("id"));
    });
    //全部删除
    $(".fn-removeAll").click(function() {
        if ($(".fn-browseList").length > 0) {
            $("#j-layer").show();
            $("#j-browsethick").show();
        }
    });
    $("#j-browsethick a").click(function(event) {
        if ($(event.target).attr("class") == "fn-thickOk") {
            $(".fn-zhezao").hide();
            $(".fn-browsethick").hide();
            if (uzaiGlobalConfig.userID) {
                setScanByData({ id: -2 });
            } else {
                $("#rs-browseMsg").empty();
                clearscan("his1")
                clearscan("his2")
                clearscan("his3")
            }
        } else {
            $(".fn-zhezao").hide();
            $(".fn-browsethick").hide();
        }
    });
    //订阅
    $(".fn-submit").click(function() {
        //验证
        var where = $("#xywhere").val();
        var email = $("#xyemail").val();
        var emailreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if (where.replace(/(^\s*)|(\s*$)/g, "") == ""||where=="请输入或点击添加热门度假地") {
            $("#travelaspiration .fn-auth").text("请填写您想去的地方");
            return false;
        }
        else { $("#travelaspiration .fn-auth").text("") }
         if (emailreg.test(email) || uzaiGlobalConfig.userID)  { $("#travelaspiration .fn-auth").text("") }
        else {
            $("#travelaspiration .fn-auth").text("请填写正确的邮箱");
            return false;
        }
        $.post("/travelaspiration/add/", { words: $("#xywhere").val(), province: $("#xyprovince").val(), city: $("#xycity").val(), level: $("#xylevel").val(), email: $("#xyemail").val(), traveldate: $(".fn-browseTime input[name='Time']:checked").val(), J_Time: $("#J_Time").val(), duringdays: $("#duringdays").val() }, function() {
		$("#j-layer1").show();
		$("#j-succes").show();
	})

    });

    $("#j-succes a").click(function() {
        $(".fn-zhezao").hide();
        $(".fn-browsethick").hide();
    });
    //点击页面任何地方隐藏
    $(document).click(function(event) {
        var _this = $(event.target);
        if (_this.attr("class") == "fn-removeJL") {
            return false;
        }
        if (_this.parents(".fn-browse").length <= 0) {
            parentHide();
        };
    });
    //返回顶部
    $(window).scroll(function() {
        var top = $(window).scrollTop();
        if (top > 20) {
            $(".J_ScrollTop").show();
        } else {
            $(".J_ScrollTop").hide();
        }
    });
    $(".J_ScrollTop").click(function() {
        $(window).scrollTop(0);
    });
    $(".J_ScrollTop").hover(function() {
        $(this).addClass("J_ScrollTopCur");
    }, function() {
        $(this).removeClass("J_ScrollTopCur");
    });
});


var _uz = window._uz || {};
_uz = {
    init: function () {
        //this.tpUState(); //用户状态
        this.tpUGrade(); //用户等级 李文 2011-11-7日
        this.tpUOrderTip(); //用户订单Tips
        this.tpDropMenu(); //头部菜单下拉
        this.tpSelectCity(); //头部城市下拉
        this.tpAutoComplete(); //搜索自动完成
        this.tpSearchKeyEvent(); //搜索回车事件
        this.NoticeTip(); //网站通告
        this.NavgationForm(); //左侧线路导航
        this.SaveReferUrl(); //保存ReferURL
        this.SaveCpsReferUrl(); //保存cpsReferURL
        this.uzScrollFade(); //返回顶部 By YiLong 2012-3-23
        //this.uzScrollTopEvent();
        this.uzToTop(); //返回顶部
    },
    tpUGrade: function () {
        var userGrade = GetCookie("user", "userGrade");
        $('#userGrade').html("<a target='_blank' href='http://u.uzai.com/reg/UserGradeMember' title='" + this.getUserGradeName(userGrade) + "'><img alt='" + this.getUserGradeName(userGrade) + "' src='" + this.getUserGradeIcon(userGrade) + "' /></a>");
    },
    tpUOrderTip: function() {
		var cityurl = "http://u.uzai.com/Order_Back";
		var clearurl = "http://u.uzai.com/UserTip_Clear/All";
        if ($('#userOrderPart2').get(0) != null) {
            $.ajax({
                type: "GET",
                cache: false,
                async: false,
                url: cityurl,
                dataType: "jsonp",
                jsonp: "callbackparam", //用以获得jsonp回调函数名的参数名
                jsonpCallback: "jsonpCallback", //自定义的jsonp回调函数名称
                success: function(d) {
					if(d[0].tips.length>0){
						$("#userOrderPart2").find("p").remove();
						$("#userOrderPart2").show();
						for(var i =0;i<d[0].tips.length;i++){
							$("#userOrderPart2").append(d[0].tips[i]);
						}
					}
                },
                error: function (d) { 
				}
            });

        }
        $('#userOrderPart2 .closetip').click(function() {
            $('#userOrderPart2').hide();
            $.ajax({
                type: "GET",
                url: clearurl,
                dataType: "jsonp",
                jsonp: "callbackparam", //用以获得jsonp回调函数名的参数名
                jsonpCallback: "jsonpCallback", //自定义的jsonp回调函数名称
                success: function(d) {
                }
            });
        });
    },
    tpDropMenu: function () {
        $("#qmenu_btn,#qmenu_tab").hover(function () {
            $("#qmenu_btn").addClass("qmenu_btnHover");
            $("#qmenu_tab").show();
        },
   function () {
       $("#qmenu_tab").hide();
       $("#qmenu_btn").removeClass("qmenu_btnHover");
   });


        $("#qmy_btn,#qmy_tab").hover(function () {
            $("#qmy_btn").addClass("qlogin_btnHover");
            $("#qmy_tab").show();
        },
   function () {
       $("#qmy_btn").removeClass("qlogin_btnHover");
       $("#qmy_tab").hide();
   });

        //单标签鼠标hover事件,请使用mouseenter/mouseleave
        $("#hovercity").mouseenter(function () {
            $("#morecity_tab").show();
            $(this).find('.a1').addClass('a1Border');
        });

        $("#hovercity").mouseleave(function () {
            $("#morecity_tab").hide();
            $(this).find('.a1').removeClass('a1Border');
        });
    },
    tpSelectCity: function () {
        var currentCityID = $('.hd_nowcity>b>i').text();  //当前城市ID
        currentCityID = (currentCityID == null || '') ? "2" : currentCityID;
        $('#morecity_tab>ul').find("a[cityid='" + currentCityID + "']").addClass('cur');

        $('#morecity').hover(function () {
            $('#pmorecity').addClass("morecity2Cur"); //加边框样式
            $("#cityul").show();
        }, function () {
            $('#pmorecity').removeClass("morecity2Cur"); //移除边框样式
            $("#cityul").hide();
        });
    },
    tpAutoComplete: function () {
        var nowCity = uzaiGlobalConfig.nowCityEname;
        var url = document.URL;

        url = "/search/wordlink";

        $("#searchkey").autocomplete(url, {
            width: 242,
            scroll: false,
            max: 10,
            autoFill: true,
            formatItem: function (row) { return row[0]; },
            formatResult: function (row) { return row[0].replace(/(<.+?>)/gi, ''); }
        });

        $("#searchkey").result(function (event, data, formatted) {
            if (data) {
                $('#searchkey').val(data[0]);
                checksearchkey();
            }
        });
    },
    tpSearchKeyEvent: function () {
        var initKey2 = $('#txtsearch');
        var initKey = "温泉";

        var kList = new Array('日本', '香港', '黄山', '北京');
        var kRandom = Math.floor(Math.random() * (kList.length));
        initKey = kList[kRandom];
        try {
            if (SearchDefaultKey != undefined && SearchDefaultKey != "") {
                initKey = SearchDefaultKey;
            }
        } catch (e) {
        }
        if (initKey2.get(0) != null) {
            initKey = initKey2.val();
        }

        $("#searchkey").val(initKey);

        $("#searchkey").bind("focus", function () {
            if ($(this).val() == initKey) {
                $(this).val("");
            }

        });
        $("#searchkey").bind("blur", function () {
            if ($(this).val() == "") {
                $(this).val(initKey);
            }
        });
    },
    NoticeTip: function () {
        $('#siteNotice .a1').click(function () {
            $('#siteNotice').slideUp("800");
			createCookie("uzNoticeNew1102", "1", 1);
        });
    },
    NavgationForm: function () {
        $('#urmenu li').hover(function () {
            $('#dvmenu' + $(this).attr('tag')).css("display", "block");
            return false;
        }, function () {
            $('#dvmenu' + $(this).attr('tag')).css("display", "none");
        });

        $('#dvmenu1,#dvmenu2,#dvmenu3,#dvmenu4,#dvmenu5,#dvmenu6').hover(function () {
            $(this).css("display", "block");
        }, function () {
            $(this).css("display", "none");
        });

        //子菜单
        var o = $('div.subPartLeft div.menuPart');
        o.mouseenter(function () {
            o.find('div.part01left_top').css({ "height": "270px" }).find('div.part01lt').css({ "height": "30px" });
            o.find('h1').find('i').addClass('on');
        });
        o.mouseleave(function () {
            o.find('div.part01left_top').css({ "height": "30px" }).find('div.part01lt').css({ "height": "28px" });
            o.find('h1').find('i').removeClass('on');
        });

        var o2 = $('div.subPartLeft');
        o2.mouseenter(function () {
            o2.find('div.part01left_top').css({ "height": "270px" }).find('div.part01lt').css({ "height": "30px" });
        });
        o2.mouseleave(function () {
            o2.find('div.part01left_top').css({ "height": "30px" }).find('div.part01lt').css({ "height": "28px" });
        });

        var o3 = $('div.gty2');
        o3.mouseenter(function () {
            o3.siblings('div.part01left_top').css({ "height": "270px" }).find('div.part01lt').css({ "height": "30px" });
        });
    },
    SaveReferUrl: function () {
        saveURLReferToCookie();
    },
    SaveCpsReferUrl: function() {
        saveCPSReferToCookie();
    },
    getUserGradeIcon: function (obj) {
        var reU = "http://resource.uzai.com/Content/1/images/";
        if (obj != null && obj != "") {
            switch (obj.toUpperCase()) {
                case "A":
                    return reU + "icon_vip30.gif";
                case "B":
                    return reU + "icon_vip31.gif";
                case "C":
                    return reU + "icon_vip32.gif";
                default:
                    return reU + "icon_vip33.gif";
            }
        }
        else
            return reU + "icon_vip30.gif";
    },
    getUserGradeName: function (obj) {
        if (obj != null && obj != "") {
            switch (obj.toUpperCase()) {
                case "A":
                    return "会员";
                case "B":
                    return "金卡会员";
                case "C":
                    return "白金会员";
                default:
                    return "钻石会员";
            }
        }
        else {
            return "会员";
        }
    },
    uzScrollFade: function () {
        //var feedback = $('#J_FeedBack');
        var totop = $('#J_ScrollTopBtn');

        var oHeight = $(document).scrollTop();
        var wHeight = $(window).height();

        oHeight > 0 ? totop.show() : totop.hide();

        //IE6
        if (!window.XMLHttpRequest) {
            totop.css("top", oHeight + wHeight - 80);
            //feedback.css("top", oHeight + wHeight - 80);
        }

    },
    uzScrollTopEvent: function () {
        $('#J_ScrollTopBtn').hide();
        //$("html, body").animate({ scrollTop: 0 }, 0);
    },
    uzToTop: function () {
        $(window).bind("scroll", _uz.uzScrollFade);
    }
}

//打开
function oNotice() {
	if(uzaiGlobalConfig && uzaiGlobalConfig.nowCityID!="2"){
		return;
	}
    var d = new Date();
    if (readCookie("uzNoticeNew1102")) {
        return;
    } else {
        $('#siteNotice').find('span').html("<a href='http://www.uzai.com/subject/meizhou/' target='_blank'><img src='http://r.uzaicdn.com/content/common/notice1102.jpg' /></a>");
        $("#siteNotice").slideDown(1000);
    }
}

//关闭
function cNotice() {
    $("#siteNotice").slideUp(1000);
    var d = new Date();
    createCookie("uzNoticeNew1017", d.getTime(), 365);
}

$(function () {
    oNotice(); //夏力上传
    _uz.init(); //初始化
});

function loadJs(url){
			var oBody = document.getElementsByTagName('body').item(0); 
			var oscript= document.createElement("script"); 
			oscript.src=url;
			oscript.type = "text/javascript";
			oBody.appendChild( oscript); 
		};


//加入收藏
function uzaiAddFavorite(sURL, sTitle) {
    var currentURL = window.location.href;
    var currentURL2 = "http://www.uzai.com/";
    var currentURL3 = "http://www.uzai.com/?data=sc";
    var returnURL = (currentURL == currentURL2) ? currentURL3 : currentURL;

    try {
        window.external.addFavorite(sURL, sTitle);
    }
    catch (e) {
        try {
            window.sidebar.addPanel(sTitle, sURL, "");
        }
        catch (e) {
            alert("加入收藏失败，请使用Ctrl+D进行添加");
        }
    }

    window.location.href = returnURL;
}


function mychecks(va, o, url) {
    $("#dv_01").html("");
    if (document.getElementById("dv_01") != null) {
        $("#dv_01").remove();
    } else {
        var layer = document.createElement("div");
        layer.style.zIndex = 1000;
        layer.id = "dv_01";
        document.body.appendChild(layer);
        new Calendars().show(document.getElementById("dv_01"), va, url);
        var left = document.documentElement.clientWidth / 2 - 250;
        var top = $(document).scrollTop() + document.documentElement.clientHeight / 2 - 168;

        $("#dv_01").css("top", top);
        $("#dv_01").css("left", left);
        $("#dv_01").show();
    }
}


function js00023_SetTag(number) {
    var TableHtml = "<div id='DivTagTable" + number + "'>" + $(".obt_thmain #DivTagTable" + number).html() + "</div>";
    $(".obt_thmain #DivTagTable" + number).remove();
    $(".obt_thmain").prepend(TableHtml);
}

function js00023_SetTag2(number, Tag) {
    var TableHtml = "<div id='DivTagTable" + number + "'>" + $("#" + Tag + " .obt_thmain #DivTagTable" + number).html() + "</div>";
    $("#" + Tag + " .obt_thmain #DivTagTable" + number).remove();
    $("#" + Tag + " .obt_thmain").prepend(TableHtml);
	 $("#DivTagTable" + number + " img[data-original]").each(function() {
        $(this).attr("src", $(this).attr("data-original"));
    });
}


//清除IE错误
function killErrors() {
    return true;
}
if($.browser.msie){
    window.onerror = killErrors;
}

//判断搜索框原始值
function checksearchkey() {
    var searchkey = $("#searchkey").val();
    if (searchkey == "请输入目的地或线路编号进行搜索" || searchkey == '') {
        return;
    }
    else {
        $("#indexsearchform").submit();
    }
}

//跳转到hidurl页面
function checksearchForm() {
    var searchkey = $("#input_search_key").val();
    var url = $("#hidurl").val();
    if (url != "") {
        window.location.href = url;
    }
}

//首页城市切换
var indextop_url = "http://sh.uzai.com";
 
function GetTripLogin() {
    return $("#UzaiStartDate option:selected").val();
}

/*点评*/
$(function(){
	$(".J_opinion").click(function(){
		var onext=$(this).parents("tr").next(".J_option");
		var $Td=$(this).parents("tr").find("td");
		if(onext.css("display")=="none"){
			$Td.css("border-bottom","0");
			$(this).addClass("J_opinion1");
			onext.show();	
		}else{
			$Td.css("border-bottom","1px solid #EAEAEA");
			$(this).removeClass("J_opinion1");
			onext.hide();
		}	
	});
	$(".optionHide").click(function(){
		$(this).parents(".J_option").hide();
		var oTr=$(this).parents(".J_option").prev("tr");
		oTr.find("td").css("border-bottom","1px solid #EAEAEA");
		oTr.find(".J_opinion").removeClass("J_opinion1");
	});
});
