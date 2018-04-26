// JavaScript Document
var daysInMonth = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);    //每月天数
var today = new Today();    //今日对象
var year = today.year;      //当前显示的年份
var month = today.month;    //当前显示的月份
//今日对象构造函数
function Today() {
    this.now = new Date();
    this.year = this.now.getFullYear();
    this.month = this.now.getMonth();
    this.day = this.now.getDate();
}
//页面加载完毕后执行fillBox函数
$(function() {
	var signUpDate = document.getElementById("teamSignUpDate").value;//获取报名时间字符串
	if(signUpDate==""&&signUpDate.length==0){
		return;
	}
	else if(signUpDate=="daydayup"){
		var startoffDateFrom = document.getElementById("startoffDateFrom").value;//开始出团时间
		month =  new Date(Date.parse(startoffDateFrom.replace(/-/g,"/"))).getMonth();
	}
	else{
		var signUpdates = new Array();
	    signUpdates = signUpDate.split("/");
	    for(var s=1;s<signUpdates.length; s++){
	    	month =  new Date(Date.parse(signUpdates[1].replace(/-/g,"/"))).getMonth();
	    }
	}
    fillBox();   
});
//根据当前年月填充每日单元格
function fillBox() {//daydayup
	updateDateInfo();                   //更新年月提示
	$("td.calBox").empty();             //清空每日单元格
	var signUpDate = document.getElementById("teamSignUpDate").value;//获取报名时间字符串
	if(signUpDate=="daydayup"){
	    var dayCounter = 1;                 //设置天数计数器并初始化为1
	    var cal = new Date(year, month, 1); //以当前年月第一天为参数创建日期对象
	    var startDay = cal.getDay();        //计算填充开始位置
	    var startoffDateFrom = document.getElementById("startoffDateFrom").value;//开始出团时间
	    var startoffDateTo = document.getElementById("startoffDateTo").value;//结束时间
	    //计算填充结束位置
	    var endDay = startDay + getDays(cal.getMonth(), cal.getFullYear()) - 1;
	    //如果显示的是今日所在月份的日程，设置day变量为今日日期
	    var day = -1;
	    if (today.year == year && today.month == month) {
	        day = today.day;
	    }
	    //从startDay开始到endDay结束，在每日单元格内填入日期信息
	    for (var i=startDay; i<=endDay; i++) {
		    var tempmonth; var tempday;
		    if(month+1<10 ){ tempmonth="0"+(month+1);}else{tempmonth=(month+1); }
		    if(dayCounter<10 ){ tempday="0"+dayCounter;}else{ tempday= dayCounter; }
			if(startoffDateFrom<=(year + "-" + tempmonth + "-" + tempday)&&(year + "-" + tempmonth + "-" + tempday)<=startoffDateTo){
				$("#calBox" + i).html("<div class='date signUpDate' id='" + year + "-" + tempmonth + "-" + tempday + "' onclick='openAddBox(this)' title='选择" + year + "-" + tempmonth + "-" + tempday + "出团报名'><font color='red'>" + dayCounter + "</font></div>");
			}
	    	else{
	        	$("#calBox" + i).html("<div class='date' id='" + year + "-" + tempmonth + "-" + tempday + "'>" + dayCounter + "</div>");
	        }
		    dayCounter++;
	    }
	}
	else{
	    var dayCounter = 1;                 //设置天数计数器并初始化为1
	    var cal = new Date(year, month, 1); //以当前年月第一天为参数创建日期对象
	    var startDay = cal.getDay();        //计算填充开始位置
	    var signUpdates = new Array();
	    signUpdates = signUpDate.split("/");
	    //计算填充结束位置
	    var endDay = startDay + getDays(cal.getMonth(), cal.getFullYear()) - 1;
	    //如果显示的是今日所在月份的日程，设置day变量为今日日期
	    var day = -1;
	    if (today.year == year && today.month == month) {
	        day = today.day;
	    }
	    //从startDay开始到endDay结束，在每日单元格内填入日期信息
	    for (var i=startDay; i<=endDay; i++) {
		    var tempmonth; var tempday;var isWrite=0;
		    if(month+1<10 ){ tempmonth="0"+(month+1);}else{tempmonth=(month+1); }
		    if(dayCounter<10 ){ tempday="0"+dayCounter;}else{ tempday= dayCounter; }
		    for(var s=1;s<signUpdates.length; s++){//比较报名日期，如有报名日期就加事件
			    document.getElementById("startoffDate").value=signUpdates[1];//如果直接报名，设置报名时间为首次出团日期
				if(signUpdates[s].toString().trim()==(year + "-" + tempmonth + "-" + tempday)){
					$("#calBox" + i).html("<div class='date signUpDate' id='" + year + "-" + tempmonth + "-" + tempday + "' onclick='openAddBox(this)' title='选择" + year + "-" + tempmonth + "-" + tempday + "出团报名 '><font color='red'>" + dayCounter + "</font></div>");
					isWrite=1;
				}
				if (signUpdates[s].toString().trim()!=(year + "-" + tempmonth + "-" + tempday)&& dayCounter==day && isWrite==0) {
			        $("#calBox" + i).html("<div class='date today' id='" + year + "-" + tempmonth + "-" + tempday + "'>" + dayCounter + "</div>");
			    } 
		    	else if(signUpdates[s].toString().trim()!=(year + "-" + tempmonth + "-" + tempday)&& isWrite==0) {
		        	$("#calBox" + i).html("<div class='date' id='" + year + "-" + tempmonth + "-" + tempday + "'>" + dayCounter + "</div>");
		        }
	   		}
		    dayCounter++;
	    }
	}
}
//判断是否闰年返回每月天数
function getDays(month, year) {
    if (1 == month) {
        if (((0 == year % 4) && (0 != (year % 100))) || (0 == year % 400)) {
            return 29;
        } else {
            return 28;
        }
    } else {
        return daysInMonth[month];
    }
}
//显示上月日程
function prevMonth() {
    if ((month - 1) < 0) {
        month = 11;
        year--;
    } else {
        month--;
    }
    fillBox();              //填充每日单元格
}
//显示下月日程
function nextMonth() {
    if((month + 1) > 11) {
        month = 0;
        year++;
    } else {
        month++;
    }
    fillBox();              //填充每日单元格
}

//显示本月日程
function thisMonth() {
    year = today.year;
    month = today.month;
    fillBox();              //填充每日单元格
}

//更新年月提示
function updateDateInfo() {
    $("#dateInfo").html(year + "年" + (month + 1) + "月");
}
//提交报名
function openAddBox(src){
	document.getElementById("startoffDate").value=src.id;
	tourSignUpEveryDay();
}
//返回对象对页面左边距
function getLeft(src){
    var obj = src;
    var objLeft = obj.offsetLeft;
    while(obj != null && obj.offsetParent != null && obj.offsetParent.tagName != "BODY"){
        objLeft += obj.offsetParent.offsetLeft;
        obj = obj.offsetParent;
    }
    return objLeft;
}

//返回对象对页面上边距
function getTop(src){
    var obj = src;
    var objTop = obj.offsetTop;
    while(obj != null && obj.offsetParent != null && obj.offsetParent.tagName != "BODY"){
        objTop += obj.offsetParent.offsetTop;
        obj = obj.offsetParent;
    }
    return objTop;
}
//显示日历选择区
function showDateArea(){
	var showFlage=document.getElementById("showDateArea").style.display;
	if(showFlage=='none'){
		document.getElementById("showDateArea").style.display="block";
	}
	else if(showFlage=='block'){
		document.getElementById("showDateArea").style.display="none";
	}
}
