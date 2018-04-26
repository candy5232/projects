// JavaScript Document
function switchmodTag(){
}
switchmodTag.prototype = {
	st : function(menus,divs,openClass,closeClass){
		var _this = this;
		if(menus.length != divs.length)
		{
			alert("");
			return false;
		}				
		for(var i = 0 ; i < menus.length ; i++)
		{	
			_this.$(menus[i]).value = i;				
			_this.$(menus[i]).onmouseover  = function(){//如果想把效果变成点击切换，将此行onmouseover 改成onclick即可。
					
				for(var j = 0 ; j < menus.length ; j++)
				{						
					_this.$(menus[j]).className = closeClass;
					_this.$(divs[j]).style.display = "none";
				}
				_this.$(menus[this.value]).className = openClass;	
				_this.$(divs[this.value]).style.display = "block";				
			}
		}
		},
	$ : function(oid){
		if(typeof(oid) == "string")
		return document.getElementById(oid);
		return oid;
	}
}
window.onload = function(){
	var STmodel = new switchmodTag();
	STmodel.st(["a_1","a_2","a_3","a_4","a_5","a_6","a_7","a_8","a_9"],["c1_1","c1_2","c1_3","c1_4","c1_5","c1_6","c1_7","c1_8","c1_9"],"st01","st02");//第一组动滑轮
	STmodel.st(["b_1","b_2","b_3","b_4","b_5","b_6","b_7","b_8","b_9"],["c2_1","c2_2","c2_3","c2_4","c2_5","c2_6","c2_7","c2_8","c2_9"],"st01","st02");//第二组动滑轮
	STmodel.st(["c_1","c_2","c_3"],["d3_1","d3_2","d3_3"],"sta01","sta02");//第三组动滑轮
		STmodel.st(["e_1","e_2","e_3"],["e3_1","e3_2","e3_3"],"stab01","stab02");//第四组动滑轮

	//如需增加滑动门个数，请复制代码，ID命名规则如上即可。
}