// JavaScript Document
//=============================================================================================================
//*************************************************************************************************************
//****************************************异步操作人员的方法***************************************************

/*人员信息页面必须动态添加的js，accountId>0 表明此用户已登录

<script type="text/javascript">
	//全局变量，存储accountId
	var accountId=<%= ""+accountId %>;
	//全局变量，存储异步请求的url
	var url="/member/logon.do";
	//全局变量，用于存储返回后需要操作的所在行的行数
	var tmpRowId="";
	//全局变量，用于存储已经选择的出行成人人数
	var tmpANum=0;
	//全局变量，用于存储已经选择的出行儿童人数
	var tmpCNum=0;
</script>


可以使用的全局变量：
	//全局变量，存储旅客信息
	var persons=new Array();
	//全局变量，存储账号在旅客信息中的数组下标
	var accountIndex;
页面中的元素说明：	
	addAudlt 			     添加成人旅客按钮
	addChild 				添加儿童(婴儿旅客的按钮)
	addAudltCancel          添加成人旅客取消按钮
	addChildCancel          添加儿童旅客取消按钮	
	lusername				登录用户名框
	lpassword				登录密码框
	loginform 				登录框（包括三个选项）
	loginResult 			登录成功后显示框
	linkManSelect 			联系人下拉框
	loginButton 			登录按钮
	rusername 				注册用户名
	checkUsernameMsg 		检查用户名是否可用提示信息
	checkUsernameResult 	检查用户名是否可用结果	hidden
	checkUsernameButton 	检查用户名是否可用按钮
	loginflag 				登录选项标志			hidden
	logintable              登录框表格
	personstable            显示人员列表的表格
	allpersons              显示人员列表的div
	goperson                显示出行人的表格
	persons					显示出行人员的容器
	audlttable              添加成人表格
	childtable              添加儿童表格

*/



//全局变量，存储人员所对应的中文类型
var personTypes=new Array();
personTypes[0]="成人";
personTypes[1]="儿童";
personTypes[2]="婴儿";

//全局变量,存储证件所对应的中文类型
var certifyTypes=new Array();
certifyTypes[0]="其他";
certifyTypes[1]="身份证";
certifyTypes[2]="港澳通行证";
certifyTypes[3]="军官证";
certifyTypes[4]="护照";

//验证2个值是否相同,并返回值
function CheckSame(fid,tid,str){
	var flag=" ";
	if(fid=="" && tid==""){
		flag=str;
	}
	if(fid==tid){
		flag=str;	
	}	
	return flag;
}

//全局变量，存储旅客信息
var persons=new Array();
//全局变量，存储账号在旅客信息中的数组下标
var accountIndex=-1;
//Person类
function newPerson(personid,name,persontype,gender,certifyid,idnumber,phone,mobilephone,email,address,meal,seat,birthday,isself,zip,insure){
	this.personid=personid;
	this.name=name;
	this.persontype=persontype;
	this.gender=gender;
	this.certifyid=certifyid;
	this.idnumber=idnumber;
	this.phone=phone;
	this.mobilephone=mobilephone;
	this.email=email;
	this.address=address;
	this.meal=meal;
	this.seat=seat;
	this.birthday=birthday;
	this.isself=isself;
	this.zip=zip;
	this.insure=insure;
	this.personcards=null;		
}

//修改persons数组中的值
function updatePerson(rowid,personid,name,persontype,gender,certifyid,idnumber,phone,mobilephone,email,address,meal,seat,birthday,isself,zip,insure){
	persons[rowid].personid=personid;
	persons[rowid].name=name;
	persons[rowid].persontype=persontype;
	persons[rowid].gender=gender;
	persons[rowid].certifyid=certifyid;
	persons[rowid].idnumber=idnumber;
	persons[rowid].phone=phone;
	persons[rowid].mobilephone=mobilephone;
	persons[rowid].email=email;
	persons[rowid].address=address;
	persons[rowid].meal=meal;
	persons[rowid].seat=seat;
	persons[rowid].birthday=birthday;
	persons[rowid].isself=isself;
	persons[rowid].zip=zip;
	persons[rowid].insure=insure;
	persons[rowid].personcards=null;
}

//==========================================登录begin===================================================
//登录
function login(){
	var username=document.getElementById("lusername").value.trim();
	var password=document.getElementById("lpassword").value.trim();
	if(username=="" || password==""){
		alert("用户名或密码不能为空");
		return false;
	}
	var method="POST";
	
	var loginTypes=document.getElementsByName("loginType");
	var loginType="";
	for (var i=0;i<loginTypes.length ;i++ ){
		if(loginTypes[i].checked==true){
			loginType=loginTypes[i].value;
		}
	}
	if(loginType=="byCard")
	{
		var params="method=loginByCard&username="+ username +"&password="+ password;
		var loader=new net.ContentLoader(url,checkLoginResult,loginError,method,params);
	}
	else if(loginType=="byUserName")
	{
		var params="method=login&username="+ username +"&password="+ password;
		var loader=new net.ContentLoader(url,checkLoginResult,loginError,method,params);
	//hideShowLoginButton();
	}
}

//解析Login返回的XML
function checkLoginResult(){
	var root;
	if(navigator.userAgent.indexOf("MSIE")>0){ 	//为兼容IE7浏览器
		var responseXMLdoc = new ActiveXObject("Microsoft.XMLDOM");		
		responseXMLdoc.loadXML(this.req.responseText);
		root = responseXMLdoc.documentElement;
	}else{
		root= this.req.responseXML.documentElement;
	}
	
	var result = root.getElementsByTagName('success');	//区分大小写
	var resultsesson=root.getElementsByTagName('errorsession');
	if(result.length==0){
		//如果session过期
		if(resultsesson.length>0){
			getSessionFailed();
		}
		else{
			loginFailed();
		}
		
	}else{
		persons=new Array();	
		DelAllRow();
		ModAdultChildNum();
		
		parsePersonXmlData(root);
		parsePersonXmlSuccess();
	}	
}


//登录失败
function loginFailed(){	
	alert("用户名或密码错误，登录失败！");
	//hideShowLoginButton();
}

//登录发生错误
function loginError(){
	alert("连接服务器失败，请稍后重试！");
	//hideShowLoginButton();
}
//==========================================登录end===================================================

//==========================================获取人员信息begin===========================================
//如果已经登录，获取旅客信息
function getPersons(){	
	var method="POST";
	var params="method=getpersons";
	
	var loader=new net.ContentLoader(url,getPersonsResult,getPersonsError,method,params);
}


//处理获取旅客信息的返回结果
function getPersonsResult(){
	var root;
	if(navigator.userAgent.indexOf("MSIE")>0){ 	//为兼容IE7浏览器
		var responseXMLdoc = new ActiveXObject("Microsoft.XMLDOM");		
		responseXMLdoc.loadXML(this.req.responseText);
		root = responseXMLdoc.documentElement;
	}else{
		root= this.req.responseXML.documentElement;
	}
				
	var result=root.getElementsByTagName('success');	//区分大小写
	var resultsesson=root.getElementsByTagName('errorsession');
	if(result.length==0){
		//如果session失效
		if(resultsesson.length>0){
			getSessionFailed();
		}
		else{
			getPersonsFailed();
		}
	}
	else{
        parsePersonXmlData(root);
		parsePersonXmlSuccess();
	}	
}

//获取旅客信息失败
function getPersonsFailed(){	
	alert("获取旅客失败,请稍后重试！");
	document.getElementById("persons").innerHTML="";
}

//获取旅客信息发生错误
function getPersonsError(){
	alert("连接服务器失败，请重新登录！");
	document.getElementById("persons").innerHTML="";
}

//解析persons XML
function parsePersonXmlData(root){
	accountId = root.getElementsByTagName('accountid') ? root.getElementsByTagName('accountid')[0].firstChild.data : "0";	
	var result = root.getElementsByTagName('person');			
	for(var i=0;i<result.length;i=i+1) {
		var node=result[i];
		var newp=new newPerson(node.getElementsByTagName('personid')[0].firstChild.data
			,node.getElementsByTagName('name')[0].firstChild.data
			,node.getElementsByTagName('persontype')[0].firstChild.data
			,node.getElementsByTagName('gender')[0].firstChild.data
			,node.getElementsByTagName('certifyid')[0].firstChild.data
			,node.getElementsByTagName('idnumber')[0].firstChild.data
			,node.getElementsByTagName('phone')[0].firstChild.data
			,node.getElementsByTagName('mobilephone')[0].firstChild.data
			,node.getElementsByTagName('email')[0].firstChild.data
			,node.getElementsByTagName('address')[0].firstChild.data
			,node.getElementsByTagName('meal')[0].firstChild.data
			,node.getElementsByTagName('seat')[0].firstChild.data
			,node.getElementsByTagName('birthday')[0].firstChild.data
			,node.getElementsByTagName('isself')[0].firstChild.data
			,node.getElementsByTagName('zip')[0].firstChild.data
			,node.getElementsByTagName('insure')[0].firstChild.data);
		persons.push(newp);				
		if(newp.isself=="1"){
			accountIndex=i;
		}				
	}		
}

//  解析旅客信息成功
function parsePersonXmlSuccess() {
	//  初始化联系人选择框
	initLinkManSelect();
	if(accountIndex>=0) {
		document.getElementById("loginform").style.display="none";
		//document.getElementById("loginResult").innerHTML=persons[accountIndex].name+"，您好，请填写预订单！";
		//document.getElementById("loginResult").style.display="block";
		addLinkman(accountIndex);//添加为联系人
		document.getElementById("linkManSelect").value=accountIndex;
		updateLinkman();
	}
	else {
		document.getElementById("loginform").style.display="none";
	}
	//  显示人员列表表格
	document.getElementById("personstable").style.display="block";
	//  显示已选人员表格
	document.getElementById("goperson").style.display="block";
	var personsDiv=document.getElementById("allpersons");
	//  循环显示人员信息
	personsDiv.innerHTML="";
	for(var i=0;i<persons.length;i++) {
		var person=persons[i];
		if(person.persontype!=2){	//不显示婴儿
			//将人员显示到页面上
			personsDiv.innerHTML+='<div class="person"><input type="checkbox" name="ckPerson" id="ckPerson'+ i +'" value="'+i+'" onclick="return selectPerson(this);" >'+person.name+'('+personTypes[person.persontype]+')</div>';
		}
		if(person.personid==contactPersonId) {
			//  当前人员ID==上一步的联系人ID，添加到联系人列表框
			addLinkman(i);
		}
	}
	//  自动选择上一步选择的人员
	autoSelectPerson(selectedPersonIds);
	//  选中上一步的联系人
	autoSelectLinkMan(contactPersonId);
}

/*
 * 功能：用于显示一个人员以及修改界面
 * 参数：(行号,人员类型,姓名,证件类型,证件号码,保险份数,手机号码,人员ID,电子邮件,电话,出生日期,餐饮习惯,座位习惯)
 */
function AddLine(i,persontype,name,gender,certifyid,idnumber,insure,mobilephone,
                  personid,email,phone,birthday,meal,seat){
    var objTable = document.getElementById("persons");         
    var objRow = objTable.insertRow();
	objRow.id = i;

	//插入一行用于显示人员基本信息
	//在预订流程中如果下一步需要获取人员的某个ID或者Name时,只需在这里添加一个同名的隐藏域即可

	var obj0 = objRow.insertCell(0);
	var obj1 = objRow.insertCell(1);
	var obj2 = objRow.insertCell(2);
	var obj3 = objRow.insertCell(3);
	var obj4 = objRow.insertCell(4);
	var obj5 = objRow.insertCell(5);

	if(persontype==0) {
		obj0.innerHTML=name;
		obj1.innerHTML=personTypes[persontype];
		obj2.innerHTML='<span id="pcertifyid'+i+'">'+certifyTypes[certifyid]+'</span>';
		obj3.innerHTML='<span id="pidnumber'+i+'">'+idnumber+'</span>';
        obj4.innerHTML='<a href="javascript:ModifyRowByRowID('+i+')">修 改</a>';
        obj5.innerHTML='<a href="javascript:DelRowByRowID('+persontype+','+i+')">删 除</a>';
	}
	else {
		obj0.innerHTML=name;
		obj1.innerHTML=personTypes[persontype];
		obj2.innerHTML='出生日期';
		obj3.innerHTML='<span id="pbirthday'+i+'">'+(birthday.length>10?birthday.substring(0,10):birthday)+'</span>';
        obj4.innerHTML='<a href="javascript:ModifyRowByRowID('+i+')">修 改</a>';
        obj5.innerHTML='<a href="javascript:DelRowByRowID('+persontype+','+i+')">删 除</a>';
	}
	//插入修改人员资料的表格
    var objRow_mod = objTable.insertRow();
    objRow_mod.id = "_"+ i ;
    objRow_mod.style.display="none";
    var objmod_0=objRow_mod.insertCell(0);
    objmod_0.colSpan = 6;
    var modstr="";
    //人员资料修改表格开始
        
    modstr +='<table width="100%" border="0" cellpadding="3" cellspacing="0" >';
    modstr += '<tr><td width="30%" style="text-align:right;">姓名</td><td style="text-align:left;">'+name+'<input name="personName" id="personName'+i+'" type="hidden" value="'+name+'"></td></tr>';
    //如果是成人
    if(persontype==0){       	
       modstr += '<tr>';
       modstr += '<td style="text-align:right;">性别</td>';
       modstr += '<td style="text-align:left;">';
       modstr += '<select name="gender" class="selectCssn" id="gender'+i+'">';
       modstr += '                <option value="M" '+CheckSame(gender,'M','selected')+'>男</option>';
       modstr += '                <option value="F" '+CheckSame(gender,'F','selected')+'>女</option>';
       modstr += '                <option value="N" '+CheckSame(gender,'N','selected')+'>保密</option>';
       modstr += '            </select>';
       modstr += '</td>';
       modstr += '</tr>';
       modstr += '<tr>';	
       modstr += '<td style="text-align:right;">证件类型</td>';
       modstr += '<td style="text-align:left;">';
       modstr += '<select name="certifyID" class="selectCssn" id="certifyID'+i+'">';
       modstr += '                <option value="1" '+CheckSame(certifyid,1,'selected')+'>身份证</option>';
       modstr += '                <option value="2" '+CheckSame(certifyid,2,'selected')+'>港澳通行证</option>';
       modstr += '                <option value="3" '+CheckSame(certifyid,3,'selected')+'>军官证</option>';
       modstr += '                <option value="4" '+CheckSame(certifyid,4,'selected')+'>护照</option>';
       modstr += '                <option value="0" '+CheckSame(certifyid,0,'selected')+'>其他</option>';
       modstr += '            </select>';
       modstr += '</td>';
       modstr += '</tr>';
       modstr += '<tr>';
       modstr += '<td style="text-align:right;">证件号</td>';
       modstr += '<td style="text-align:left;"><input name="idNumber" type="text" class="input" id="idNumber'+i+'" size="30" maxlength="50" value="'+idnumber+'"></td>';
       modstr += '<input name="sbirthday" id="birthday"'+i+'"  type="hidden" value=""></tr>';
    }
    //如果是儿童或婴儿
    else{
    	modstr += '<tr>';
		modstr += '<td style="text-align:right;">性别</td>';
		modstr += '<td style="text-align:left;">';
		modstr += '<select name="gender" class="selectCssn" id="gender'+i+'">';
		modstr += '                <option value="M" '+CheckSame(gender,'M','selected')+'>男</option>';
		modstr += '                <option value="F" '+CheckSame(gender,'F','selected')+'>女</option>';
		modstr += '                <option value="N" '+CheckSame(gender,'N','selected')+'>保密</option>';
		modstr += '            </select>';
		modstr += '</td>';
		modstr += '</tr>';
    	modstr += '<tr>';	
		modstr += '<td style="text-align:right;">证件类型</td>';
		modstr += '<td style="text-align:left;">';
		modstr += '<select name="certifyID" class="selectCssn" id="certifyID'+i+'">';
		modstr += '                <option value="1" '+CheckSame(certifyid,1,'selected')+'>身份证</option>';
		modstr += '                <option value="2" '+CheckSame(certifyid,2,'selected')+'>港澳通行证</option>';
		modstr += '                <option value="3" '+CheckSame(certifyid,3,'selected')+'>军官证</option>';
		modstr += '                <option value="4" '+CheckSame(certifyid,4,'selected')+'>护照</option>';
		modstr += '                <option value="0" '+CheckSame(certifyid,0,'selected')+'>其他</option>';
		modstr += '            </select>';
		modstr += '</td>';
		modstr += '</tr>';
		modstr += '<tr>';
		modstr += '<td style="text-align:right;">证件号</td>';
		modstr += '<td style="text-align:left;"><input name="idNumber" type="text" class="input" id="idNumber'+i+'" size="30" maxlength="50" value="'+idnumber+'"></td>';
		modstr += '</tr>';
    	modstr +='<tr>';
       	modstr +='<td style="text-align:right;">出生日期</td>';
       	modstr +='<td style="text-align:left;"><input size="15" name="sbirthday" id="birthday'+i+'" class="input" value="'+(birthday.length>10?birthday.substring(0,10):birthday)+'" onclick=event.cancelBubble=true;showCalendarAll("birthday'+i+'",false,"birthday'+i+'")></td>';
       	modstr +='</tr>';
    }
    
    modstr +='<tr><input class=input name="personID" id="personID'+i+'" type="hidden" value="'+personid+'"/><input class=input name="persontype" id="persontype'+i+'" type="hidden" value="'+persontype+'"/>';
    modstr +='<td colspan="2"><div align="center"><input type="button" name="Submit" value="修 改" onClick="ModPerson('+i+','+persontype+');">&nbsp;&nbsp;';
    modstr +='<input type="button" name="button2" value="关 闭" onClick="CloseModifyDetailUI();"></div></td>';
    modstr +='</tr>';
    modstr +='</table>';
	objmod_0.innerHTML=modstr;	
	
}


//==========================================获取人员信息end=============================================



//==========================================修改人员信息开始=============================================


/*
 *	功能：打开修改条目显示
 */
function ModifyRowByRowID(rowid,size){
	var rowobj = document.getElementById("_"+ rowid);
	var oldvalue = rowobj.style.display;
	CloseModifyDetailUI(); //关闭一切打开的修改界面
	if (oldvalue != "none"){
		rowobj.style.display="none";
	}else{
		rowobj.style.display="block";
	}
}
/*
 * 功能：关闭所有修改界面显示
 */
function CloseModifyDetailUI(){
	for (var i=0; i<document.getElementById("persons").rows.length; i++ ){
		var value = document.getElementById("persons").rows[i].id;
		if(value!=null && value.length>0){
			var tmp = value.substring(0,1);
			if(tmp=="_"){
				document.getElementById("persons").rows[i].style.display = "none";
			}
		}
	}
}


//修改人员
function ModPerson(rowid,personType){		
	var method="POST";
	var params="";
	//将要操作的行的值存储到临时变量里
	tmpRowId=rowid;
	var personid=document.getElementById("personid"+rowid).value;
	var certifyID=document.getElementById("certifyID"+rowid).value;
	var idNumber=document.getElementById("idNumber"+rowid).value.trim();
    var gender=document.getElementById("gender"+rowid).value;
    //如果是成人
	if(personType==0){		
		if(idNumber==""){
			alert("证件号码不能为空");
			return false;
		}
		if(certifyID==1){
			if(!isIdCardNo(idNumber)){
				alert("身份证号码不正确，请检查");
				return false;
			}
		}
		params="method=modperson&personid="+personid+"&persontype="+personType+"&gender="+gender+"&certifyid="+certifyID+"&idnumber="+encodeURIComponent(idNumber);
	}
	else{
		var birthday=document.getElementById("birthday"+rowid).value.trim();
		if(birthday==""){
			alert("出生日期不能为空");
			return false;
		}
		if(!dateCheck(birthday)){
			alert("出生日期格式不正确");
			return false;
		}
		params="method=modperson&personid="+personid+"&persontype="+personType+"&gender="+gender+"&certifyid="+certifyID+"&idnumber="+encodeURIComponent(idNumber)+"&birthday="+birthday;
	}
	//修改人员信息
	var loader=new net.ContentLoader(url,modPersonResult,modPersonError,method,params);

}

//处理修改旅客的返回结果
function modPersonResult(){
	var birstr="";
	var root;
	if(navigator.userAgent.indexOf("MSIE")>0){ 	//为兼容IE7浏览器
		var responseXMLdoc = new ActiveXObject("Microsoft.XMLDOM");		
		responseXMLdoc.loadXML(this.req.responseText);
		root = responseXMLdoc.documentElement;
	}else{
		root= this.req.responseXML.documentElement;
	}
	
	var result = root.getElementsByTagName('success');	//区分大小写
	if(result.length==0){
		modPersonError();
	}else{
	
		//解析返回的XML并更新页面中的信息
		var result = root.getElementsByTagName('person');
		var node=result[0];	
		
		var person_type=node.getElementsByTagName('persontype')[0].firstChild.data;
		//如果是成人或儿童
		if(person_type==0){
			document.getElementById("pcertifyid"+tmpRowId).innerText=certifyTypes[node.getElementsByTagName('certifyid')[0].firstChild.data];
			document.getElementById("pidnumber"+tmpRowId).innerText=node.getElementsByTagName('idnumber')[0].firstChild.data;
			//document.getElementById("pmobilephone"+tmpRowId).innerText=node.getElementsByTagName('mobilephone')[0].firstChild.data;
		}
		//如果是婴儿
		else{
			birstr=node.getElementsByTagName('birthday')[0].firstChild.data;
			if(birstr.length>10){
				birstr=birstr.substring(0,10);
			}
			document.getElementById("pbirthday"+tmpRowId).innerText=birstr;
		}
		
		//修改persons数组里的值
		updatePerson(tmpRowId,node.getElementsByTagName('personid')[0].firstChild.data,
					node.getElementsByTagName('name')[0].firstChild.data,
					node.getElementsByTagName('persontype')[0].firstChild.data,
					node.getElementsByTagName('gender')[0].firstChild.data,
					node.getElementsByTagName('certifyid')[0].firstChild.data,
					node.getElementsByTagName('idnumber')[0].firstChild.data,
					node.getElementsByTagName('phone')[0].firstChild.data,
					node.getElementsByTagName('mobilephone')[0].firstChild.data,
					node.getElementsByTagName('email')[0].firstChild.data,
					node.getElementsByTagName('address')[0].firstChild.data,
					node.getElementsByTagName('meal')[0].firstChild.data,
					node.getElementsByTagName('seat')[0].firstChild.data,
					node.getElementsByTagName('birthday')[0].firstChild.data,
					node.getElementsByTagName('isself')[0].firstChild.data,
					node.getElementsByTagName('zip')[0].firstChild.data,
					node.getElementsByTagName('insure')[0].firstChild.data);
		//更新联系人信息
		updateLinkman();
		
		alert("修改成功");
		//关闭修改界面
		CloseModifyDetailUI(); 
		
	}	
}
//操作失败
function modPersonError(){
	alert("修改失败,请稍后重试！");
}
//==========================================修改人员信息结束=============================================


//===========================================添加旅客begin==============================================
/*
 * 功能：用于显示添加人员的表格JS
 */
function ShowAdd(personType){
	if(personType==0){
		document.all.childtable.style.display = "none"; 
		document.all.audlttable.style.display = "block"; 
	}
	else if(personType==1){
		document.all.audlttable.style.display = "none"; 
		document.getElementById("cpersontype").value = 1;
		document.all.childtable.style.display = "block"; 
		
	}
	else if(personType==2){
		document.all.audlttable.style.display = "none"; 
		document.getElementById("cpersontype").value = 2;
		document.all.childtable.style.display = "block"; 
		
	}
}


//添加成人旅客
function addAudltPerosn(){
	var loginflag=document.getElementById("loginflag").value;
	if(loginflag=="logined" && accountId==0){
		alert("如果你是会员，请先登录！");
		return false;
	}
	var params="";
	var namecn=document.getElementById("anamecn").value.trim();
	var certifyid=document.getElementById("acertifyid").value;
	var idnumber=document.getElementById("aidnumber").value.trim();
	var gender=document.getElementById("agender").value;
	
	if(namecn==""){
		alert("旅客姓名不能为空");
		return false;
	}	
	if(idnumber==""){
		alert("证件号码不能为空");
		return false;
	}
	
	if(certifyid==1){
			if(!isIdCardNo(idnumber)){
				alert("身份证号码不正确，请检查");
				return false;
			}
	}
	
	 params="method=addperson&namecn="+ encodeURIComponent(namecn);
	 params=params+"&persontype=0&certifyid="+certifyid+"&idnumber="+encodeURIComponent(idnumber)+"&gender="+gender;
	//src客户来源、garden会员所属平台、usertype人员类型（所属平台）、membertype客户类型
	params+="&src=web&garden=C&usertype=C&membertype=G";
	var method="POST";
	var loader=new net.ContentLoader(url,addAudltPersonResult,addAudltError,method,params);
	hideShowButton('addAudlt','正在添加...','添加旅客');
}


//添加成人旅客的结果
function addAudltPersonResult(){
	var root;
	if(navigator.userAgent.indexOf("MSIE")>0){ 	//为兼容IE7浏览器
		var responseXMLdoc = new ActiveXObject("Microsoft.XMLDOM");		
		responseXMLdoc.loadXML(this.req.responseText);
		root = responseXMLdoc.documentElement;
	}else{
		root= this.req.responseXML.documentElement;
	}
				
	var result = root.getElementsByTagName('success');
	var resultsesson=root.getElementsByTagName('errorsession');	
	if(result.length==0){
		//如果session失效
		if(resultsesson.length>0){
			getSessionFailed();
		}
		else{
			addFailed();
			hideShowButton('addAudlt','正在添加...','添加旅客');
		}
	}
	else{		
		parseAddXmlData(root);
		parseAddXmlSuccess();
		hideShowButton('addAudlt','正在添加...','添加旅客');
		//将添加人员的表单清空
		document.getElementById("anamecn").value="";
		document.getElementById("acertifyid").value="1";
		document.getElementById("aidnumber").value="";
		document.getElementById("agender").value="M";

		//将添加人员的表格隐藏
		//  addCancel();
		//显示人员列表表格
		document.getElementById("personstable").style.display="block";
		//显示已选人员表格
		document.getElementById("goperson").style.display="block";
		
	}	
	
}

//添加成人旅客失败
function addAudltError(){
	alert("连接服务器失败，请稍后重试！");
	hideShowButton('addAudlt','正在添加...','添加');
}


//添加儿童(婴儿)旅客
function addChildPerosn(){
	var loginflag=document.getElementById("loginflag").value;
	if(loginflag=="logined" && accountId==0){
		alert("如果你是会员，请先登录！");
		return false;
	}
	var params="";
	var namecn=document.getElementById("cnamecn").value.trim();
	var birthday=document.getElementById("cbirthday").value.trim();
	var teamStartoffDate=document.getElementById("teamStartoffDate").value.trim();
	var persontype=document.getElementById("cpersontype").value;
	var certifyid=document.getElementById("ccertifyid").value;
	var idnumber=document.getElementById("cidnumber").value.trim();
	var gender=document.getElementById("cgender").value;

	if(namecn=="") {
		alert("旅客姓名不能为空");
		return false;
	}
	if(birthday=="") {
		alert("出生日期不能为空");
		return false;
	}
	if(!dateCheck(birthday)) {
		alert("出生日期格式不正确");
		return false;
	}
	//判断是否为儿童（2-12岁）
	var date=new Date(birthday.replace(/-/g,'/'));
	var yearNum=(new Date(teamStartoffDate.replace(/-/g,'/'))-date)/(3600*24*1000)/365;
	if( yearNum<2 || yearNum>12) {
		alert("请正确填写儿童（2-12岁）的出生日期");
		return false;
	}
	params="method=addperson&namecn="+ encodeURIComponent(namecn);
	params=params+"&persontype="+persontype+"&birthday="+birthday+"&certifyid="+certifyid+"&idnumber="+encodeURIComponent(idnumber)+"&gender="+gender;
	//src客户来源、garden会员所属平台、usertype人员类型（所属平台）、membertype客户类型
params+="&src=web&garden=C&usertype=C&membertype=G";
	var method="POST";
	var loader=new net.ContentLoader(url,addChildPersonResult,addChildError,method,params);
	hideShowButton('addChild','正在添加...','添加旅客');
}

//添加儿童(婴儿)旅客的结果
function addChildPersonResult(){
	var root;
	if(navigator.userAgent.indexOf("MSIE")>0){ 	//为兼容IE7浏览器
		var responseXMLdoc = new ActiveXObject("Microsoft.XMLDOM");		
		responseXMLdoc.loadXML(this.req.responseText);
		root = responseXMLdoc.documentElement;
	}else{
		root= this.req.responseXML.documentElement;
	}
				
	var result = root.getElementsByTagName('success');
	var resultsesson=root.getElementsByTagName('errorsession');	
	if(result.length==0){
		//如果session失效
		if(resultsesson.length>0){
			getSessionFailed();
		}
		else{
			addFailed();
			hideShowButton('addChild','正在添加...','添加旅客');
		}
	}
	else{		
		parseAddXmlData(root);
		parseAddXmlSuccess();
		hideShowButton('addChild','正在添加...','添加旅客');
		//将添加人员的表单清空
		document.getElementById("cnamecn").value="";
		document.getElementById("cbirthday").value="";
		document.getElementById("ccertifyid").value="0";
		document.getElementById("cidnumber").value="";
		document.getElementById("cgender").value="M";
		
		//将添加人员的表格隐藏
		//  addCancel();
		//显示人员列表表格
		document.getElementById("personstable").style.display="block";
		//显示已选人员表格
		document.getElementById("goperson").style.display="block";	
	}	
	
}




//添加儿童旅客失败
function addChildError(){
	alert("连接服务器失败，请稍后重试！");
	hideShowButton('addChild','正在添加...','添加');
}

function addFailed(){
	alert("添加失败，请稍后重试！");
}

//改变添加旅客时按钮的显示状态
function hideShowButton(idname,valuestr,valuestrt){
	var cb=document.getElementById(idname);
	if(cb.disabled==false){
		cb.disabled=true;
		cb.value=valuestr;
	}else{
		cb.disabled=false;
		cb.value=valuestrt;
	}
}



//解析添加人员返回的XML
function parseAddXmlData(root){
	accountId = root.getElementsByTagName('accountid')[0].firstChild.data;			
	var newp=new newPerson(root.getElementsByTagName('personid')[0].firstChild.data,
					root.getElementsByTagName('name')[0].firstChild.data,
					root.getElementsByTagName('persontype')[0].firstChild.data,
					root.getElementsByTagName('gender')[0].firstChild.data,
					root.getElementsByTagName('certifyid')[0].firstChild.data,
					root.getElementsByTagName('idnumber')[0].firstChild.data,
					root.getElementsByTagName('phone')[0].firstChild.data,
					root.getElementsByTagName('mobilephone')[0].firstChild.data,
					root.getElementsByTagName('email')[0].firstChild.data,"",
					root.getElementsByTagName('meal')[0].firstChild.data,
					root.getElementsByTagName('seat')[0].firstChild.data,
					root.getElementsByTagName('birthday')[0].firstChild.data,"0","","");		
	persons.push(newp);					
		
}



//添加旅客成功
function parseAddXmlSuccess(){
	var person = persons[persons.length-1];
	var i =	persons.length-1;
	//将人员加到人员列表中并选中
	var personsDiv=document.getElementById("allpersons");
	personsDiv.innerHTML += '<div class="person"><input type="checkbox" name="ckPerson" id="ckPerson'+ i +'" value="'+i+'" onclick="return selectPerson(this);" >'+person.name+'('+personTypes[person.persontype]+')</div>';
	document.getElementById("ckPerson"+ i).click();
		
}


//===========================================添加旅客end=======================================================

//==========================================检查用户名是否存在begin=====================================
//检查用户名是否存在
function checkUsername(){
	var username=document.getElementById("rusername").value.trim();
	if(username==""){
		alert("用户名不能为空");
		return false;
	}	
	var method="POST";
	var params="method=checkusername&username="+ encodeURIComponent(username);
	var loader=new net.ContentLoader(url,parseCheckXmlData,checkError,method,params);
	hideShowCheckButton();
	event.returnValue=false;
}
//解析checkUsername返回的XML
function parseCheckXmlData(){
	var root;
	if(navigator.userAgent.indexOf("MSIE")>0){ 	//为兼容IE7浏览器
		var responseXMLdoc = new ActiveXObject("Microsoft.XMLDOM");		
		responseXMLdoc.loadXML(this.req.responseText);
		root = responseXMLdoc.documentElement;
	}else{
		root= this.req.responseXML.documentElement;
	}
				
	var result=root.firstChild.data;	//区分大小写	
	if(result=="true"){
		document.getElementById("checkUsernameMsg").innerHTML="<font color=red>恭喜你，此用户名可用！</font>";
		document.getElementById("checkUsernameResult").value="true";
	}else{
		document.getElementById("checkUsernameMsg").innerHTML="<font color=red>此用户名已被使用，请换用其他用户名！</font>";
		document.getElementById("checkUsernameResult").value="false";
	}
	hideShowCheckButton();

}

//检查用户名发生错误
function checkError(){
	alert("连接服务器失败，请稍后重试！");
	hideShowCheckButton();
}

//改变检查按钮的显示状态
function hideShowCheckButton(){
	var cb=document.getElementById("checkUsernameButton");
	if(cb.disabled==false){
		cb.disabled=true;
		cb.value="正在检查...";
		cb.innerText="正在检查...";
	}else{
		cb.disabled=false;
		cb.value="检查用户名是否可用";
		cb.innerText="检查用户名是否可用";
	}
}

function usernameChange(){
	document.getElementById("checkUsernameResult").value="false";
}

//==========================================检查用户名是否存在begin=====================================



//初始化联系人选择框
function initLinkManSelect(){
	var linkManSelect=document.getElementById("linkManSelect");
	while(linkManSelect.options.length>0) {
		linkManSelect.remove(0);
	}
	var opt1=document.createElement("OPTION");	
	linkManSelect.options.add(opt1);
	opt1.innerText="新增联系人";
	opt1.value=-1;
}

//根据用户选择是否注册及是否会员显示相应操作
function show(obj){
	if(obj==1){
		document.getElementById("logintable").style.display = "block";   //登陆
		document.getElementById("registertable").style.display = "none";    //注册
		document.getElementById("loginflag").value="logined";
	}else if(obj==2){
		document.getElementById("logintable").style.display = "none";
		document.getElementById("registertable").style.display = "block";
		document.getElementById("loginflag").value="wantreg";
	}else if(obj==3){
		document.getElementById("logintable").style.display = "none";
		document.getElementById("registertable").style.display = "none";
		document.getElementById("loginflag").value="dontwantreg";
	}
}

//  添加联系人到下拉框
function addLinkman(peronIndex) {
	var linkManSelect=document.getElementById("linkManSelect");

	if(persons[peronIndex].persontype==0) {
		var added=false;
		for(var li=0;li<linkManSelect.options.length;li=li+1) {
			if(linkManSelect.options[li].value==peronIndex) {
				added=true;
				break;
			}
		}
		if(!added) {
			var opt1=document.createElement("OPTION");
			linkManSelect.options.add(opt1);
			opt1.innerText=persons[peronIndex].name;
			opt1.value=peronIndex;
			//delLinkman(-1);
		}
	}
}

//  把联系人从下拉框去掉
function delLinkman(peronIndex) {
	var linkManSelect=document.getElementById("linkManSelect");
	var oldValue=linkManSelect.value;
	//  alert(linkManSelect.value);
	for(var i=0;i<linkManSelect.options.length;i++) {
		if(linkManSelect.options[i].value==peronIndex) {
			linkManSelect.remove(i);
			break;
		}
	}
	if(oldValue!=linkManSelect.value){
		//联动联系人
		updateLinkman();
	}
}

//  根据contactPersonId选中联系人列表框对应的联系人
function autoSelectLinkMan(contactPersonId) {
	var linkManSelect=document.getElementById("linkManSelect");
	for(var pi=0;pi<persons.length;pi=pi+1) {
		var person=persons[pi];
		if(person.personid==contactPersonId) {
			linkManSelect.value=pi;
		}
	}
	updateLinkman();
}

//联动联系人
function updateLinkman() {
	var linkManSelect=document.getElementById("linkManSelect");
	var personIndex=linkManSelect.value*1;
	if(personIndex==-1){
		document.getElementById("lpersonid").value=0;
		document.getElementById("lname").value="";
		document.getElementById("lname").readOnly=false;
		document.getElementById("lphone").value="";
		document.getElementById("lmobilephone").value="";
		document.getElementById("lcertifyid").value=1;
		document.getElementById("lidnumber").value="";
		document.getElementById("lidnumber").readOnly=false;
		document.getElementById("lemail").value="";
		document.getElementById("laddress").value="";
		document.getElementById("lzip").value="";
	}else{
		var person=persons[personIndex];
		document.getElementById("lpersonid").value=person.personid;
		document.getElementById("lname").value=person.name;
		document.getElementById("lname").readOnly=true;
		document.getElementById("lphone").value=person.phone;
		document.getElementById("lmobilephone").value=person.mobilephone;
		document.getElementById("lcertifyid").value=person.certifyid;
		document.getElementById("lidnumber").value=person.idnumber;
		document.getElementById("lidnumber").readOnly=true;
		document.getElementById("lemail").value=person.email;
		document.getElementById("laddress").value=person.address;
		document.getElementById("lzip").value=person.zip;
	}
}
//选择入住人checkbox触发事件
function selectPerson(obj){
	var peronIndex=obj.value*1;
	var person=persons[peronIndex];
	if(obj.checked) {
		//操作已选的人员数量
		if(person.persontype==0) {
			tmpANum=tmpANum+1*1;
		}
		else {
			tmpCNum=tmpCNum+1*1;
		}

		/*//判断人数是否超过原定人数,当fill页面需要进行人数判断的时候操作
		if(tmpANum>document.getElementById("personNum").value){
			tmpANum=tmpANum-1*1;
			alert("对不起，您选择的成人人数不能大于"+document.getElementById("personNum").value);	
			return false;
		}
		
		if(tmpCNum>document.getElementById("boyNum").value){
			tmpCNum=tmpCNum-1*1;
			alert("对不起，您选择的儿童人数不能大于"+document.getElementById("boyNum").value);	
			return false;
		}
		*/

	   //添加人员到已选出行人中
		AddLine(peronIndex,person.persontype,person.name,person.gender,person.certifyid,
		        person.idnumber,person.insure,person.mobilephone,person.personid,
		       person.email,person.phone,person.birthday,person.meal,person.seat);   

       //添加人员到联系人列表
       if(peronIndex!=accountIndex) {
			addLinkman(peronIndex);
		}
	}
	else {
	    //操作已选的人员数量
		if(person.persontype==0){
			tmpANum=tmpANum-1*1;
		}
		else{
			tmpCNum=tmpCNum-1*1;
		}

	    //删除取消的行数
	    for (var i=document.getElementById("persons").rows.length-1; i>=0 ; i-- ) {
			if(document.getElementById("persons").rows[i].id==peronIndex ) {
				document.getElementById("persons").deleteRow(i);
			}
			else if(document.getElementById("persons").rows[i].id=="_"+peronIndex ) {
				document.getElementById("persons").deleteRow(i);
			}
		}

	    //删除联系人列表中的该人员
		if(peronIndex!=accountIndex) {
			delLinkman(peronIndex);
		}
	}

	ModAdultChildNum();
}

//  修改页面的选择成人数和儿童数和价格
function ModAdultChildNum() {
	document.getElementById("adultNumText").value=tmpANum;
	document.getElementById("adultNumSpan").innerText=tmpANum;

	document.getElementById("childNumText").value=tmpCNum;
	document.getElementById("childNumSpan").innerText=tmpCNum;
	
	var totalMoney=adultBasePrice*tmpANum+childBasePrice*tmpCNum;
	document.getElementById("totalMoneyText").value=totalMoney;
	document.getElementById("totalMoneySpan").innerText=totalMoney;	
}

//根据删除按钮来删除行
function DelRowByRowID(personType,value){

	//操作已选的人员数量
		if(personType==0){
			tmpANum=tmpANum-1*1;
		}
		else{
			tmpCNum=tmpCNum-1*1;
		}
    //删除取消的行数
	for (var i=document.getElementById("persons").rows.length-1; i>=0 ; i-- ){
	 	if (document.getElementById("persons").rows[i].id==value ){
			document.getElementById("persons").deleteRow(i);	
		}
		else if (document.getElementById("persons").rows[i].id=="_"+value ){
			document.getElementById("persons").deleteRow(i);	
		}
	}
	    
	 //将该PERSONID设置为不选		
	document.getElementById("ckPerson"+value).checked=false;
	
	//删除联系人列表中的该人员
	if(value!=accountIndex){
       delLinkman(value);
    }
    
    ModAdultChildNum();
}
//删除所有旅客
function DelAllRow() {
	var	tmpAllRows = document.getElementById("persons")
	while(tmpAllRows.rows[0]) tmpAllRows.deleteRow(0);
	tmpANum=0;
	tmpCNum=0;
}
//添加人员取消
function addCancel(){
	//将添加人员的表格隐藏
	document.all.addpersontable.style.display = "none";
//	document.all.childtable.style.display = "none";
	document.all.personType_0.checked = false;
	document.all.personType_1.checked = false;
	document.all.personType_2.checked = false;
}


//根据选择用户名类型来自动填写用户名
function copyusername(obj){
	if(obj==1) {
		document.getElementById("rusername").value = document.getElementById("lphone").value;   
	}else if(obj==2){
		document.getElementById("rusername").value = document.getElementById("lemail").value;
	}else if(obj==3){
		document.getElementById("rusername").value = "";
	}
}
//*******************************************异步操作人员的方法end*********************************************
// personids   12,3,85
function autoSelectPerson(selectedPersonIds) {
	var ckPersons=document.getElementsByName("ckPerson");
	for(var cp=0;cp<ckPersons.length;cp=cp+1) {
		if(selectedPersonIds.indexOf(""+persons[ckPersons[cp].value].personid)>=0) {
			ckPersons[cp].checked=true;
			ckPersons[cp].fireEvent("onclick");
		}
	}
}
//*******************************************表单验证begin*********************************************
//判断提交的表单
function checkAll() {
	if(document.getElementById("accountid")) {
		document.getElementById("accountid").value=accountId;
	}
	if(document.getElementById("userName")) {
		document.getElementById("userName").value=userName;
	}

	var paymentSelected=-1;
	var paymentRadios=document.getElementsByName("tourOrderDto.paymentMode");
	for(var pi=0;pi<paymentRadios.length;pi=pi+1) {
		if(paymentRadios[pi].checked) {
			paymentSelected=pi;
		}
	}

	var trafficSelected=-1;
	var trafficRadios=document.getElementsByName("tourOrderDto.trafficMode");
	for(var ti=0;ti<trafficRadios.length;ti=ti+1) {
		if(trafficRadios[ti].checked) {
			trafficSelected=ti;
		}
	}
	
	var canSubmit=false;
	//var certifyid=document.getElementById("lcertifyid").value;
	//var idnumber=document.getElementById("lidnumber").value.trim();
	
	//  判断填写的信息是否完整
	if(tmpANum*1<=0) {
		window.alert("请选择成人旅客！");
	}
/*	else if(paymentSelected<0) {
		window.alert("请选择支付方式！");
	}
	else if(trafficSelected<0) {
		window.alert("请选择配送方式！");
	}
	else if(document.getElementById("trafficmode2").checked==true&&document.getElementById("trafficaddress").value=="") {
		alert("请填写送票地址");
	}*/
	else if(document.getElementById("lname").value.trim()=="") {
		alert("联系人不能为空！");
	}
	else if(document.getElementById("lphone").value.trim()=="" && document.getElementById("lmobilephone").value.trim()==""){
		alert("联系电话和手机至少要填写一项！");
	}
	else if(document.getElementById("lidnumber").value.trim()==""){
		alert("身份证号码不能为空！");
	}
	else if(document.getElementById("lidnumber").value.trim()!="" && document.getElementById("lcertifyid").value==1 &&  !isIdCardNo(document.getElementById("lidnumber").value.trim())  ){
		alert("身份证号码不正确，请检查");
	}
	else if(document.getElementById("lemail").value.trim()==""){
		alert("联系人邮箱地址不能为空！");
	}
	else if(document.getElementById("lemail").value.trim()!=""&&  !emailCheck(document.getElementById("lemail").value.trim())  ) {
		alert("联系人邮箱地址不合法！");
	}
	else {
		canSubmit=true;
	}
	if(canSubmit==false) {
		return false;
	}

	var loginflag=document.getElementById("loginflag").value;
	//当新注册用户时判断
	if (loginflag=="wantreg"){
		if(document.getElementById("rusername").value.trim()==""){
			alert("注册用户名不能为空！");
			return false;
		}
		if(document.getElementById("checkUsernameResult").value=="" || document.getElementById("checkUsernameResult").value=="false"){
			if(document.getElementById("checkUsernameMsg").innerHTML=="") {
				document.getElementById("checkUsernameButton").fireEvent("onclick");
				alert("正在检查注册用的用户名，请稍候...");
				return checkAll();
			}else{
				alert("请检查注册用的用户名，确保可用");
				return false;
			}
		}	
		if(document.getElementById("rpassword").value.trim()==""){
			alert("注册密码不能为空！");
			//form.rpassword.focus();
			return false;
		}
		if(document.getElementById("rpassword2").value.trim()==""){
			alert("注册确认密码不能为空！");
			return false;
		}
		if(document.getElementById("rpassword").value.trim()!=document.getElementById("rpassword2").value.trim()){
			alert("密码和确认密码不相同！");
			document.getElementById("rpassword").value="";
			document.getElementById("rpassword2").value="";			
			return false;
		}
	}	
/*	//判断已选的出行成人数是否为0
	if(tmpANum!=document.getElementById("personNum").value){
		alert("对不起，您选择的成人数不够！");
		return false;
	}
	//判断已选的出行儿童数是否为0
	if(tmpCNum!=document.getElementById("boyNum").value){
		alert("对不起，您选择的儿童数不够！");
		return false;
	}*/
	
	//提交表单
	return canSubmit;
}
//*******************************************表单验证end*********************************************
function getSessionFailed(){
	//如果为预订过程中的页面，则重载一次
	alert("对不起,您的操作已过期,请重试!");
	window.location.reload();
	//如果为会员的人员管理页面，则返回到登录页面
	//alert("对不起,您的操作已过期,请重新登录!");
	//window.location.href="/member/login.jsp";
}

window.onload=function() {
	//  添加成人
	document.getElementById("addAudlt").onclick=addAudltPerosn;
	//  取消添加成人
	document.getElementById("addAudltCancel").onclick=addCancel;
	//  添加儿童&婴儿
	document.getElementById("addChild").onclick=addChildPerosn;
	//  取消添加儿童&婴儿
	document.getElementById("addChildCancel").onclick=addCancel;
	//  载入人员
	if(accountId*1>0) {
		getPersons();
	}
	//  初始化联系人选择框
	initLinkManSelect();
	//  绑定联系人
	document.getElementById("linkManSelect").onchange=updateLinkman;
	//  登录按钮
	//  document.getElementById("loginButton").onclick=login;
	//  检查用户名是否存在按钮
	document.getElementById("checkUsernameButton").onclick=checkUsername;
	//  tourfill.jsp页面上的初始化function
	initByLoginFlag();
}