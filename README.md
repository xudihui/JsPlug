#JsPlug
个人实现的一些js控件
主要沉淀抽离了一些工作中封装的基础控件，单个js控件代码都在500行以内，有基于jQ框架的$.fn.extend封装；也有基于构造函数的封装。


##buttonbar <更多按钮控件>
 - 参数： config.panel <Object> 选择器，约定传入原生菜单容器DOM对象、jQuery对象、jQuery字符串选择器
 - 实例方法：appendButton(添加按钮)、resetButton(重置所有按钮) 
 - 详情：当存在顶部定高菜单栏场景下，按钮菜单非常多，由于不同屏幕宽度，需要对按钮进行排列整理，它的主要作用是把屏幕宽度放不下的按钮，塞到末尾的更多按钮里面去，通过点击更多展开隐藏于内部的按钮。

##canvas_blow <画布模拟刮刮卡控件>
 - 参数1： config.target <Object> 原生的DOM选择器，约定传入目标图片元素
 - 参数2： config.txt <String> 刮刮卡的文字
 - 参数3： config.condition <Number> 数字类型，约定刮到多少百分比的时候触发回调函数
 - 参数4： config.callback <Function> 回调函数
 - 实例方法：initCanvas(重新刮)、clearCanvas(全部刮开)
 - 详情：使用DOM两层结构模拟刮刮卡效果，配合画布的globalCompositeOperation = 'destination-out'实现伪蒙版的的刮卡功能。

##iSelect <下拉框控件>
 - 参数： 无  
 - 方法：addOption(增加option选项)、delOption(删除option选项)、setValue(设置值)、disabledSelect(禁用下拉框)、unDisabledSelect(取消禁用下拉框)  
 - 详情：jQ框架的$.fn.extend进行封装，方法名为iSelect.封装此控件的主要原因是select的表现形式太过单一，不好控制样式，并且在IE6下，浏览器将select元素视为窗口级元素，这时div或者其它的普通元素无论z-index设置的多高都是无法遮住select元素的。控件主要通过隐藏原生select然后把select里面的option拿出来重新通过div跟ul进行组织呈现，并模拟原生select的交互效果，这样一来也就实现了低版本z轴无效的问题，并且在select下拉框的区域放置了一个等大的iframe，当IE下面有窗口级的active控件存在时，也能通过iframe成功覆盖在控件上方。
