﻿(function(platform) {
    function MyUtils(){
        this.author='Qingyu Wei';
        this.description='一些常用函数的集合，默认绑定在window对象上,即window.myUtils;\n可以通过改变插件传入的“platform”参数指定其别名或绑定对象'
    }

    if(typeof platform==='string'){
        window[platform]=new MyUtils();
    }else if(typeof platform==='object'){
        platform.myUtils=new MyUtils();
    }else{
        window.myUtils=new MyUtils();
    }
    /**
     * @description 事件绑定，兼容各浏览器
     * @param target 事件触发对象
     * @param type 事件
     * @param func 事件处理函数
     */
    MyUtils.prototype.addEvent=function(target, type, func) {
        if (target.addEventListener) //非ie 和ie9
            target.addEventListener(type, func, false);
        else if (target.attachEvent) //ie6到ie8
            target.attachEvent("on" + type, func);
        else target["on" + type] = func; //ie5
    };
    /**
     * @description 事件移除，兼容各浏览器
     * @param target 事件触发对象
     * @param type 事件
     * @param func 事件处理函数
     */
    MyUtils.prototype.removeEvent=function(target, type, func){
        if (target.removeEventListener)
            target.removeEventListener(type, func, false);
        else if (target.detachEvent)
            target.detachEvent("on" + type, func);
        else target["on" + type] = null;
    };

    /*通过id取dom*/
    MyUtils.prototype.getById=function(str){
        if(document.querySelector){
            return  document.querySelector('#'+str);
        }
        return  document.getElementById(str);
    };
    /*通过class取dom*/
    MyUtils.prototype.getByClass=function(cls,pEle,tag){
        var p=pEle?pEle:document;
        var t=tag?tag:'*';
        if(p.getElementsByClassName){
            return p.getElementsByClassName(cls);

        }else{
            var r=[];
            var e=p.getElementsByTagName(t);
            for(var i=0,len=e.length;i<len;i++){
                if(e[i].className==cls){
                    r.push(e[i]);
                }
            }
            return r;
        }
    };
    /*通过tag取dom*/
    MyUtils.prototype.getByTag=function(str){
        return document.getElementsByTagName(str);
    };
    /*是否包含指定class*/
    MyUtils.prototype.hasClass=function(obj,cls){
        return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    };
    /*添加class*/
    MyUtils.prototype.addClass=function(obj,cls){
        if (!obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))) {
            obj.className += " " +cls;
        }
        return obj;
    };
    /*移除class*/
    MyUtils.prototype.removeClass=function(obj,cls){
        if (obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            obj.className = obj.className.replace(reg, ' ');
        }
        return obj;
    };

    /*获取样式值*/
    MyUtils.prototype.getStyle=function(elem,styleName){
        if(elem.style[styleName]){//内联样式
            return elem.style[styleName].replace(/[^0-9.-]/ig,'');
        }
        else if(elem.currentStyle){//IE
            return elem.currentStyle[styleName].replace(/[^0-9.-]/ig,'');
        }
        else if(document.defaultView && document.defaultView.getComputedStyle){//DOM
            styleName = styleName.replace(/([A-Z])/g,'-$1').toLowerCase();
            var s = document.defaultView.getComputedStyle(elem,'');
            return s&&s.getPropertyValue(styleName).replace(/[^0-9.-]/ig,'');
        }
        else{//other,for example, Safari
            return null;
        }
    };

    /*获取dom相对浏览器的位置*/
    MyUtils.prototype.getPosition=function(obj){
        var topValue= 0,leftValue= 0;
        while(obj){
            leftValue+= obj.offsetLeft;
            topValue+= obj.offsetTop;
            obj= obj.offsetParent;
        }
        return {left:leftValue,top:topValue};
    }

    /*拷贝对象*/
    MyUtils.prototype.clone=function(obj){
        var o;
        switch(typeof obj){
            case 'undefined': break;
            case 'string'   : o = obj + '';break;
            case 'number'   : o = obj - 0;break;
            case 'boolean'  : o = obj;break;
            case 'object'   :
                if(obj === null){
                    o = null;
                }else{
                    if(obj instanceof Array){
                        o = [];
                        for(var i = 0, len = obj.length; i < len; i++){
                            o.push(this.clone(obj[i]));
                        }
                    }else{
                        o = {};
                        for(var k in obj){
                            o[k] = this.clone(obj[k]);
                        }
                    }
                }
                break;
            default:
                o = obj;break;
        }
        return o;
    }

    /* ===========
     Tween算法
     =============*/
    function Tween(){
        return {
            Linear: function (t, b, c, d) {
                return c * t / d + b;
            },
            Quadratic: {
                easeIn: function (t, b, c, d) {
                    return c * (t /= d) * t + b;
                },
                easeOut: function (t, b, c, d) {
                    return -c * (t /= d) * (t - 2) + b;
                },
                easeInOut: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) return c / 2 * t * t + b;
                    return -c / 2 * ((--t) * (t - 2) - 1) + b;
                }
            },
            Cubic: {
                easeIn: function (t, b, c, d) {
                    return c * (t /= d) * t * t + b;
                },
                easeOut: function (t, b, c, d) {
                    return c * ((t = t / d - 1) * t * t + 1) + b;
                },
                easeInOut: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
                    return c / 2 * ((t -= 2) * t * t + 2) + b;
                }
            },
            Quartic: {
                easeIn: function (t, b, c, d) {
                    return c * (t /= d) * t * t * t + b;
                },
                easeOut: function (t, b, c, d) {
                    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
                },
                easeInOut: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
                    return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
                }
            },
            Quintic: {
                easeIn: function (t, b, c, d) {
                    return c * (t /= d) * t * t * t * t + b;
                },
                easeOut: function (t, b, c, d) {
                    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
                },
                easeInOut: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
                    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
                }
            },
            Sinusoidal: {
                easeIn: function (t, b, c, d) {
                    return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
                },
                easeOut: function (t, b, c, d) {
                    return c * Math.sin(t / d * (Math.PI / 2)) + b;
                },
                easeInOut: function (t, b, c, d) {
                    return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
                }
            },
            Exponential: {
                easeIn: function (t, b, c, d) {
                    return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
                },
                easeOut: function (t, b, c, d) {
                    return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
                },
                easeInOut: function (t, b, c, d) {
                    if (t == 0) return b;
                    if (t == d) return b + c;
                    if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
                    return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
                }
            },
            Circular: {
                easeIn: function (t, b, c, d) {
                    return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
                },
                easeOut: function (t, b, c, d) {
                    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
                },
                easeInOut: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
                    return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
                }
            },
            Elastic: {
                easeIn: function (t, b, c, d, a, p) {
                    if (t == 0) return b;
                    if ((t /= d) == 1) return b + c;
                    if (!p) p = d * .3;
                    if (!a || a < Math.abs(c)) {
                        a = c;
                        var s = p / 4;
                    }
                    else var s = p / (2 * Math.PI) * Math.asin(c / a);
                    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                },
                easeOut: function (t, b, c, d, a, p) {
                    if (t == 0) return b;
                    if ((t /= d) == 1) return b + c;
                    if (!p) p = d * .3;
                    if (!a || a < Math.abs(c)) {
                        a = c;
                        var s = p / 4;
                    }
                    else var s = p / (2 * Math.PI) * Math.asin(c / a);
                    return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
                },
                easeInOut: function (t, b, c, d, a, p) {
                    if (t == 0) return b;
                    if ((t /= d / 2) == 2) return b + c;
                    if (!p) p = d * (.3 * 1.5);
                    if (!a || a < Math.abs(c)) {
                        a = c;
                        var s = p / 4;
                    }
                    else var s = p / (2 * Math.PI) * Math.asin(c / a);
                    if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                    return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
                }
            },
            Back: {
                easeIn: function (t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    return c * (t /= d) * t * ((s + 1) * t - s) + b;
                },
                easeOut: function (t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
                },
                easeInOut: function (t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
                    return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
                }
            },
            Bounce: {
                easeIn: function (t, b, c, d) {
                    return c - Tween.Bounce.easeOut(d - t, 0, c, d) + b;
                },
                easeOut: function (t, b, c, d) {
                    if ((t /= d) < (1 / 2.75)) {
                        return c * (7.5625 * t * t) + b;
                    } else if (t < (2 / 2.75)) {
                        return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
                    } else if (t < (2.5 / 2.75)) {
                        return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
                    } else {
                        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
                    }
                },
                easeInOut: function (t, b, c, d) {
                    if (t < d / 2) return Tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
                    else return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
                }
            }
        };
    }
    /*===============================================================================
     *基于tween算法的缓动动画
     * @author:weiqingyu    2015/09/30
     * @param  <json>  paramter  参数如下
     paramter={
     element:【必须】运动元素的id,
     attr:【必须】需要改变的属性
     value:【必须】改变的值 可以为正负
     time:【可选】执行动画的时间,单位ms,默认300ms
     moveName:【可选】动画名,可选值：Linear  Quadratic  Cubic  Quartic
     Quintic  Sinusoidal  Exponential  Circular  Elastic  Back  Bounce
     默认为Linear
     moveType:【可选】动画的缓动方式，可选值：easeIn easeOut easeInOut,默认为easeIn
     callback:【可选】动画结束的回调函数
     }
     ===============================================================================*/
    MyUtils.prototype.tweenMove=function(paramter){


        //t、b、c、d（开始时间，初始值，变化量，执行次数）
        var fps=60;//帧数
        var run_time=paramter.time?paramter.time:300;//执行时间
        var t_o=1000/fps;//每改变一次的时间间隔
        var obj=paramter.element;//移动的dom对象
        var attr=paramter.attr;//属性
        var t=0;//开始时间
        var b;//初始值
        if(attr==='scrollTop'||attr==='scrollLeft'){
            b=obj[attr];
        }else{
            b=attr!=='opacity'?parseInt(getStyle(obj,paramter.attr)):parseFloat(getStyle(obj,paramter.attr))*100;
        }
        var c=attr!=='opacity'?paramter.value:paramter.value*100;//变化量
        var d=run_time/t_o;//次数
        var moveName=paramter.moveName?paramter.moveName:'Linear';//运动名称
        var moveType=paramter.moveType?paramter.moveType:'easeIn';//运动方式
        var animate=(moveName!='Linear'?Tween()[moveName][moveType]:Tween()[moveName]);//选择算法
        if(obj.timer) {
            clearInterval(obj.timer);
        }
        obj.timer=setInterval(Run,t_o);
        function Run(){
            if(attr!='opacity'){
                if(attr=='scrollTop'||attr=='scrollLeft'){
                    obj[attr] = Math.ceil(animate(t, b, c, d));
                }else{
                    obj.style[attr] = Math.ceil(animate(t, b, c, d)) + "px";
                }
            }else{
                obj.style[attr] = Math.ceil(animate(t, b, c,d))/100;
            }
            if(t<d){
                t++;
            }else{
                clearInterval(obj.timer);
                if(typeof paramter.callback=='function'){
                    paramter.callback();
                }
            }
        }
    };

    /*===============================================================================
     *基于tween算法的缓动动画(多属性同时运动)
     * @author:weiqingyu    2015/09/30
     * @param  <json>  paramter  参数如下
     paramter={
     element:【必须】运动元素的id,
     obj:【必须】需要改变的属性及其改变方式的数组集合
     [{
     attr:【必须】需要改变的属性
     value:【必须】改变值 可以为正负
     moveName:【可选】动画名,可选值：Linear  Quadratic  Cubic  Quartic
     Quintic  Sinusoidal  Exponential  Circular  Elastic  Back  Bounce
     默认为Linear
     moveType:【可选】动画的缓动方式，可选值：easeIn easeOut easeInOut,默认为easeIn
     }，{
     ...
     }],
     time:【可选】执行动画的时间,单位ms,默认300ms
     callback:【可选】动画结束的回调函数
     }
     ===============================================================================*/
    MyUtils.prototype.tweenAnimate=function(paramter){
        //t、b、c、d（开始时间，初始值，变化量，执行次数）
        var fps=60;//帧数
        var run_time=paramter.time?paramter.time:300;//执行时间
        var t_o=1000/fps;//每改变一次的时间间隔
        var ele=paramter.element;//移动的dom对象
        var obj=paramter.obj;//属性
        var t=0;//开始时间
        var d = run_time / t_o;//次数
        if(obj.timer) {
            clearInterval(obj.timer);
        }
        for(var o in obj){//初始化初始值和变化量
            var b;//初始值
            var attr_name=obj[o].attr;//属性名
            if (attr_name == 'scrollTop' ||attr_name == 'scrollLeft') {
                b = ele[attr_name];
            } else {
                b = (attr_name != 'opacity') ? parseInt(getStyle(ele, attr_name)) : parseFloat(getStyle(ele, attr_name)) * 100;
            }
            obj[o].orgValue=b;
            obj[o].changeValue= (attr_name != 'opacity') ? obj[o].value : obj[o].value * 100;//变化量
        }
        obj.timer=setInterval(Run,t_o);
        function Run(){
            for(var o in obj) {
                var b=obj[o].orgValue;//初始值
                var c = obj[o].changeValue;//变化量
                var moveName = obj[o].moveName ? obj[o].moveName : 'Linear';//运动名称
                var moveType = obj[o].moveType ? obj[o].moveType : 'easeIn';//运动方式
                var animate=(moveName!='Linear'?Tween()[moveName][moveType]:Tween()[moveName]);//选择算法
                if (obj[o].attr != 'opacity') {
                    if (obj[o].attr == 'scrollTop' || obj[o].attr == 'scrollLeft') {
                        ele[obj[o].attr] = Math.ceil(animate(t, b, c, d));
                    } else {
                        ele.style[obj[o].attr] = Math.ceil(animate(t, b, c, d)) + "px";
                    }
                } else {
                    ele.style[obj[o].attr] = Math.ceil(animate(t, b, c, d)) / 100;
                }
            }
            if (t < d) {
                t++;
            } else {
                clearInterval(obj.timer);
                if (typeof paramter.callback == 'function') {
                    paramter.callback();//执行回调
                }
            }
        }
    };


    /*===============================================================================
     *基于tween算法的缓动动画(多个元素多属性同时运动)
     * @author:weiqingyu    2015/09/30
     * @param  <json>  paramter  参数如下
     paramter={
     obj:【必须】需要改变的属性及其改变方式的数组集合
     [{
     element:【必须】运动元素，
     object:[{
     attr:【必须】需要改变的属性
     value:【必须】改变值 可以为正负
     moveName:【可选】动画名,可选值：Linear  Quadratic  Cubic  Quartic
     Quintic  Sinusoidal  Exponential  Circular  Elastic  Back  Bounce
     默认为Linear
     moveType:【可选】动画的缓动方式，可选值：easeIn easeOut easeInOut,默认为easeIn
     },{...}],
     }，{
     ...
     }],
     time:【可选】执行动画的时间,单位ms,默认300ms
     callback:【可选】动画结束的回调函数
     }
     ===============================================================================*/
    MyUtils.prototype.tweenMultiFixAnimate=function(paramter){
        //t、b、c、d（开始时间，初始值，变化量，执行次数）
        var fps=60;//帧数
        var run_time=paramter.time?paramter.time:300;//执行时间
        var t_o=1000/fps;//每改变一次的时间间隔
        var obj=paramter.obj;//属性
        var t=0;//开始时间
        var d = run_time/ t_o;//次数
        if(obj.timer) {
            clearInterval(obj.timer);
        }
        for(var o in obj){//初始化初始值和变化量
            if(!obj[o]){
                return;
            }
            for(var i in obj[o].object) {
                var b;//初始值
                var attr_name=obj[o].object[i].attr;
                if (attr_name == 'scrollTop' || attr_name == 'scrollLeft') {
                    b = obj[o][attr_name];
                } else {
                    b = (attr_name!= 'opacity') ? parseInt(getStyle(obj[o].element, attr_name)) : parseFloat(getStyle(obj[o].element,attr_name)) * 100;
                }
                obj[o].object[i].orgValue = b;
                obj[o].object[i].changeValue = (attr_name != 'opacity') ? obj[o].object[i].value : obj[o].object[i].value* 100;//变化量
            }
        }
        obj.timer=setInterval(Run, t_o);
        function Run(){
            for(var o in obj) {
                var ele=obj[o].element;//移动的dom对象
                for(var i in obj[o].object) {
                    var b=obj[o].object[i].orgValue;//初始值
                    var c = obj[o].object[i].changeValue;//变化量
                    var moveName = obj[o].object[i].moveName ? obj[o].object[i].moveName : 'Linear';//运动名称
                    var moveType = obj[o].object[i].moveType ? obj[o].object[i].moveType : 'easeIn';//运动方式
                    var animate=(moveName!='Linear'?Tween()[moveName][moveType]:Tween()[moveName]);//选择算法
                    var attr_name=obj[o].object[i].attr;
                    if (attr_name != 'opacity') {
                        if (attr_name == 'scrollTop' || attr_name == 'scrollLeft') {
                            ele[attr_name] = Math.ceil(animate(t, b, c, d));
                        } else {
                            ele.style[attr_name] = Math.ceil(animate(t, b, c, d)) + "px";
                        }
                    } else {
                        ele.style[attr_name] = Math.ceil(animate(t, b, c, d)) / 100;
                    }
                }
            }
            if (t < d) {
                t++;
            } else {
                clearInterval(obj.timer);
                if (typeof paramter.callback == 'function') {
                    paramter.callback();
                }
            }
        }
    };


    /*一种原型继承方法*/

    MyUtils.prototype.extend=function (Parent,Child){
        function deepClone(source,target){
            source = source || {} ;
            target = target || {};
            var toStr = Object.prototype.toString ,
                arrStr = '[object array]' ;
            for(var i in source){
                if(source.hasOwnProperty(i)){
                    var item = source[i] ;
                    if(typeof item === 'object'){
                        target[i] = (toStr.apply(item).toLowerCase() === arrStr) ? [] : {} ;
                        deepClone(item,target[i]) ;
                    }else{
                        target[i] = item;
                    }
                }
            }
            return target ;
        }
        Child = Child || function(){} ;
        if(Parent === undefined)
            return Child ;
        //借用父类构造函数
        Child = function(){
            Parent.apply(this,Child.arguments) ;
        } ;
        //通过深拷贝继承父类原型
        Child.prototype = deepClone(Parent.prototype) ;
        //重置constructor属性
        Child.prototype.constructor = Child ;
    };


    /**
     * 二维数组全组合
     * @param arr
     * @returns {Array}
     */
    MyUtils.prototype.fullCombination=function(arr){
        var result=[];
        var fn=function(sub_arr,arr_index){
            if(arr_index>arr.length-1){
                result.push(sub_arr);
            }else{
                for(var i=0;i<arr[arr_index].length;i++){
                    var new_arr=sub_arr.slice(0,sub_arr.length);
                    new_arr.push(arr[arr_index][i]);
                    fn(new_arr,arr_index+1);
                }
            }
        };
        fn([],0);
        return result;

    }

    /**
     * 冒泡排序
     * @param arr
     * @returns {*}
     */
    MyUtils.prototype.popSort=function(arr){
        if(arr instanceof Array) {
            if(arr.length>0) {
                var len = arr.length - 1;
                while(len>0){
                    for(var i=0;i<len;i++){
                        if(arr[i]>arr[i+1]){
                            var temp=arr[i+1];
                            arr[i+1]=arr[i];
                            arr[i]=temp;
                        }
                    }
                    len--;
                }
            }
        }
        return arr;
    }
    /**
     * 快速排序
     * @param arr
     * @returns {*}
     */
    MyUtils.prototype.quickSort=function(arr){
        if(arr instanceof Array) {
            if(arr.length>0) {
                var sort=function(left_index,right_index){
                    var l=left_index;
                    var r=right_index;
                    var v0=arr[l];
                    while(l<r) {
                        for (;r >l;r--) {
                            if (v0 > arr[r]) {
                                var temp = arr[r];
                                arr[r] = v0;
                                arr[l] = temp;
                                l++;
                                break;
                            }
                        }
                        for (;l <r; l++) {
                            if (v0 <arr[l]) {
                                var temp = arr[l];
                                arr[l] = v0;
                                arr[r] = temp;
                                r--;
                                break;
                            }

                        }

                    }
                    if(l>=r){
                        if(l-1>=left_index){
                            sort(left_index,l-1);
                        }
                        if(r+1<=right_index){
                            sort(r+1,right_index);
                        }
                    }

                };
                sort(0,arr.length-1);
            }
        }
        return arr;

    }
})()