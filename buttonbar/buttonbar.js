
;
/**
 * 编辑页面顶部按钮，当功能按钮很多的时候，隐藏一些按钮，通过更多按钮的下拉框存放溢出按钮
 * @param config.panel <Object> 选择器，约定传入原生DOM对象、jQuery对象、jQuery字符串选择器
 * @author xudihui
 * @date 2014.10.08 
 */

 
(function ($) {

  window.TUY = window.TUY || {};
  
  TUY.ButtonBar = function(config){
	   this.config = config;
	   this.panel = $(config.panel);  //选择器，约定传入原生DOM对象、jQuery对象、jQuery字符串选择器
       this.getData();
	   this.run();
  };
  
  TUY.ButtonBar.prototype = {
		// 启动
		run : function () {
			// 生成dom元素
			this.initDom ();
			// 绑定事件
			this.initEvents ();
		},
		
		//初始化DOM 最好确保只执行一次
		initDom : function () {
		   this.maxwidth = $(window).width()-120 -this.leftWidth;   //leftWidth 新增左侧业务中心的宽度判断
		   this.moreList = $( '<ul style="display:none"></ul>');
		   this.moreBtn = $('<div class="editmore"><span class="editmore_ico"></span>更多</div>'); //为更多按钮增加图标
		   this.panel.append( this.moreBtn.append(  this.moreList ) );		   
		   this.resetButton(this.maxwidth);
        },
		
		//初始化事件
		initEvents: function () {
		    var self = this;
			var resizeTimer = null;
			//缩放窗口
			$(window).bind('resize', function () {
				if (resizeTimer) {
				 clearTimeout(resizeTimer)
				}
				 resizeTimer = setTimeout(function(){
				 self.doExchange(); 
                 $('#edit_side_btn').length>0 ? self.leftWidth = parseInt($('#edit_side_btn').css('left')) : self.leftWidth = 0;  
		         self.maxwidth = $(window).width()-120-self.leftWidth;		//重置最大宽度		 
                 if($('iframe',".edit-head").length > 0){
                     $(".edit-head iframe").remove();
                     self.moreList.slideUp(0);
                     self.moreBtn.removeClass('editmore_shadow');
                 }			
				}, 200);
			  }
			);
			
			//更多下拉
			this.moreBtn.bind('click',function(e){
				e.stopPropagation();
				$('.edit-menubar').attr('style','position: relative; z-index: 400');
				var height = 0;
				var left = $('.editmore','.edit-menubar').offset().left;
				self.moreList.css('display')=='none' ? self.moreBtn.addClass('editmore_shadow') : self.moreBtn.removeClass('editmore_shadow') ;  //根据UI的效果图，修改ui状态
				self.moreList.slideToggle(100,function(){
		        height = $('.editmore ul').height();
				if($.browser.msie){  //在IE下面当使用object控件的时候，object控件是窗口级别元素，只能通过iframe才能把更多菜单覆盖在其上面。
				  if($('iframe',".edit-head").length == 0){
			     	$(".edit-head").eq(0).append($('<iframe frameborder="0"  scrolling="no"  style="top: 38px; width: 90px;display: block; position: absolute; z-index: 399; opacity: 0;left:'+ left +'px;height:'+ height + 'px">'))	  
				  }
				  else{
				    $(".edit-head iframe").remove();
				  }
				}
				});
			});
			
			$( document.body ).click( function(){
				self.moreList.slideUp();
				if(self.moreBtn.hasClass('editmore_shadow')){  //根据UI的效果图，修改ui状态
				  self.moreBtn.removeClass('editmore_shadow') 
				}
                if($('iframe',".edit-head").length > 0){
                    $(".edit-head iframe").remove();
                }
			})
		},
		
		//插入按钮,目前仅支持逐个添加
		appendButton : function (config) { //{position:'13',name:'研发中心',icon:'save','event':{'click':function(){alert(11)} }}
			var position = config.position; //插入按钮的位置，比如是3，那么就是第4个，从0开始计算，即从原先的第3跟第4之间插入按钮
			var newButton = $('<a class="cui-btn-new" ><span class="' +config.icon+ '"></span><span>' +config.name+'</span></a>');
			for(var i in config.event){
			 (function( func ){      
				newButton.bind(i,function(){
					func();
				})			 
			 })( config.event[i]) 
			}
			var btn = this.getOldWidth();
			var oldWidth = btn.oldWidth; //获取操作前的按钮总宽度
		    var n=0;
			while(oldWidth<this.totalwidth){   //ul里面的元素全部释放出来  
				 n++;
				 oldWidth +=this.origin_array[btn.oldLength+n];
				 this.exchangeEl('pop')
			}
			if(position != undefined && position >= 0 && position < this.totleNum){
			    this.panel.children('.cui-btn-new').eq(position).before(newButton); //刷新所有a按钮，然后插入新按钮,
			}else{	
				this.panel.append(newButton); //刷新所有a按钮，然后插入新按钮,
			}
			this.getData();
			this.resetButton(this.maxwidth);			  
		},
		
		//更新获取 dom节点的一些基本参数
		getData:function(){
           this.leftWidth = 0;
		   $('#edit_side_btn').length>0 ? this.leftWidth = parseInt($('#edit_side_btn').css('left')) : this.leftWidth = 0;			  
		   this.button = this.panel.children('.cui-btn-new'); 
		   this.maxwidth = $(window).width()-120-this.leftWidth;
		   this.origin_array = []; //存放原始按钮的每个长度
		   this.totleNum = this.button.length;
		   this.totalwidth = 0;
		   for(var i = 0;i<this.totleNum;i++){
			   var btn_width = this.button.eq(i).outerWidth(); 
			   this.totalwidth += btn_width;
			   this.origin_array.push(btn_width);
		   }		
		
		},
		
		//元素切换
		exchangeEl:function(state){
			 // 外层的a标签移植到UL里面
			
			 if(state=='push'){
			    var oldWidth = this.getOldWidth().oldWidth; //获取操作前的按钮总宽度
				this.moreBtn.show();			
				this.moreList.prepend( $('<li></li>').append( this.panel.children('.cui-btn-new').last() )  )		
				
			 }
			 //UL里面的a标签释放到外层div
			 else if(state=='pop'){
			   var firstLi = this.moreList.children('li').first(); //首个li
			   this.panel.append(firstLi.children('a.cui-btn-new'));
			   firstLi.remove();
			   if( this.moreList.children('li').length ==0 ){
				 this.moreBtn.hide();
				 this.moreList.hide();
			   }
			 }		
		},
		
		//获取操作前的按钮总宽度
		getOldWidth:function(){
				 var oldWidth = 0;
				 var oldLength = this.panel.children('.cui-btn-new').length;
				 for(var i =0;i<oldLength;i++){
				     oldWidth +=this.origin_array[i]
				 }	
                 return{
				 oldWidth:oldWidth,
				 oldLength:oldLength
				 } 	 
		},
		
		//执行元素切换
		doExchange:function(){
    			 
				 var btn = this.getOldWidth();
	             var oldWidth = btn.oldWidth; //获取操作前的按钮总宽度
				 var oldLength = btn.oldLength //获取操作前的按钮总个数
				 var curWidth = $(window).width()-120-this.leftWidth;
				 if(this.maxwidth>curWidth){
					 var m =0;
					 while(oldWidth>curWidth){     
						 m++;
						 oldWidth -=this.origin_array[oldLength-m];
						 this.exchangeEl('push')
					 }
					
				 }
				 else if(this.maxwidth<curWidth){
					 var n=0;
					 while(oldWidth<curWidth){     
						 n++;
						 oldWidth +=this.origin_array[oldLength+n];
						 this.exchangeEl('pop')
					 }
				 }
		},
		
		//按钮重新排版
		resetButton : function(width){
		    //重置最大宽度
		   if(this.totalwidth<=width){ 
			   this.moreBtn.hide();                                                                                                                                                             //本来用more.css('display','none'),但是resize之后more就变成undefined了，此more非彼more
			   return;
			   }
		   else{
			   this.moreBtn.show();
			   var origin_totalwidth = this.totalwidth;
               var btn = this.getOldWidth();
	           var oldWidth = btn.oldWidth; //获取操作前的按钮总宽度
			   var oldLength = btn.oldLength //获取操作前的按钮总个数
			   var m =0;
			   while(oldWidth>width){     
			     m++;
				 oldWidth -=this.origin_array[oldLength-m];
				 this.exchangeEl('push')
				}
			  }     		
		}
  } 

})(jQuery, window);	






