
;
/**
 * 刮刮卡js构造函数插件
 * @param config.target <Object> 原生的DOM选择器，约定传入目标图片元素
 * @param config.txt <String> 刮刮卡的文字
 * @param config.condition <Number> 数字类型，约定刮到多少百分比的时候触发回调函数
 * @param config.callback <Function> 回调函数
 * 
 * @author xudihui
 * @date 2015.07.01 
 */

  window.TUY = window.TUY || {};
  
  TUY.Canvas_blow  = function(config){
	   this.target = config.target;  //选择器，约定传入原生DOM对象
	   this.txt = config.txt;  //选择器，约定传入原生DOM对象
	   this.condition = config.condition; //刮到多少的时候触发回调函数 默认是一半的时候
	   this.callback = config.callback; //回调函数
	   this.run();
  };
  
  TUY.Canvas_blow.prototype = {
		// 启动
		run : function () {
			// 生成dom元素
			this.initDom ();
			// 绑定事件
			this.initEvents ();
		},
		
		//初始化DOM 最好确保只执行一次
		initDom : function () {
			this.cvs = document.createElement('canvas');
			var img = this.target;
			var cvs = this.cvs;
			var txt = this.txt; 
			var that = this;
			if(img.complete || img.readyState == 'loading' || img.readyState == 'complete'){
				setCanvas();
			}
			else{
				img.onload=setCanvas;
			}
		    function setCanvas(){
				cvs.style.position='absolute';
				cvs.style.left=img.offsetLeft+'px';
				cvs.style.top=img.offsetTop+'px';
				cvs.width=img.width;
				cvs.height=img.height;
				img.parentNode.insertBefore(cvs,img);
                that.initCanvas()
			}

        },
		
		//初始化事件
		initEvents: function () {
		    var cvs = this.cvs;
			var context = cvs.getContext('2d');
			var that = this;
            var offsetParent=cvs,offsetLeft=0,offsetTop=0;
			/*
            while(offsetParent){
                offsetLeft+=offsetParent.offsetLeft;
                offsetTop+=offsetParent.offsetTop;
                offsetParent=offsetParent.offsetParent;
            }
			*/
            var x,y;
            var start='mousedown',move='mousemove',end='mouseup';
            if(document.createTouch){
                start="touchstart";
                move="touchmove";
                end="touchend";
            }
            cvs.addEventListener(start,onTouchStart);
            
            
            function onTouchStart(e){
                e.preventDefault();
                if(e.changedTouches){
                    e=e.changedTouches[e.changedTouches.length-1];
                }
                x=e.pageX - offsetLeft;
                y=e.pageY - offsetTop;
                context.beginPath();
				context.fillStyle="red";
               // context.fillRect(150,20,75,50);
                context.arc(x, y, 35/2, 0, Math.PI*2, true);
                context.closePath();
                context.fill();
				document.addEventListener(end,onTouchEnd);
                cvs.addEventListener(move,onTouch)

            }

            function onTouch(e){
                if(e.changedTouches){
                    e=e.changedTouches[e.changedTouches.length-1];
                }
				console.log(e.pageX+'@@'+e.pageY);
                context.beginPath();
                context.moveTo(x, y);
                context.lineTo(e.pageX - offsetLeft, e.pageY- offsetTop);
                x=e.pageX - offsetLeft;y=e.pageY - offsetTop;
                context.closePath();
                context.stroke();
                var n=(Math.random()*10000000)|0;
                context.canvas.style.color='#'+ n.toString(16);//fix android 4.2 bug force repaint

            }

            function onTouchEnd(){
                cvs.removeEventListener(move,onTouch);
                onEnd();
            }
			
            function onEnd(){
                var st=+new Date();
                data=context.getImageData(0,0,cvs.width,cvs.height).data;
                var length=data.length,k=0;
                for(var i=0;i<length-3;i+=4){
                    if(data[i]==0&&data[i+1]==0&&data[i+2]==0&&data[i+3]==0){
                        k++;
                    }
                }
                var f=k*100/(cvs.width*cvs.height);
				that.tempFn = that.callback;
                if(f>(that.condition||50)){
									if( that.tempFn){
										that.tempFn.call();
										that.tempFn = null; //调用一次之后把函数引用置为null,避免重复触发
									}				
                }
                var t=+new Date()-st;
                console.log('您刮开了区域:'+f.toFixed(2)+'% 用了'+ t+'ms ');
                data=null;
            }
		},

		//预设画布
		initCanvas: function(){ 
				var cvs = this.cvs;
			    var txt = this.txt; 
				var context = cvs.getContext('2d');
                this.clearCanvas();
				this.tempFn = this.callback;
				context.globalCompositeOperation = 'source-over';
				context.fillStyle="#000000"; 
                context.font="30px 微软雅黑";
				context.textAlign="center"; 
				context.fillText(txt,cvs.width/2,cvs.height/2);
				context.globalCompositeOperation = 'destination-over';			
				context.fillStyle='#9f9d9e';
				context.fillRect(0, 0, cvs.width, cvs.height);
				context.globalCompositeOperation = 'destination-out'; //整个插件最最关键的就是这一步了，类似于ps里面的蒙版功能，即我们在画布上画出来的图案都会让下面的image透出来
				context.lineJoin = "round";
				context.lineWidth = 15;
	
		},
		
		//清空画布
		clearCanvas: function(){
                this.cvs.getContext('2d').clearRect(0, 0, this.cvs.width, this.cvs.height); 
		}		
		
  } 

   