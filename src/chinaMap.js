require("expose-loader?$!jquery");
import  './css/chinamap.less'
//云仓分布图
$(function(){


})
let rec=document.getElementById('rec');
setRecSize();
let yc=new YcMap({
    rec:rec,
    //鼠标滑过
    mouseoverFn:function(obj){
        //圆点缩放
        obj.setRs(2);
        //圆点色彩
        obj.act();
        //线
        yc.showLine(obj);
        //提示信息
        showInfo(obj);
    },
    //鼠标抬起
    mouseoutFn:function(obj){
        //obj.rs=1;
        obj.setRs(1);
        obj.unAct();
        yc.hideLine(obj);
        hideInfo();
    }
});
function showInfo(obj){
    $('#infoText').html(obj.name);
    let pos=rec.getBoundingClientRect();
    let left=obj.x-$('#info').width()/2+pos.left;
    let top=obj.y-42+pos.top;
    $('#info').css({left:left,top:top});
    $('#info').addClass('info-act');
}
function hideInfo(){
    $('#info').removeClass('info-act');
    $('#info').css({left:0,top:0});
}
$(window).resize(function(){
    setRecSize();
    yc.resize();
})
function setRecSize(){
    let winH=document.documentElement.clientHeight;
    let winW=document.documentElement.clientWidth;
    rec.style.height=winH+'px';
    rec.style.width=winW+'px';
}
setInterval(function(){
    for(let ele of yc.children){
        ele.anim();
    }
},40)
rec.addEventListener('mousemove',function(){
    yc.mouseMoveFn();
});
$.ajax({
    url:'https://yxyy-js.oss-cn-beijing.aliyuncs.com/province.json',
    dataType:'json',
    type:'get',
    success:function(res){
        console.log(res);
        yc.data=res.result;
        yc.init();
    }
})
!(function drawFrame(){
    window.requestAnimationFrame(drawFrame);
    yc.ctx.clearRect(0,0,yc.canvas.width,yc.canvas.height);
    yc.draw();
})();
