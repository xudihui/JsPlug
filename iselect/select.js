
;
/**
 * 下拉框控件
 * @param 无
 * @author xudihui
 * @date 2015.07.01 
 */

(function($){
    var isIE = navigator.userAgent.indexOf("MSIE") != -1;//判断是否是IE11以下浏览器，因为IE11已经没有MSIE这个字符串在里面了
    var isIE6 = isIE&&!window.XMLHttpRequest;
	var isIE7 = isIE&&navigator.appVersion.match(/7./i) == "7.";  //判断IE版本，在IE低版本中要进行特殊交互
    $.fn.extend({
        iSelect: function (config){ //参数预留
        	config = $.extend({     		
    		}, config || {});
            return this.each(function(index){
                var _this = this, o = $(this);
                if (o.attr("created")) 
                    return;
                o.attr("created", true);               
                o.hide();
                var selectId = ((this.name || this.id) + '_TUY_Select' + index || '_TUY_Select' + index);
                selectId = selectId.replace(/\./g,"_");
			    var container = $('<div id="' + selectId + '" class="dropdown' + ( o.prop("disabled") ? " disabled_select" : '' )  + '" ></div>');
                o.wrap(container);
                if(_this.selectedIndex>=0){
                	var text = _this.options[_this.selectedIndex].text;
                }else{
                	var text = "";
                }
                var sel = $('<div class="dropselectbox" id="'+selectId+'"></div>');
                var h4 = $('<h4 title="' + text + '">' + text + '</h4>');
                h4.attr('reset',o.attr('reset'));
                sel.append(h4);
                o.after(sel);
                var ul = $("#ul" + selectId);
                var iframe = $("<iframe class='select-iframe' style='max-height:115px;'></iframe>");
                if (o.prop("disabled")) {
                    h4.addClass("disabled");
                    //return;  不能直接return，要让事件继续绑定上去。
                }
                h4.bind("click.mSelect", function(evt){  //click.mSelect是click的一个命名空间，到时候也可以卸载click.mSelect这个单独的点击事件。
                	if($(this).hasClass("disabled")) {
                		return false;
                	}
                    if (evt) {
                        evt.stopPropagation();
                    }
                    else {
                        window.event.cancelBubble = true;
                    }

                    if (ul.length > 0) {
                        if (ul.css("display") == "none") {
                            $("body").trigger("click.select");
                        	ul.show();
                        	iframe.height(ul.outerHeight());
							iframe.width(ul.outerWidth());
                        	iframe.show();
                  
                            	ul.css({
                            		"left" : sel.offset().left, //+ 9,
                            		"top" : sel.offset().top + 27 //+ (isIE7 ? 75 : 77)
                            	});
                            	iframe.css({
                            		"left" : sel.offset().left, 
                            		"top" : sel.offset().top + 27
                            	});
                          
							var minWidth = h4[0].offsetWidth - 2; // 4为ul的padding + borde所占宽度
							if(ul.width() < minWidth || isIE6){
								
									ul.width(minWidth);
									iframe.width(minWidth + 4);
							
							}else if(isIE7){
								$('li',ul).width(ul.width()-20); // 20为li的padding right
							}else if( (ul.offset().left + ul.width()) > $('body').width()){
								ul.width($('body').width()-ul.offset().left);
								iframe.width($('body').width()-ul.offset().left + 8);
							}
							h4.parent().addClass("hover");
                        }
                        else {
                            $("body").trigger("click.select");
                        }
                    }
                    else {
                        $("body").trigger("click.select");
                       
                        	ul = $('<ul style="max-height:110px;" id="ul' + selectId + '"' + ' class="edit-select-box"' + '></ul>');
                        	$("body").append(ul);
                        	$("body").append(iframe);
							var positionObj = { //定位对象
                        		"left" : sel.offset().left, 
                        		"top" : sel.offset().top + 27 
                        	}
							ul.css(positionObj);
							iframe.css(positionObj);
							var li = '';
                        for (var i = 0; i < _this.options.length; i++) {//拼接选项字符串
						    var value = $('option',o).eq(i).attr('value'); //必须给select设置value，通过value去给li设置value_属性,尝试过给li使用value属性，但是通过$去获取li的value时始终为0，所以使用value_属性。
                            li += '<li index="' +
                            i + '" value_="'+ value +
                            '">' +
                            _this.options[i].text +
                            '</li>';
                        }
                        ul.html(li);
						
						//统一把事件模式更改为事件代理，绑定未来元素。
						ul.delegate('li','mouseover',function(e){
							$(this).addClass("over");
						});		
							
						ul.delegate('li','mouseout',function(e){
							$(this).removeClass("over");						
						});							

						ul.delegate('li','click',function(e){
                            if (e) { //防止冒泡
								e.stopPropagation();
							}
							else {   //防止冒泡
								window.event.cancelBubble = true;
							}
							h4.parent().removeClass("hover");
							ul.hide();
							iframe.hide();
							//当且仅当 li的属性value_跟上一次选中的select的option的value不一致时，才会触发trigger；假如value跟value_属性一致，那么即使他们的文本不一致，也不会触发change事件，以属性value为准，字面量无效。
							if(o.find('option:selected').attr('value') != $(this).attr('value_')){ 
								_this.options[$(this).attr("index")].selected = true;
								o.trigger("change");
								h4.text($(this).text()).attr('title',$(this).text());
							}						
						});
                        ul.show(); 
                        iframe.height(ul.outerHeight());
                        iframe.width(ul.outerWidth());
                        iframe.show();
						var minWidth = h4[0].offsetWidth - 2; // 4为ul的padding + borde所占宽度
						if(ul.width() < minWidth || isIE6){
							
								ul.width(minWidth);
								iframe.width(minWidth + 4);
							
						}else if(isIE7){
							$('li',ul).width(ul.width()-20); // 20为li的padding right
						}else if( (ul.offset().left + ul.width()) > $('body').width()){
							ul.width($('body').width()-ul.offset().left);
						}
                        if(isIE6 && ul.height() > 180){
                        	
	                        	ul.height(180);
	                        	iframe.height(182);
                        	
                        }  

                        $("body").bind("click.select", function(e){
                            ul.hide();
                            iframe.hide();
                            if(h4.parent().hasClass("hover")){
                            	h4.parent().removeClass("hover")
                            }
                        });
                    }
                });
				 $(window).resize(function(){ul.hide();iframe.hide();});
            });
        },
		
        //给非源生的select框动态赋值
        addOption: function(text,value,index){
			var _this = this[0];
			var o = $(this);
            var y = document.createElement('option');
            function addOpt(){
				y.text = text;
				y.value = value;
				if(index == null || index == undefined || index == ''){
					try{
						_this.add(y,null); // standards compliant
					}catch(ex){
						_this.add(y); // IE only
					}
				} else if(index >= 0){
					var sel=_this.options[index]; 
					_this.add(y,sel);
				} 
            }
            var selectId = ((_this.name || _this.id) + '_TUY_Select'|| '_TUY_Select');
            selectId = selectId.replace(/\./g,"_");
			var h4 = $('div.dropselectbox[id^="'+selectId+'"] h4');
			var ul = $('ul[id^="ul'+selectId+'"]:last');
			if(ul != null || ul != undefined || ul != ''){
                addOpt();
				var li = $('<li value_="' + value + '">' + text + '</li>');
				if(index == null || index == undefined || index == ''){
					ul.append(li);
				}else{
					$('li[expand!=true]:eq('+ index +')',ul).before( li );
				}	
				$('li[expand!=true]',ul).each( function( index ){
					this.setAttribute( 'index', index );
				})	
			}
        },
		
        //动态删除非源生的select框的值
		removeOption: function(n){
        	var _this = this[0];
			var len = _this.options.length;
			var selectId = ((_this.name || _this.id) + '_TUY_Select'|| '_TUY_Select');
            selectId = selectId.replace(/\./g,"_");
			var h4 = $('div.dropselectbox[id^="'+selectId+'"] h4');
			var ul = $('ul[id^="ul'+selectId+'"]:last');
			if(n === null || n === undefined || parseInt(n,10)===undefined){
				//删除所有option
				if (len > 0){
					for(var i=0;i<len;i++){
						_this.remove(0);
						$('li[expand!=true]:eq('+ 0 +')',ul).remove();
					}				
				}
				h4.text('');
			}else{
				var n = parseInt(n,10);
				if(_this.selectedIndex == n){
					h4.text('');
				}
				_this.remove(n);
				$('li[expand!=true]:eq('+ n +')',ul).remove();
			}
			ul.next('iframe').height(ul.height() + 2);
        },
		
        //根据value值删除option
        delOption:function(val){
        	$(this).removeOption($("option[value='"+ val +"']",this).index());
        },
		
        //删除全部option
        delAllOption:function(){  
        	var _this = this[0];
			var selectId = ((_this.name || _this.id) + '_TUY_Select'|| '_TUY_Select');
            selectId = selectId.replace(/\./g,"_");
			var h4 = $('div.dropselectbox[id^="'+selectId+'"] h4');
			var ul = $('ul[id^="ul'+selectId+'"]:last');
        	while($(this).find('option').length>0){
        		$(this).removeOption(0)
        	}
        	return this;
        },
		
        //给select动态赋值
        setValue: function(value){
        	var _this = this[0];
			var selectId = ((_this.name || _this.id) + '_TUY_Select'|| '_TUY_Select');
            selectId = selectId.replace(/\./g,"_");
			var h4 = $('div.dropselectbox[id^="'+selectId+'"] h4');
			var options = _this.options;
			var len = options.length;
			var existFlag = false;
			for(var i=0;i<len;i++){
				var v = $(options[i]).attr("value");
				if( v === value){
					existFlag = true;
					var text = $(options[i]).text();
					options[i].selected = true;
					break;
				}
			}
			if(!existFlag) {
				h4.text("");
			}else{
				h4.text(text);
			}
        },
		
        //禁用下拉框
        disabledSelect : function() {
        	 var selectId = ((this[0].name || this[0].id) + '_TUY_Select'|| '_TUY_Select').replace(/\./g,"_");
        	 $('div.dropselectbox[id^="'+selectId+'"] h4').addClass("disabled");
        	 $('div.dropselectbox[id^="'+selectId+'"]').addClass("disabled_select");
        },
        
		//重新激活下拉框
        unDisabledSelect : function() {
    		var selectId = ((this[0].name || this[0].id) + '_TUY_Select'|| '_TUY_Select').replace(/\./g,"_");
    		$('div.dropselectbox[id^="'+selectId+'"] h4').removeClass("disabled");
    		$('div.dropselectbox[id^="'+selectId+'"]').parent().removeClass("disabled_select");
			$('div.dropselectbox[id^="'+selectId+'"]').removeClass("disabled_select");
			
        },
        
        keyDown: function(sID, selectIndex){
            var $obj = $('*[id="' + sID + '"] select');
            $obj[0].selectedIndex = selectIndex;
            $obj.change();
            $('*[id="' + sID + '"] li:eq(' + selectIndex + ')').toggleClass("over");
            $('*[id="' + sID + '"] h4').html($('*[id="' + sID + '"] option:selected').text());
        }
    });

})(jQuery);

