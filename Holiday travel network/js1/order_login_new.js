/*
 * code by lishi 2012-06-02
 * 功能 ： 弹出登陆层
 * 备注 ： 实现先浏览订单，后登陆的功能。（区别于order_login.js）
 *  α 版本 	
 */
var orderLogin = {
		width : 290,
		height : 170,
		placeValuesBeforeTB :'savedValues',
		TB_iframe : true,
		modal : true,
		title : '登录',
		ticket_id : null,
		route_id : null,
        regphonewidth : 380,
        regphoneheight : 280,
        regphonetitle: '验证手机',
        hotelregwidth : 380,
        hotelregheight : 280,

		
		/**
		 * 判断登陆
		 * pars   		向ifream页面传递的参数
		 * login_func	登陆的成功后回调函数名  不带参数
		 * tel_func		快速登陆后回调函数名   参数 ： 手机号
		 * 
		 */
		isLogin : function (pars,login_func,tel_func,id,telephone){
			this.ticket_id = id;
			this.route_id = id;
            var url = "/main.php?do=order_login_ajax&flag=is_login&tel="+telephone+"&catch="+Math.random();
			$.get(url,function(data){
				if(data=='1'){
					eval(login_func+'()');
				}else{
					try{
						var tel = $("#tel_reg").val();
						if(tel!='' && tel!=undefined){
						eval(login_func+'()');
						}else{
							orderLogin.show_login(pars,login_func,tel_func,telephone);
						}
					}
					catch(e){
						orderLogin.show_login(pars,login_func,tel_func,telephone);
						};

				}
			})
		},
    check_login_tel : function (pars,login_func,tel_func,tel){
//        alert('我是新的orderlogin');
        this.tel = tel;
        var url = "/main.php?do=order_login_ajax&flag=check_login_tel&tel="+tel+"&catch="+Math.random();
        $.ajax({
            url:url,
            type:'post',
            async :false,
            success:function(data){
            if(data=='1'){
                $('#old_login_t').show();
            }else{
                $('#new_login_t').show();
            }
        }
        })
    },
    isLogin_sp : function (pars,login_func,tel_func,id){
        this.ticket_id = id;
        this.route_id = id;
        var url = "/main.php?do=order_login_ajax&flag=is_login&catch="+Math.random();
        $.get(url,function(data){
            if('1'){
                eval(login_func+'()');
            }else{
//                快速下单，登陆
//                try{
//                    var tel = $("#tel_reg").val();
//                    if(tel!='' && tel!=undefined){
//                        eval(login_func+'()');
//                    }else{
//                        orderLogin.show_login(pars,login_func,tel_func);
//                    }
//                }
//                catch(e){
//                    orderLogin.show_login(pars,login_func,tel_func);
//                };

            }
        })
    },
		//弹出登陆
		show_login : function(pars,login_func,tel_func,tel){
			var url = "/main.php?do=order_login_new&";
				url += "1=1&"+pars;
				url += "&login_func="+login_func;
				url += "&tel_func="+tel_func;
                url += "&tel="+tel;
				url += "&placeValuesBeforeTB="+this.placeValuesBeforeTB;
				url += "&TB_iframe="+this.TB_iframe;
				url += "&height="+this.height;
				url += "&width="+this.width;
				url += "&modal="+this.modal;
				url += "&catch="+Math.random();
			tb_show(this.title,url,'');
		},

		//关闭登陆
		close_login : function(){
			try{
				pageTracker._trackPageview("/度假/会员身份识别/跳出");
			}catch(_e){}
			tb_remove();
		},
    show_reg_phone_check : function(pars,login_func,tel_func,tel){
        var url = "/main.php?do=user_reg_phone_check&";
        url += "1=1&"+pars;
        url += "&login_func="+login_func;
        url += "&tel_func="+tel_func;
        url += "&tel="+tel;
        url += "&hid_flag=1";
        url += "&placeValuesBeforeTB="+this.placeValuesBeforeTB;
        url += "&TB_iframe="+this.TB_iframe;
        url += "&height="+this.regphoneheight;
        url += "&width="+this.regphonewidth;
        url += "&modal="+this.modal;
        url += "&catch="+Math.random();
//            alert(this.title);
//        alert (url);
        tb_show(this.regphonetitle,url,'');
    },
		//门票页面登录回调函数
		ticket_login_back : function(){
			$("#form_order_"+this.ticket_id).submit();
		},
		//门票快速预订回调函数
		ticket_tel_back : function (tel){
			 var strtel = "<input type='hidden'  name='tel' value='"+tel+"'>";
			 $("#button_"+this.ticket_id).before(strtel);
			 $("#form_order_"+this.ticket_id).submit();
		},
		//线路登录回调函数
		route_login_back : function(){
			var mode = $("#mode").val();
			try{
				var tel = $("#tel_reg").val();
			}catch(_e){
				var tel = '';
			}
			//alert(tel);
			if(tel!=''){
			 	var strtel = "<input type='hidden'  name='tel' value='"+tel+"'>";
				$("#order_price").after(strtel);
			}
			 view_order2(mode);
		},
		
		//线路快速预订回调函数
		route_tel_back : function(tel){
			 var mode = $("#mode").val();
			 var strtel = "<input type='hidden'  name='tel' value='"+tel+"'>";
			 $("#order_price").after(strtel);
			 view_order2(mode);
		},
		//自助游登陆回调函数
		package_login_back : function(){
			 $('#step2').submit();
		},
		//自助游快速预订回调函数
		package_tel_back : function(tel){
			 var strtel = "<input type='hidden'  name='tel' value='"+tel+"'>";
			 $("#room_num").after(strtel);
			 $('#step2').submit();
		},
		//新自助游登陆
		new_package_login_back : function(){
			 $('#package_form').submit();
		},
	    //新自助游快速预订回调函数
		new_package_tel_back : function(tel){
			 var strtel = "<input type='hidden'  name='tel' value='"+tel+"'>";
			 $("#room_price").after(strtel);
			 $('#package_form').submit();
		},
		//
		new_package_pack_login_back : function(){
			//增加重复预订提示 - yzg
			if(typeof reptip != 'undefined' && !reptip())
			{
				return false;
			}
			//增加重复预订提示 - yzg
			$('#pack_form').submit();
		},
	    //新自助游快速预订回调函数
		new_package_pack_tel_back : function(tel){
			 var strtel = "<input type='hidden'  name='tel' value='"+tel+"'>";
			 $("#room_price").after(strtel);
			 $('#pack_form').submit();
		},
		//签证
		login_back_2 : function(){
			$('#form_order').submit();
		},
		tel_back_2 : function(tel){
			 var strtel = "<input type='hidden'  name='tel' value='"+tel+"'>";
			 $("#route_id").after(strtel);
			 $('#form_order').submit();
		},
		//门票
		login_back_3 : function(){			
			window.location.href="http://"+window.location.host+"/main.php?do=ticket_booking";
		},
		tel_back_3 : function(tel){
			window.location.href="http://"+window.location.host+"/main.php?do=ticket_booking&tel="+tel;
		},
        //新门票
		login_back_4 : function(){
			$('#ticket_booking').submit();
		},
		tel_back_4 : function(tel){
			var strtel = "<input type='hidden'  name='tel' value='"+tel+"'>";
			$("#ticket_id").after(strtel);
			$('#ticket_booking').submit();
		},
		//酒店
		hotel_login_back : function(){
			$('#hotel_booking').submit();
		},
		hotel_tel_back : function(tel){
			var strtel = "<input type='hidden'  name='tel' value='"+tel+"'>";
			$("#book_room_num").after(strtel);
			$('#hotel_booking').submit();
		},
		//抵用券秒杀
		coupon_login_back : function(){
			$('#coupon_booking').submit();
		},
		coupon_tel_back : function(tel){
			var strtel = "<input type='hidden'  name='tel' value='"+tel+"'>";
			$("#route_id").after(strtel);
			$('#coupon_booking').submit();
		},
		//签证
		visa_login_back : function(){
			$('#visa_booking').submit();
		},
		visa_tel_back : function(tel){
			var strtel = "<input type='hidden' name='tel' value='"+tel+"'>";
			$("#visa_id").after(strtel);
			$('#visa_booking').submit();
		},
		//团购线路登录回调函数
		gp_route_login_back : function(){
			group_purchase.view_order();
		},
		//团购线路快速预订回调函数
		gp_route_tel_back : function(tel){
			 $("#tel").val(tel);
			 group_purchase.view_order();
		},
		// 公司旅游快速登录回调函数
		conpany_route_login_callback : function(){
			var route_id = document.getElementById('route_id_hide').value;
			window.location.href="http://"+window.location.host+ '?do=tour_order_create&rid=' + route_id;
		},
		//公司旅游快速登录回调函数  快速预订回调函数
		conpany_route_tel_callback : function(tel){
			var route_id = document.getElementById('route_id_hide').value;
			window.location.href="http://"+window.location.host+ '?do=tour_order_create&rid=' + route_id;
		}
			
}