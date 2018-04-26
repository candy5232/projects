// 所有input check的jQuery扩展
jQuery.extend({
	//1: 验证通过
	//2: 姓名为空
	//3: 姓名长度不符合4-20字符内
	//4: 姓名只能包含中文、英文和空格
	TN_checkName: function(name) {
		name = name.replace(/(^\s*)/g, "");//去除开头空格
		if(name == ''){
			return 2;
		}else if(this.TN_strlen(name)>20 || this.TN_strlen(name)<4){
			return 3;
		}else {
			var expression = new RegExp("^[\u4E00-\u9FA5A-Za-z ]+$");
			if(expression.test(name)){
				return 1;
			}else{
				return 4;
			}
		}
	},
	//1: 验证通过
	//2: 姓名为空
	//3: 姓名过滤先生/小姐/女士/老师/。。等称谓性名字
	//4: 姓名只能包含中文
	TN_checkNameForTicket2: function(name) {
		name = name.replace(/(^\s*)/g, "");//去除开头空格
		if(name == ''){
			return 2;
		}else if(/(\u5148\u751f)|(\u5c0f\u59d0)|(\u5973\u58eb)|(\u8001\u5e08)/.test(name)){
			return 3;
		}else {
			var expression = new RegExp("^[\u4E00-\u9FA5]+$");
			if(expression.test(name)){
				return 1;
			}else{
				return 4;
			}
		}
	},	
	//1: 验证通过
	//2: 手机为空
	//3: 手机号码错误,目前支持130~139、150~153、155~159、180~183、185~189、145、147
	TN_checkTel: function(tel) {
		if(tel == ''){
			return 2;
		}else if(new RegExp("^((13[0-9])|(15[0-35-9])|(18[0-35-9])|145|147)[0-9]{8,8}$").test(tel) == false){
			return 3;
		}else{
			return 1;
		}
	},
	//1: 验证通过
	//2: 区号错误,3~4位数字
	//3: 座机号错误,7~8位数字
	TN_checkPhone: function(area_code,phone) {
		if (area_code!= '' || phone!='') {
			var reg1 = /^\d{3,4}$/;
			var reg2 =/^\d{7,8}$/;
			if(!reg1.test(area_code)){
				return 2;
			}
			if(!reg2.test(phone)){
				return 3;
			}		
		}
		return 1;
	},
	//1: 验证通过
	//2: 邮箱为空
	//3: 邮箱格式错误
	TN_checkEmail: function(email) {
		if (email != '') {
			var patrn = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
			if (!patrn.exec(email)) {
				return 3;
			}
		}else {
			return 2
		}
		return 1;
	},
	//1: 验证通过
	//2: 邮编为空
	//3: 邮编错误,6位数字
	TN_checkPostcode: function(postcode) {
		var expression = new RegExp("^[0-9]{6,6}$");
		if(expression.test(postcode) == true){
			return 1;
		}else if(postcode != ''){
			return 3;
		}else {
			return 2;
		}
	},
	//获取字符串长度,中文两个字符
	TN_strlen: function(str) {  
		var len = 0;  
		for (var i = 0; i < str.length; i++) {
			if (str.charCodeAt(i) > 255 || str.charCodeAt(i) < 0){
				len += 2;
			} else {
				len ++;
			}  
		}
		return len;  
	}
}); 
