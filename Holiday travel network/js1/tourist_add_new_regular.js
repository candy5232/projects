var tourist_add = {
    special : 0,//记录特殊人群
    real_children_num :0 ,
    has_old_80 :0,
    data_clear : function(num){
		
        $("#name_"+num).val('');
		$("#en_name_"+num).val('');
        $("#paper_num_"+num).val('');
        $("#tel_"+num).val('');
    },
	
    copy : function(){
		
        $("#name_1").val($("#tourist_name").val());
        $("#tel_1").val($("#tourist_tel").val());
    },
	
    change_paper : function(num){
        var paper_type = this.formatInt($("#paper_type_"+num).val());
		var booking_type = this.formatInt($("#booking_type").val());
		
		if(paper_type==1){
			$("#en_name_info_"+num).hide();
			$("#ga_tip_"+num).hide();
			$("#hz_tip_"+num).hide();
			$("#paper_deadline_"+num).hide();
			$("#gatxz_csd_info_"+num).hide();
			$("#gatxz_qfd_info_"+num).hide();
			$("#passport_qfd_info_"+num).hide();
			$("#xgqz_flag_"+num).hide();
			$("#tourist_"+num).find(".has_xgqz").hide();
			$("#amqz_flag_"+num).hide();
			$("#tourist_"+num).find(".has_amqz").hide();
			$("#nation_"+num).hide();
			$("#sex_info_"+num).hide();
            $("#birthday_info_"+num).hide();
        }else if(paper_type==2){
			$("#en_name_info_"+num).show();
			$("#ga_tip_"+num).hide();
			$("#hz_tip_"+num).show();
			$("#paper_deadline_"+num).show();
			$("#gatxz_csd_info_"+num).hide();
			$("#gatxz_qfd_info_"+num).hide();
			$("#passport_qfd_info_"+num).show();
			$("#xgqz_flag_"+num).hide();
			$("#tourist_"+num).find(".has_xgqz").hide();
			$("#amqz_flag_"+num).hide();
			$("#tourist_"+num).find(".has_amqz").hide();
			$("#nation_"+num).show();
			$("#sex_info_"+num).show();
            $("#birthday_info_"+num).show();
		}else if(paper_type==4){
           
			var xg_flag = this.formatInt($("#tourist_"+num).find("[name='xgqz_"+num+"'][checked]").val());
			var am_flag = this.formatInt($("#tourist_"+num).find("[name='amqz_"+num+"'][checked]").val());
			
			$("#en_name_info_"+num).show();
			$("#ga_tip_"+num).show();
			$("#hz_tip_"+num).hide();
			$("#paper_deadline_"+num).show();
			$("#gatxz_csd_info_"+num).show();
			$("#gatxz_qfd_info_"+num).show();
			$("#passport_qfd_info_"+num).hide();
			if(booking_type==3){
				$("#xgqz_flag_"+num).show();
				if(xg_flag==1){
					$("#tourist_"+num).find(".has_xgqz").show();
				}else{
					$("#tourist_"+num).find(".has_xgqz").hide();
				}
				$("#amqz_flag_"+num).show();
				if(am_flag==1){
					$("#tourist_"+num).find(".has_amqz").show();
				}else{
					$("#tourist_"+num).find(".has_amqz").hide();
				}
			}else if(booking_type==4){
				$("#xgqz_flag_"+num).show();
				if(xg_flag==1){
					$("#tourist_"+num).find(".has_xgqz").show();
				}else{
					$("#tourist_"+num).find(".has_xgqz").hide();
				}
				$("#amqz_flag_"+num).hide();
				$(".has_amqz").hide();
			}else if(booking_type==5){
				$("#xgqz_flag_"+num).hide();
				$(".has_xgqz").hide();
				$("#amqz_flag_"+num).show();
				if(am_flag==1){
					$("#tourist_"+num).find(".has_amqz").show();
				}else{
					$("#tourist_"+num).find(".has_amqz").hide();
				}
			}
			$("#nation_"+num).show();
			$("#sex_info_"+num).show();
            $("#birthday_info_"+num).show();
        }else{
			$("#en_name_info_"+num).hide();
			$("#ga_tip_"+num).hide();
			$("#hz_tip_"+num).hide();
			$("#paper_deadline_"+num).hide();
			$("#gatxz_csd_info_"+num).hide();
			$("#gatxz_qfd_info_"+num).hide();
			$("#passport_qfd_info_"+num).hide();
			$("#xgqz_flag_"+num).hide();
			$("#tourist_"+num).find(".has_xgqz").hide();
			$("#amqz_flag_"+num).hide();
			$("#tourist_"+num).find(".has_amqz").hide();
			$("#nation_"+num).hide();
			$("#sex_info_"+num).show();
            $("#birthday_info_"+num).show();
		}
		this.checkPaperMatch(paper_type,booking_type,num);
    },
	
	checkPaperMatch : function(paper_type,booking_type,num){
		
		if(booking_type==2&&paper_type!=2){
			$("#paper_type_tip_"+num).html('为保证您的顺利出游，请提供因私护照信息。如无因私护照，建议办理后再预订。');
			$("#add_remark_"+num).val('客人无因私护照');
		}else if(booking_type>2&&paper_type!=4){
			$("#paper_type_tip_"+num).html('如无港澳通行证，建议先办理后再预订。');
			$("#add_remark_"+num).val('客人无港澳通行证');
		}else{
			$("#paper_type_tip_"+num).html('');
			$("#add_remark_"+num).val();
		}
		
	},
	
    check_name : function(num){
        name_flag=0;
        var name = $("#name_"+num).val();
        var result = $.TN_checkName(name);
        var parent_name_tip = $("#parent_name_tip").val();
        $("#name_tip_e_"+num).html('');
        switch(result){
            case 1:
                $("#name_"+num).css('class','txt_m txt_input');
                $("#name_tip_"+num).html('');
                return true;
                break;
            case 2:
                $("#name_"+num).css('class','txt_m txt_input orange_border');
                if(parent_name_tip!=''){
                    $("#name_tip_"+num).html('点击可选择常用游客');
                }else{
                    $("#name_tip_"+num).html('请填写姓名');
                }
                success=0;
                return false;
                break;
            case 3:
                $("#name_"+num).css('class','txt_m txt_input orange_border');
                $("#name_tip_"+num).html('姓名长度请在4-20字符内（1个汉字等于2个字符）');
                success=0;
                return false;
                break;
            default:
                $("#name_"+num).css('class','txt_m txt_input orange_border');
                $("#name_tip_"+num).html('姓名只能包含中文、英文和空格');
                success = 0;
                return false;
                break;
        }
    },
	
	check_en_name : function(num){
		
		var name = $("#en_name_"+num).val();
       	var patrn = /^[A-Za-z]+\/[A-Za-z]+$/;
		if(!patrn.exec(name)){
			$("#en_name_tip_"+num).html('请填写正确的英文姓名，例如ZHANG/SAN');
			return false;
		}
		$("#en_name_tip_"+num).html('');
		return true;
	},
	
    check_tel : function(num){		
        tel_flag=0;
        var tel = $("#tel_"+num).val();
        var result = $.TN_checkTel(tel);
        switch(result){
            case 1:
                $("#tel_tip_"+num).html('');
                return true;
                break;
            case 2:
                // $("#tel_tip_"+num).html('请填写正确的手机号码');
                // success=0;
                // return false;
                break;
            default:
                $("#tel_tip_"+num).html('请填写正确的手机号码');
                success=0;
                return false;
                break;
        }
    },
    getdate : function(){
        return  new Date();
    },

    check_id : function(num){
        var paper_type = $("#paper_type_"+num).val();
		var id_card = $("#paper_num_"+num).val();
        
		if(paper_type == 1){
            //身份证	
            var result = $.TN_checkIdCard(id_card);
            var birthday = '';
            switch(result){
                case 15:
                    birthday = this.formatInt(id_card.substr(6,2))+1900+'-'+id_card.substr(8,2)+'-'+id_card.substr(10,2);
                    $("#id_tip_"+num).html('');
                    $("#tourist_birthday_"+num).val(birthday);
                    // return true;
                    break;
                case 18:
                    birthday = id_card.substr(6,4)+'-'+id_card.substr(10,2)+'-'+id_card.substr(12,2);
                    $("#id_tip_"+num).html('');
                    $("#tourist_birthday_"+num).val(birthday);					
                    // return true;
                    break;
                default:
                    $("#id_tip_"+num).html('请填写正确的证件号码');
                    return false;
            // break;
            }
        }else if(paper_type == 2){
			//因私护照
			var patrn = /^[A-Za-z0-9]+$/;
			if(!patrn.exec(id_card)){
				$("#id_tip_"+num).html('请填写正确的证件号码，');
				return false;
			}
			$("#id_tip_"+num).html('');
			var birthday =  this.getBirthday(num);
		}else if(paper_type == 4){
			//港澳通行证
			var patrn = /^[A-Z][0-9]{8,8}$/;
			if(!patrn.exec(id_card)){
				$("#id_tip_"+num).html('请填写正确的港澳通行证号码，');
				return false;
			}
			$("#id_tip_"+num).html('');
			var birthday =  this.getBirthday(num);
		}else{
            if($("#paper_num_"+num).val()==''){
                $("#id_tip_"+num).html('请填写正确的证件号码');
                return false;
            }
            $("#tourist_birthday_"+num).val('');
            $("#id_tip_"+num).html('');
            var birthday =  this.getBirthday(num);
        }
        
        var sp = 0;
        var birthday_obj = new Date(birthday.substr(0,4),birthday.substr(5,2),birthday.substr(8,2));
        var today= this.getdate();
        var diff_year = birthday_obj.dateDiff("y",today);
        if(diff_year<18 ){
            sp += 4;
            this.real_children_num += 1;            
        }else if(diff_year>=70){
            sp += 2;
        }
        
        if(diff_year>80){
        	this.has_old_80 = 1;        	
        }
        
        if((paper_type==2)||(paper_type==7)||(paper_type==4)||(paper_type==6)){
            sp += 1;
        }
        
        this.special = (this.special | sp);
		
        return true;
    },
    getBirthday: function(num){
        var year = this.formatInt($("#birth_year_"+num).val());
        var month = this.formatInt($("#birth_month_"+num).val());
        var day = this.formatInt($("#birth_day_"+num).val());
        month =month<10?'0'+month:month;
        day = day<10?'0'+day:day;
        birthday = year+'-'+month+'-'+day;
        return birthday;		
    },	
	
	checkCsd : function(num){
		
		var csd = $("#gatxz_csd_"+num).val();
		csd = csd.replace(/(^\s*)/g, "");//去除开头空格
		if(csd == ''){
			$("#gatxz_csd_tip_"+num).html('请填写出生地');
			return false;
		}else if($.TN_strlen(csd)>20 || $.TN_strlen(csd)<4){
			$("#gatxz_csd_tip_"+num).html('出生地内容应在4~20个字符');
			return false;
		}else {
			var expression = new RegExp("^[\u4E00-\u9FA5A-Za-z ]+$");
			if(expression.test(csd)){
				$("#gatxz_csd_tip_"+num).html('');
				return true;
			}else{
				$("#gatxz_csd_tip_"+num).html('请填写正确的出身地');
				return false;
			}
		}
	},
	
	checkQfd : function(num){
	
		var qfd = $("#gatxz_qfd_"+num).val();
		qfd = qfd.replace(/(^\s*)/g, "");//去除开头空格
		if(qfd == ''){
			$("#gatxz_qfd_tip_"+num).html('请填写签发地');
			return false;
		}else if($.TN_strlen(qfd)>20 || $.TN_strlen(qfd)<4){
			$("#gatxz_qfd_tip_"+num).html('签发地内容应在4~20个字符');
			return false;
		}else {
			var expression = new RegExp("^[\u4E00-\u9FA5A-Za-z ]+$");
			if(expression.test(qfd)){
				$("#gatxz_qfd_tip_"+num).html('');
				return true;
			}else{
				$("#gatxz_qfd_tip_"+num).html('请填写正确的签发地');
				return false;
			}
		}
	},
	
    change_calendar : function(num,type,pre_name){
		
        var year = this.formatInt($("#"+pre_name+"_year_"+num).val());
        var month = this.formatInt($("#"+pre_name+"_month_"+num).val());
        var day = this.formatInt($("#"+pre_name+"_day_"+num).val());
		
        var now = new Date();
        var now_year = this.formatInt(now.getFullYear()); 
        var now_month = this.formatInt(now.getMonth())+1;
        var now_day = this.formatInt(now.getDate());
		
		var flag = 0;
		if(pre_name=='birth'){
			flag = 1;
		}
		
        if(type=='year'){
			
            if(year==now_year){
				
                $("#"+pre_name+"_month_"+num).html(this.get_month_option(now_month,month,flag,1));
                if(month>=now_month){
                    $("#"+pre_name+"_day_"+num).html(this.get_day_option(year,month,day,flag));
                }else {
                    this.change_calendar(num,'month',pre_name);
                }
				
            }else{
				
                $("#"+pre_name+"_month_"+num).html(this.get_month_option(now_month,month,flag,0));
                this.change_calendar(num,'month',pre_name);
            }
			
        }else if(type=='month'){
			
			$("#"+pre_name+"_day_"+num).html(this.get_day_option(year,month,day,flag));
			
        }
		
		if(pre_name=='paper_deadline'){
			this.checkDeadline(pre_name,num);
		}
    },
	
	get_month_option : function(month_now,month_slt,flag,mark){		
		
		if(mark){
			//今年
			if(flag==1){
				//生日
				var begin = 1;
				var end = month_now;
			}else{
				//有效期
				var begin = month_now;
				var end = 12;
			}
		}else{
			var begin = 1;
			var end = 12;
		}
		
		var res = '';
        for(var i=begin;i<=end;i++){
			i=i<10?'0'+i:i;
            if(i==month_slt){
                res += "<option value="+i+" selected='selected'>";
            }else{
                res += "<option value="+i+">";
            }
            res += i+'</option>';
        }		
        return res;
    },
	
	get_day_option : function(year,month,day,flag){		
		
		var day_num = 0;
		
		if(month==1||month==3||month==5||month==7||month==8||month==10||month==12){
			day_num = 31;
		}else if(month==4||month==6||month==9||month==11){
			day_num = 30;
		}else if (year%4!=0&&month==2){
			day_num = 28;
		}else{
			day_num = 29;
		}
	   	
		var now = new Date();
        var now_year = this.formatInt(now.getFullYear()); 
        var now_month = this.formatInt(now.getMonth())+1;
		var now_day = this.formatInt(now.getDate());
		
		if((year==now_year)&&(month==now_month)){
			if(flag==1){
				//生日
				var begin = 1;
				var end = now_day;
			}else{
				//有效期
				var begin = now_day;
				var end = day_num;
			}
		}else{
			var begin = 1;
			var end = day_num;
		}
	 	
		var res = '';
        for(var i=begin;i<=end;i++){
            
            i=i<10?'0'+i:i;
            if(i==day){
                res += "<option value="+i+" selected='selected'>";
            }else{
                res += "<option value="+i+">";
            }
            res += i+'</option>';
        }		
        return res;
    },
	
	checkDeadline : function(pre_name,num){
		
		var year = this.formatInt($("#"+pre_name+"_year_"+num).val());
        var month = this.formatInt($("#"+pre_name+"_month_"+num).val());
        var day = this.formatInt($("#"+pre_name+"_day_"+num).val());
		var paper_type = this.formatInt($("#paper_type_"+num).val());
		var back_date = $("#back_date").val();
		var add_remark = $("#add_remark_"+num).val();
		$("#add_remark_"+num).val('');
		var deadline = new Date(year,month,day);
		var date = new Date(back_date.substr(0,4),back_date.substr(5,2),back_date.substr(8,2));
		
		if(pre_name=='paper_deadline'){
			$("#deadline_tip_"+num).html('');
			if(paper_type==2){
				if(date.dateDiff('m',deadline)<6){
					$("#deadline_tip_"+num).html('有效期不足6个月，可能导致无法出入境，建议先办理证件延期');
					$("#add_remark_"+num).val('客人因私护照有效期不足6个月');
				}
				if(date.dateDiff('d',deadline)<0){
					$("#deadline_tip_"+num).html('证件已经过了有效期，建议重新办理后再预订');
					$("#add_remark_"+num).val('客人因私护照过期');
				}
			}else if(paper_type==4){
				if(date.dateDiff('d',deadline)<0){
					$("#deadline_tip_"+num).html('证件已经过了有效期，建议重新办理后再预订');
					$("#add_remark_"+num).val('客人港澳通行证过期');
				}
			}
		}else if(pre_name=='xgqz'||pre_name=='amqz'){
			$("#"+pre_name+"_deadline_tip_"+num).html('');
			if(date.dateDiff('d',deadline)<0){
				$("#"+pre_name+"_deadline_tip_"+num).html('签注已经过了有效期，建议重新办理后再预订');
				if(pre_name=='amqz'){
					if(add_remark==''){
						$("#add_remark_"+num).val('客人澳门签注过期');
					}
				}else{
					if(add_remark==''){
						$("#add_remark_"+num).val('客人香港签注过期');
					}
				}
			}
		}
	},
	
    check_tourist_name : function(){
		
        tourist_name_flag=0;
        var name = $("#tourist_name").val();
        var result = $.TN_checkName(name);
        switch(result){
            case 1:
                $("#tourist_name").css('class','txt_m txt_input');
                $("#tourist_name_tip").html('');
                return true;
                break;
            case 2:
                $("#tourist_name").css('class','txt_m txt_input orange_border');
                $("#tourist_name_tip").html('请填写姓名');
                success=0;
                return false;
                break;
            case 3:
                $("#tourist_name").css('class','txt_m txt_input orange_border');
                $("#tourist_name_tip").html('姓名长度请在4-20字符内（1个汉字等于2个字符）');
                success=0;
                return false;
                break;
            default:
                $("#tourist_name").css('class','txt_m txt_input orange_border');
                $("#tourist_name_tip").html('姓名只能包含中文、英文和空格');
                success = 0;
                return false;
                break;
        }		
    },
	
    check_tourist_tel : function(){
		
        tourist_tel_flag=0;
        var tel = $("#tourist_tel").val();
        var result = $.TN_checkTel(tel);
        switch(result){
            case 1:
                $("#tourist_tel_tip").html('');
                var url = "/main.php?do=order_login_ajax&flag=check_login_tel&tel="+tel+"&catch="+Math.random();
                $.ajax({
                    url:url,
                    type:'post',
                    async :false,
                    success:function(data){
                    if(data == 1){
                        $('#old_login_t').show();
                        $('#new_login_t').css('display','none');
                    }else{
                        $('#new_login_t').show();
                        $('#old_login_t').css('display','none');
//                        $('#new_login_t').css('display','block');
//                        $('#old_login_t').css('display','none');
                    }
                }
                })
                return true;
                break;
            default:
                $("#tourist_tel_tip").html('请填写正确的手机号码');
                success=0;
                return false;
                break;
        }
    },
	
    check_tourist_phone : function(){
		
        tourist_phone_flag=0;
        var phone = $("#tourist_phone2").val()=='电话号码'?'':$("#tourist_phone2").val();
        var area_code = $("#tourist_phone1").val()=='区号'?'':$("#tourist_phone1").val();
        var result = $.TN_checkPhone(area_code,phone);
        switch(result){
            case 1:
                $("#tourist_phone_tip").html("（选填）");
                return true;
                break;
            case 2:
                $("#tourist_phone_tip").attr('class','err_notice');
                $("#tourist_phone_tip").html('请填写正确的区号');
                success=0;
                return false;
                break;
            default:
                $("#tourist_phone_tip").attr('class','err_notice');
                $("#tourist_phone_tip").html('请填写正确的座机号');
                success=0;
                return false;
                break;
        }
    },
	
    check_tourist_email : function(){
		
        tourist_phone_email=0;
        var email = $("#tourist_email").val();
        var result = $.TN_checkEmail(email);
        switch(result){
            case 1:
                $("#tourist_email_tip").html("");
                return true;
                break;
            case 2:
                $("#tourist_email_tip").html('请填写邮箱');
                success=0;
                return false;
                break;
            default:
                $("#tourist_email_tip").html('请填写正确的邮箱');
                success=0;
                return false;
                break;
        }
    },
	
    check_notice : function(){
        var flag = $("#agree_check").attr('checked');
        var  new_login_val = $("#new_login_t").css("display");
        var new_login_exist = $("#new_login_t").length;
        var commontip =  $("#commonTip");
        if ( new_login_exist > 0 ){
            if (flag){
                if ( new_login_val == 'none;'||new_login_val == 'none'){
                    return true;
                }else{ var  new_login_flag = $("#new_login:checked").length;
                    if(new_login_flag){
                        commontip.css('display','none');
                        return true;
                    }else{
                        var obj = document.getElementById("agree_check");
                        commontip.text("请仔细阅读途牛会员协议并打勾");
                        commontip.css('display','block');
                        commontip.css('top','-38px');
                        commontip.css('left','-18px');
                        return false;
                    }
                }
            }else{
                var obj = document.getElementById("agree_check");
                commontip.text("请仔细阅读合同条款并在下方打勾");
                commontip.css('display','block');
                commontip.css('top','-38px');
                commontip.css('left','-18px');
                return false;
            }
        }else {
            if(flag){
                var obj = document.getElementById("agree_check");
                commontip.css('display','none');
                return true;
            }else{
                var obj = document.getElementById("agree_check");
                commontip.text("请仔细阅读合同条款并在下方打勾");
                commontip.css('display','block');
                commontip.css('top','-38px');
                commontip.css('left','-18px');
                return false;
            }
        }

    },
    check_notice2 : function(){
        var flag = $("#new_login").attr('checked');
        if(flag){
            $("#commonTip").css('display','none');
            return true;
        }else{
            var obj = document.getElementById("agree_check");
            $("#commonTip").css('display','block');
            return false;
        }
    },
    check_tourist_info:function(){
        var check = true;
        if (!this.check_tourist_name()) {			
            check = false;
        }
        if (!this.check_tourist_tel()) {
            check = false;
        }
        var phone = $("#tourist_phone2").val();
        var area_code = $("#tourist_phone1").val();
        if(phone||area_code){
            if (!this.check_tourist_phone()) {
                check = false;
            }
        }
        if (!this.check_tourist_email()) {
            check = false;
        }
        return check;
    },
	
    check_visitor_info:function()
    {
        this.special = 0;
		this.real_children_num = 0;
        this.has_old_80 = 0;
		var booking_type = this.formatInt($("#booking_type").val());
        var check = true;
        var add_flag = this.formatInt($("#add_flag").val());
        var total_num = this.formatInt($("#user_num").val())+this.formatInt($("#children_num").val());
        var tel_flag=0;		
        $("#visitor_info").val('');
        total_num = add_flag>0?1:total_num;
        for(var i=0;i<total_num;i++){
            
			if(!this.check_name(i+1)){
				check = false;
			}
			
			if(!this.check_id(i+1)){
                check = false;
            }
			
			// check card_num and tel
            if(add_flag<1){
                l=i+1;
				var name = $("#name_"+l).val();
                var ct = $("#paper_type_"+l).val();
                var cn = $("#paper_num_"+l).val();
                for(j=i+1;j<total_num;j++){
                    m = j+1;
					var name1 = $("#name_"+m).val();
                    var ct1 = $("#paper_type_"+m).val();
                    var cn1 = $("#paper_num_"+m).val();
                    /*if(name==name1&&name!=''){
						$("#name_tip_"+m).html("游客信息重复，请重新填入");
                        $("#name_tip_"+l).html("游客信息重复，请重新填入");
                        check = false;
					}*/
					if(ct==ct1 && cn==cn1 && cn!=''){
                        $("#id_tip_"+m).html("证件号码不能一样");
                        $("#id_tip_"+l).html("证件号码不能一样");
                        check = false;
                    }
                }
            }
            var num = i+1;
			var paper_type = this.formatInt($("#paper_type_"+num).val());
			if(paper_type==2||paper_type==4){
				if(!this.check_en_name(num)){
					check = false;
				}
				this.checkDeadline('paper_deadline',num);
				if(paper_type==2){
					var qfd = $("#qfd_"+num).val();
					if(qfd=='请选择'){
						$("#passport_qfd_tip_"+num).html('请选择护照签发地');
						check = false;
					}else{
						$("#passport_qfd_tip_"+num).html('');
					}
				}else{
					var gatxz_qfd = $("#gatxz_qfd_"+num).val();
					if(gatxz_qfd=='请选择'){
						$("#gatxz_qfd_tip_"+num).html('请选择港澳通行证签发地');
						check = false;
					}else{
						$("#gatxz_qfd_tip_"+num).html('');
					}
					if(!this.checkCsd(num)){
						check = false;
					}
					if(booking_type==3||booking_type==4){
						if(typeof($("#tourist_"+num).find("[name='xgqz_"+num+"'][checked]").val())=='undefined'){
							$("#xgqz_tip_"+num).html('请选择有无香港签注');
							check = false;
						}else{
							this.checkDeadline('xgqz',num);
							$("#xgqz_tip_"+num).html('');
						}
					}
					if(booking_type==3||booking_type==5){
						if(typeof($("#tourist_"+num).find("[name='amqz_"+num+"'][checked]").val())=='undefined'){
							$("#amqz_tip_"+num).html('请选择有无澳门签注');
							check = false;
						}else{
							this.checkDeadline('amqz',num);
							$("#amqz_tip_"+num).html('');
						}
					}
				}
			}
			
            if(this.check_tel(i+1)){
                tel_flag=1;
            }
            this.set_visitor(i+1);
        }
        
        $("#has_foreigner").val((this.special & 1) == 1 ? 1:0);
        $("#has_old").val((this.special & 2) == 2 ?1:0);
        $("#has_child").val((this.special & 4) == 4 ?1:0);
        $("#has_old_80").val(this.has_old_80);
        $("#real_children_num").val(this.real_children_num);
        for(var i=1;i<=total_num;i++){
            $("#tel_tip_"+i).html(tel_flag == 1?'': '至少填写一位游客的手机号码');
        }
        if(tel_flag != 1){
            check = false;
        }
        return check;
    },
	
    check_submit : function(){
		
        if(!this.check_tourist_info()){
            if(location.hash == "#div_tourist_info"){
                location.hash='#';
            }
            location.hash='#div_tourist_info';
            return false;
        }
		
        if(!this.check_visitor_info()){
            if(location.hash == "#div_visitor_info"){
                location.hash='#';
            }
            location.hash='#div_visitor_info';
            return false;
        }
		
        if(!this.check_notice()){
            return false;
        }
//        if(!this.check_notice2()){
//            return false;
//        }

        var old_login_exist = $("#old_login_t").length;
        var  old_login_val = $("#old_login_t").css("display");
        if ( old_login_exist == 1 ){
            if ( old_login_val == 'none;'|| old_login_val == 'none'){
            }else{
                $('#login_tip').text('请先登录').show();
                    $(document).scrollTop(0);
                return false;
            }
        }
        var next_step  = $("#next_step").val();
        if(next_step!=''){
            $("#frm_submit").attr("action",'/main.php?do='+next_step);
        }
		
        this.setTouristInfo();
        $("#frm_submit").submit();
    },
	
    set_visitor : function(num){
        try{
            var add_flag = this.formatInt($("#add_flag").val());
        }catch (e){
            var add_flag =0;
        }

        var name = $("#name_"+num).val();
        var tel = $("#tel_"+num).val();
        if(add_flag<1){
            var paper_type = $("#paper_type_"+num).val();
            var paper_num = $("#paper_num_"+num).val();
            if(paper_type==1){
                if(paper_num.length==15){
                    var tn = paper_num.substring(14,15);
                }else{
                    var tn = paper_num.substring(16,17);
                }
                var sex = tn%2==1?1:0;
            }else{
                var sex = $("#sex_"+num).val();
            }
            var birthday = $("#tourist_birthday_"+num).val();
            if(birthday==''){
                birthday = this.getBirthday(num);
            }
			birthday_arr = birthday.split('-');
			if((birthday_arr[1]=='00'||birthday_arr[2]=='00')&&$("#birthday_info_"+num).css('display')!='none'){
				if(location.hash == "#div_visitor_info"){
					location.hash='#';
				}
				location.hash='#div_visitor_info';
				$("#birthday_tip_"+num).html('请选择出生日期');
				return false;
			}else{
				$("#birthday_tip_"+num).html('');
			}
			var en_name = $("#en_name_"+num).val()=='例如：ZHANG/SAN'?'':$("#en_name_"+num).val();
			var paper_deadline = $("#paper_deadline_year_"+num).val()+'-'+$("#paper_deadline_month_"+num).val()+'-'+$("#paper_deadline_day_"+num).val();
			var gacsd = $("#gatxz_csd_"+num).val();
			var gaqfd = $("#gatxz_qfd_"+num).val();
			var qfd = $("#qfd_"+num).val();
			var xg_flag = this.formatInt($("#tourist_"+num).find("[name='xgqz_"+num+"'][checked]").val());
			var xgqz_type = this.formatInt($("#xgqz_type_"+num).val());
			var xgqz_deadline = $("#xgqz_year_"+num).val()+'-'+$("#xgqz_month_"+num).val()+'-'+$("#xgqz_day_"+num).val();
			var am_flag = this.formatInt($("#tourist_"+num).find("[name='amqz_"+num+"'][checked]").val());
			var amqz_type = this.formatInt($("#amqz_type_"+num).val());
			var amqz_deadline = $("#amqz_year_"+num).val()+'-'+$("#amqz_month_"+num).val()+'-'+$("#amqz_day_"+num).val();
			var remark = $("#add_remark_"+num).val();
			var nationality = $("#nationality_"+num).val();
        }else{
            var paper_type='-';
            var paper_num ='-';
            var sex = '-';
            var birthday='-';
			var en_name = '-';
			var paper_deadline = '-'
			var gacfd = '-';
			var gaqfd = '-';
			var qfd = '-';
			var xg_flag = '-';
			var xgqz_type = '-';
			var xgqz_deadline = '-';
			var am_flag = '-';
			var amqz_type = '-';
			var amqz_deadline = '-';
			var remark = '-';
			var nationality = '-';
        }
		
        visitor_info = $("#visitor_info").val();
        visitor_info += name+','+paper_type+','+paper_num+','+sex+','+birthday+','+tel+','+en_name+','+paper_deadline+','+gacsd+','+gaqfd+','+qfd+','+xg_flag+','+xgqz_type+','+xgqz_deadline+','+am_flag+','+amqz_type+','+amqz_deadline+','+nationality+','+remark+';';
        $("#visitor_info").val(visitor_info);
    },
	
    showtips : function(num){
        obj = document.getElementById("ticket_tips_"+num);
        x = this.findPosX(obj)-15;
        y = this.findPosY(obj)+15;
        $("#ticket_tips").css("left",x);
        $("#ticket_tips").css("top",y);
        $("#ticket_tips").css("display",'');		
    },	
    removetips : function(num){
        $("#ticket_tips").css("display",'none');
    },
    findPosX : function(obj) {
        var curleft = 0;
        if (obj && obj.offsetParent) {
            while (obj.offsetParent) {
                curleft += obj.offsetLeft;
                obj = obj.offsetParent;
            }
        } else if (obj && obj.x) curleft += obj.x;
        return curleft;
    },

    findPosY : function(obj) {
        var curtop = 0;
        if (obj && obj.offsetParent) {
            while (obj.offsetParent) {
                curtop += obj.offsetTop;
                obj = obj.offsetParent;
            }
        } else if (obj && obj.y) curtop += obj.y;
        return curtop;
    },
    back:function(){
        var total_num = this.formatInt($("#user_num").val())+this.formatInt($("#children_num").val());
        $("#visitor_info").val('');
        for(var i=0;i<total_num;i++){
            this.set_visitor(i+1);
        }
        this.setTouristInfo();
        var step = $("#last_step").val();
        $("#frm_submit").attr("action","/main.php?do="+step);
        $("#frm_submit").submit();
    },

    formatInt : function(num){
        num = parseInt(num,10);
        num = isNaN(num)?0:num;
        return num;
    },

    setTouristInfo : function (){
        var tourist_name = $("#tourist_name").val();
        var tourist_tel  = $("#tourist_tel").val();
        var tourist_phone1 = $("#tourist_phone1").val();
        var tourist_phone2 = $("#tourist_phone2").val();
        var tourist_email = $("#tourist_email").val();
        var tourist_info = tourist_name+","+tourist_tel+","+tourist_phone1+","+tourist_phone2+","+tourist_email;
        $("#tourist_info").val(tourist_info);
    },
    show_visitor : function (j){
        if($("#show_tmp_"+j).html()!=''){
            $("#show_tmp_"+j).show();
        }
        if(this.visitor_str!=''){
            this.pushShow(j,this.visitor_str);
            return;
        }
        $.ajax({
            url: "/main.php?do=get_order_ajax&flag=get_tourist_template",
            cache: true,
            dataType:'json',
            success: function(data){			   
                tourist_add.visitor_str=data;
                tourist_add.pushShow(j,data);	 		
            }
        });
    },
    pushShow : function (j,data){
        var str = "";
        leng = data.length;	
        for(var i=0;i<leng;i++){
            str +="<div onmouseover=\"this.style.background='#E2EAFF';\" onmouseout=\"this.style.background='#fff';\" onclick=\"tourist_add.pull("+i+","+j+")\">"+data[i].name+"</div>";	
        }
        str+="<iframe style=\"position:absolute;visibility:inherit;top:0;left:0;width:100%;height:100px;z-index:-1;scrolling=\"no\"  \" frameborder=\"0\"></iframe>";
        $("#show_tmp_"+j).html(str);
        this.hideShow(j);
        $("#show_tmp_"+j).show();
    },
    pull : function (i,j){
        data = this.visitor_str;
        $("#show_tmp_"+j).hide();
        // 赋值
        $("#name_"+j).val(data[i].name);
        $("#paper_type_"+j).val(data[i].paper_type);	
        $("#paper_num_"+j).val(data[i].paper_num);
        $("#tel_"+j).val(data[i].tel);
        // 身份证
        if(data[i].paper_type!=1){
            $("#sex_"+j).val(data[i].sex==0?2:1);
            brithday = data[i].birthday;
            year = brithday.substring(0,4);
            month = brithday.substring(5,7);
            day = brithday.substring(8,10);		
            $("#year_"+j).val(year);
            this.change_calendar(j,'year','birth');	
            $("#month_"+j).val(month);
            this.change_calendar(j,'month','birth');
            $("#day_"+j).val(day);
        }
		
		this.change_paper(j);
        $("#name_tip_"+j).html('');
    },
    visitor_str : '',
    show_flag:0,
    hideShow:function(j){
        user_num = $("#user_num").val();
        children_num = $("#children_num").val();
        total_num = this.formatInt(user_num)+this.formatInt(children_num);
        for(var i=1;i<=total_num;i++){
            if(i!=j){
                $("#show_tmp_"+i).hide();
            }
        }
    }
}

window.onclick = function(){
    if(tourist_add.show_flag!=1){
        tourist_add.hideShow();
    }
}

Date.prototype.dateDiff = function(interval,objDate){
    var d=this, t=d.getTime(), t2=objDate.getTime(), i={};
    i["y"]=objDate.getFullYear()-d.getFullYear();
    i["q"]=i["y"]*4+Math.floor(objDate.getMonth()/4)-Math.floor(d.getMonth()/4);
    i["m"]=i["y"]*12+objDate.getMonth()-d.getMonth();
    i["ms"]=objDate.getTime()-d.getTime();
    i["w"]=Math.floor((t2+345600000)/(604800000))-Math.floor((t+345600000)/(604800000));
    i["d"]=Math.floor(t2/86400000)-Math.floor(t/86400000);
    i["h"]=Math.floor(t2/3600000)-Math.floor(t/3600000);
    i["n"]=Math.floor(t2/60000)-Math.floor(t/60000);
    i["s"]=Math.floor(t2/1000)-Math.floor(t/1000);
    return i[interval];
};
Date.prototype.dateAdd = function(interval,number) { 
    var d = this; 
    var k={
        'y':'FullYear', 
        'q':'Month', 
        'm':'Month', 
        'w':'Date', 
        'd':'Date', 
        'h':'Hours', 
        'n':'Minutes', 
        's':'Seconds', 
        'ms':'MilliSeconds'
    }; 
    var n={
        'q':3, 
        'w':7
    }; 
    eval('d.set'+k[interval]+'(d.get'+k[interval]+'()+'+((n[interval]||1)*number)+')'); 
    return d; 
}; 

