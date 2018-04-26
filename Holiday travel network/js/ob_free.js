$(document).ready(function(){

	var $scroll_nav_top = $('#scroll_nav').offset();
	var offset=50;
	var row_1=0,row_2=0,row_3=0,row_4=0,row_5=0,row_6=0,row_7=0,row_8=0,row_9=0;
	function scrollLocation () {
		row_1 = $('#row_1').offset()?$('#row_1').offset().top-offset:0;
		row_2 = $('#row_2').offset()?$('#row_2').offset().top-offset:0;
		row_3 = $('#row_3').offset()?$('#row_3').offset().top-offset:0;
		row_4 = $('#row_4').offset()?$('#row_4').offset().top-offset:0;
		row_5 = $('#row_5').offset()?$('#row_5').offset().top-offset:0;
		row_6 = $('#row_6').offset()?$('#row_6').offset().top-offset:0;
		row_7 = $('#row_7').offset()?$('#row_7').offset().top-offset:0;
		row_8 = $('#row_8').offset()?$('#row_8').offset().top-offset:0;
		row_9 = $('#row_9').offset()?$('#row_9').offset().top-offset:0;
	}
	var li = $("#scroll_nav li");
	var $scroll_nav = $('#scroll_nav');
	var $scroll_nav_top = $scroll_nav.offset().top;
	var status = -1;
	$(window).on('selectTp load',function(){
		scrollLocation ();
	}).resize(function() {
		scrollLocation ();
	}).scroll(function(){//监听滚动条
		//return;
		var $scrollTop = $(this).scrollTop();
		if($scrollTop>$scroll_nav_top){
			if(!$scroll_nav.hasClass("scroll_nav")){
				if($.browser.msie && $.browser.version=="6.0"){
					$scroll_nav.css({position:"absolute",top:$scrollTop-140,left:$scroll_nav.position().left})
				}
				$scroll_nav.addClass('scroll_nav');
			}
		}else{
			if($scroll_nav.hasClass("scroll_nav")){
				if($.browser.msie && $.browser.version=="6.0"){
					$scroll_nav.css({position:"static"});
				}
				$scroll_nav.removeClass('scroll_nav');
			}
		}
		if(row_9>0&&$scrollTop >= row_9) {
			if(status!=9){
				li.filter(".scroll_nav_current").removeClass("scroll_nav_current");
				li.filter('.row_9').addClass('scroll_nav_current');
				status = 9;
			}
		}
		else if(row_8>0&&$scrollTop >= row_8) {
			if(status!=8){
				li.filter(".scroll_nav_current").removeClass("scroll_nav_current");
				li.filter('.row_8').addClass('scroll_nav_current');
				status = 8;
			}
		}
		else  if(row_7>0&&$scrollTop >= row_7) {
			if(status!=7){
				li.filter(".scroll_nav_current").removeClass("scroll_nav_current");
				li.filter('.row_7').addClass('scroll_nav_current');
				status = 7;
			}
		}
		else  if(row_6>0&&$scrollTop >= row_6) {
			if(status!=6){
				li.filter(".scroll_nav_current").removeClass("scroll_nav_current");
				li.filter('.row_6').addClass('scroll_nav_current');
				status = 6;
			}
		}
		else  if(row_5>0&&$scrollTop >= row_5) {
			if(status!=5){
				li.filter(".scroll_nav_current").removeClass("scroll_nav_current");
				li.filter('.row_5').addClass('scroll_nav_current');
				status = 5;
			}
		}
		else  if(row_4>0&&$scrollTop >= row_4) {
			if(status!=4){
				li.filter(".scroll_nav_current").removeClass("scroll_nav_current");
				li.filter('.row_4').addClass('scroll_nav_current');
				status = 4;
			}
		}
		else  if(row_3>0&&$scrollTop >= row_3) {
			if(status!=3){
				li.filter(".scroll_nav_current").removeClass("scroll_nav_current");
				li.filter('.row_3').addClass('scroll_nav_current');
				status = 3;
			}
		}
		else  if(row_2>0&&$scrollTop >= row_2) {
			if(status!=2){
				li.filter(".scroll_nav_current").removeClass("scroll_nav_current");
				li.filter('.row_2').addClass('scroll_nav_current');
				status = 2;
			}
		}
		else if(row_1>0&&$scrollTop >= row_1) {
			if(status!=1){
				li.filter(".scroll_nav_current").removeClass("scroll_nav_current");
				li.filter('.row_1').addClass('scroll_nav_current');
				status = 1;
			}
		}
	});
	$('.scroll_nav_ul li').removeClass('scroll_nav_current')
	.first().addClass('scroll_nav_current').end()
	.live('click',function(event){
		//$(this).off('click');
		var $scroll_nav_ul_li = $('.scroll_nav_ul li');
		var li_id = $(this).attr("class");
		var $li = $('#'+li_id);
		if($li.length){
			    $('html, body').stop(true).animate({
				scrollTop:$li.offset().top
			}
			,1000);
		}
		                
		event.stopPropagation();
		        });
});



	
