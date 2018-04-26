// JavaScript Document
 //滚动导航
  $(function(){
	  var fobj = $('.pkg-detail-tab').eq(0);
	  var fpos = fobj.offset();
	  //$('#total_pirce').html(fpos.top);
	  $(window).scroll(function(){checkPos(fobj,fpos);});
  });
  
  function checkPos(fobj,fpos)
  {
	  if ( $.browser.msie && $.browser.version=='6.0' )
	  {
		  var scTop = $(window).scrollTop();
		  scTop > fpos.top ? fobj.css({'position':'absolute','z-index':3,'top':scTop-fpos.top}) : fobj.attr('style','');
	  }
	  else
	  {
		  ($(window).scrollTop()>fpos.top) ? fobj.css({'position':'fixed','z-index':3,'top':0}) : fobj.css({'position':'static'});
	  }
  }
  
  
  $(function(){
	  var tab_a = $('.pkg-detail-tab-bd a');
	  tab_a.click(function(){
		  $(this).addClass('current').siblings().removeClass('current');
	  });
	 $(window).scroll(function(){
		  var Scroll_tab = $('.pkg-detail-tab-bd').offset().top;//滚动切换
		  $('.pkg-detail-infor').each(function(i,n){
				  var tab_infor = $(n).offset().top;
				  if( tab_infor >0 && Scroll_tab>=tab_infor ){
					  $('.pkg-detail-tab-bd a').eq(i).addClass('current').siblings().removeClass('current');
				  }	
		  });	  
	 });
  });