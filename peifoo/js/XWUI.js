/*====================================================================================
定义一些基本的方法，可略过
====================================================================================*/
$id = function(p){return document.getElementById(p);}

$idTag = function(p,tag){return document.getElementById(p).getElementsByTagName(tag);}

String.prototype.trim = function(){ return this.replace(/(^\s*)|(\s*$)/g, "");}

hasId = function(id){var s=document.getElementById(id);if(s){return true}else{return false}}

addClass = function(element, className){if (!element) return;var elementClassName = element.className.trim();if (elementClassName.length == 0) {element.className = className;return;}if (elementClassName == className || elementClassName.match(new RegExp("(^|\\s)" + className + "(\\s|$)"))) {return;}element.className = elementClassName + " " + className;}

removeClass = function(element, className) {if (!element) return;var elementClassName = element.className.trim();if (elementClassName.length == 0) return;if(elementClassName == className){element.className = "";return;}if (elementClassName.match(new RegExp("(^|\\s)" + className + "(\\s|$)")))element.className = elementClassName.replace((new RegExp("(^|\\s)" + className + "(\\s|$)"))," ");}

getElementsByClassName = function(id,className){var obj = $id(id);var ele=[];var tags = obj.getElementsByTagName('*');for(var i=0;i<tags.length;i++){var elementClassName = tags[i].className.trim();if( elementClassName.match(new RegExp("(^|\\s)" + className + "(\\s|$)")) ){ele[ele.length] = tags[i];}}return ele;}

addDOMLoadEvent=(function(){var load_events=[],load_timer,script,done,exec,old_onload,init=function(){done=true;clearInterval(load_timer);while(exec=load_events.shift())exec();if(script)script.onreadystatechange=''};return function(func){if(done)return func();if(!load_events[0]){if(document.addEventListener)document.addEventListener("DOMContentLoaded",init,false);/*@cc_on @*/ /*@if(@_win32)document.write("<script id=__ie_onload defer src=//0><\/script>");script=document.getElementById("__ie_onload");script.onreadystatechange=function(){if(this.readyState=="complete")init()};/*@end @*/if(/WebKit/i.test(navigator.userAgent)){load_timer=setInterval(function(){if(/loaded|complete/.test(document.readyState))init()},10)}old_onload=window.onload;window.onload=function(){init();if(old_onload)old_onload()}}load_events.push(func)}})();


/*====================================================================================
选项卡切换显示
action : ['click','over']
====================================================================================*/
function iTab(id,action){
try{
	var obj = $id(id);
	var tags = getElementsByClassName(id,'iTab_tag');
	var iTab_child_dom = getElementsByClassName(id,'iTab_child_dom');
	for( i=0;i<iTab_child_dom.length;i++){
		iTab_child_dom[i].id = id+'_iTab_child_dom_'+i;	
	}
	for( i=0;i<tags.length;i++){
		tags[i].id = id+"_iTab_tag_"+i;
		if( action == 'click' ){
			tags[i].onclick = function active(currentId){
				for( i=0;i<tags.length;i++){
					removeClass($id(id+"_iTab_tag_"+i),'current');
					$id(id+'_iTab_child_dom_'+i).style.display = "none";
				}
				currentId = this.id;
				addClass($id(currentId),'current');
				currentIdNum  = currentId.match(/[^\d]*(\d+)$/)[1];
				currentId = id+'_iTab_child_dom_' + currentIdNum;
				$id(currentId).style.display = "";
			}
		}
		if( action == 'over' ){
			tags[i].onmouseover = function(){
				for( i=0;i<tags.length;i++){
					removeClass($id(id+"_iTab_tag_"+i),'current');
					$id(id+'_iTab_child_dom_'+i).style.display = "none";
				}
				currentId = this.id;
				addClass($id(currentId),'current');
				currentIdNum  = currentId.match(/[^\d]*(\d+)$/)[1];
				currentId = id+'_iTab_child_dom_' + currentIdNum;
				$id(currentId).style.display = "";
			}
		}
	}
}catch(e){}
}


/*====================================================================================
input初始状态文字，用于输入提示
====================================================================================*/
function iVal(id,text,className){
try{
	var a = iVal.arguments.length;
	if( a>2 ){addClass($id(id),className);}
	$id(id).value=text;
	$id(id).onfocus=function(){
		if($id(id).value==text){
			$id(id).value="";
			if( a>2 ){removeClass($id(id),className);}
		}
	}
	$id(id).onblur=function(){
		if($id(id).value==""){
			$id(id).value=text;
			if( a>2 ){addClass($id(id),className);}
		}
	}
}catch(e){}
}


/*====================================================================================
input初始状态class，用于密码输入提示
====================================================================================*/
function iClass(id,classname){
try{	
	addClass($id(id),classname);
	$id(id).onfocus=function(){
		removeClass($id(id),classname);
	}
	$id(id).onblur=function(){
		removeClass($id(id),classname);
		if($id(id).value==""){
			addClass($id(id),classname);
		}
	}
}catch(e){}
}


/*====================================================================================
DOM的innerHTML
====================================================================================*/
function iHtml(id,html){
try{
	$id(id).innerHTML=html;
	$id(id).onfocus=function(){
		if(this.innerHTML==html){
			this.innerHTML="";
		}
	}
	$id(id).onblur=function(){
		if(this.innerHTML==""){
			this.innerHTML=html;
		}
	}
}catch(e){}
}


function testIE(){
	var Sys = {};
	var ua = navigator.userAgent.toLowerCase();
	var s;
	(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
	(s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
	(s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
	(s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
	(s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
	return Sys.ie;
}

/*====================================================================================
常见的弹出居中浮动层
并将背景锁定、灰显
====================================================================================*/
function iPopupWin(id,htmlcode){
try{
	
	//获取需要的高度宽度数据，备用
	var clientWidth = document.body.clientWidth; //可见区域宽度
	var clientHeight = document.body.clientHeight; //可见区域高度
	var scrollTop = document.documentElement.scrollTop; //上部被卷去的高
	
	//查找遮罩及主体内容div，赋予相应的id
	var mask = getElementsByClassName(id,'iPopupWin_mask')[0];
	mask.id = id+'_mask';
	maskid = mask.id;
	var content = getElementsByClassName(id,'iPopupWin_content')[0];
	content.id = id+'_content';
	contentid = content.id;
	
	//设置遮罩层大小，显示全部浮出层
	document.getElementById(maskid).style.height = clientHeight +"px";
	document.getElementById(id).style.display = "block";
	//document.getElementById(maskid).focus();
	
	//控制主体窗口位置
	var v_popwin = $id(contentid);
	if( htmlcode!=null && htmlcode.length != 0 ){
		v_popwin.innerHTML = htmlcode;
	}
	var v_popwin_height = $id(contentid).offsetHeight;
	var v_popwin_width = $id(contentid).offsetWidth;
	v_popwin.style.position = "absolute";
	v_popwin.style.left = "50%";
	v_popwin.style.top = "50%";
	v_popwin.style.zIndex = "9999";
	v_popwin.style.marginLeft = -(v_popwin_width/2) + "px";
	v_popwin.style.marginTop = -(v_popwin_height/2) + "px";
	if(testIE()=="6.0"){
		v_popwin.style.marginTop = -(v_popwin_height/2) + scrollTop + "px";	
		//IE6 select fix
		var myFrame = document.createElement("iframe");
		document.getElementById(id).appendChild(myFrame);
		myFrame.width = clientWidth;
		myFrame.height = clientHeight;
		myFrame.style.position = "absolute";
		myFrame.style.left = 0 + "px";
		myFrame.style.top = 0 + "px";
		myFrame.style.zIndex = "0";
		myFrame.allowtransparency = 'true';
		myFrame.style.filter = 'Alpha(Opacity=0)';
	}
	
	document.getElementsByTagName('html')[0].style.overflow = 'hidden';
	function keyUp(e){
		var currKey=0,e=e||event;
		currKey=e.keyCode||e.which||e.charCode;
		switch (currKey){
			case 27: iCloseDiv(id); break;
		} 
	}
	document.onkeyup = keyUp;
}catch(e){}
}
function iCloseDiv(id){
try{
	document.getElementById(id).style.display = "none";
	document.getElementsByTagName('html')[0].style.overflow = '';
}catch(e){}
}


/*====================================================================================
固定在某个位置的浮动层，可随屏幕滚动
====================================================================================*/
function iSmallAD(id,float,marginside,marginvalign,htmlcode){
try{
	this.id = id;
	this.float = "center"; //left/right/center
	this.valign = "middle"; //top/bottom/middle
	this.marginside = 0;
	this.marginvalign = 0;
	this.htmlcode = null;
	this.creat = function(){
		var marginbottom = this.marginbottom;
		var marginside = this.marginside;
		var marginvalign = this.marginvalign;
		var htmlcode = this.htmlcode;
		
		if( !hasId(this.id) ){
			var mydiv = document.createElement("div");
			document.body.appendChild(mydiv);
			mydiv.id = this.id;
			addClass($id(this.id),'icreatSmallAD');
		}
		var obj = $id(this.id);
		var clientWidth = document.body.clientWidth; //可见区域宽度
		var clientHeight = document.documentElement.clientHeight; //可见区域高度
		var scrollTop = document.documentElement.scrollTop+document.body.scrollTop; //上部被卷去的高
		var scrollHeight = document.body.scrollHeight; //正文高度
		
		//初始化部分属性
		obj.style.position = "absolute";
		obj.style.zIndex = "999";
		var v_popwin_height = obj.offsetHeight;
		var v_popwin_width = obj.offsetWidth;
		var defaultTop = 0;
		if( htmlcode.length>0 || htmlcode!=null ){
			obj.innerHTML = htmlcode;
		}
		
		//水平位置
		if(this.float=="left"){obj.style.left = marginside + "px";}
		if(this.float=="right"){obj.style.right = marginside + "px";}
		if(this.float=="center"){
			obj.style.left = Math.floor((clientWidth - v_popwin_width)/2) + "px";	
		}
		//垂直位置
		if(this.valign=="top"){
			defaultTop = marginvalign;
			obj.style.top = defaultTop + "px";
		}
		if(this.valign=="bottom"){
			defaultTop = clientHeight - v_popwin_height - marginvalign + scrollTop;
			obj.style.top = defaultTop + "px";
		}
		if(this.valign=="middle"){
			defaultTop = Math.floor((clientHeight-v_popwin_height)/2);
			obj.style.top = defaultTop + "px";			
		}
		
		vvstep = 10;
		function move(){
			currentTop = parseInt(obj.style.top.replace('/px/i',''));
			scrollTop = document.documentElement.scrollTop+document.body.scrollTop; //上部被卷去的高，Chrome某些情况会出错，必须这样才可以兼容所有浏览器
			targetTop = defaultTop+scrollTop;
			distance = Math.abs(currentTop-targetTop);
			var totalHeight = Math.max(clientHeight,scrollHeight);
			
			if( targetTop < currentTop ){ step = -vvstep }else{ step=vvstep } 
			if( distance >= vvstep  ){
				obj.style.top = currentTop + step + 'px';
			}else if( distance != 0 ){
				if( targetTop < currentTop ){
					obj.style.top = currentTop - 1 + 'px';
				}
				if( targetTop > currentTop ){
					obj.style.top = currentTop + 1 + 'px';
				}
			}
		}
		var outcall = setInterval(function(){move()},10);
	}
	this.hidden = function(){$id(this.id).style.display = "none"};
	this.remove = function(){var node = $id(this.id);if (node) {node.parentNode.removeChild(node);}};
}catch(e){}
}
