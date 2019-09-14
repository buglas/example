(function(global,util){
    if(!global.requestAnimationFrame){
        global.requestAnimationFrame =(global.webkitRequestAnimationFrame||
            global.mozRequestAnimationFrame||
            global.oRequestAnimationFrame||
            global.msRequestAnimationFrame||
            function(callback){
                return global.setTimeout(callback,1000/60);
            });
    }
    if (!global.cancelAnimationFrame) {
        global.cancelAnimationFrame = (global.cancelRequestAnimationFrame ||
            global.webkitCancelAnimationFrame || global.webkitCancelRequestAnimationFrame ||
            global.mozCancelAnimationFrame || global.mozCancelRequestAnimationFrame ||
            global.msCancelAnimationFrame || global.msCancelRequestAnimationFrame ||
            global.oCancelAnimationFrame || global.oCancelRequestAnimationFrame ||
            global.clearTimeout);
    }
    var sp={};
    //获取鼠标在canvas 元素中的位置
    sp.checkObjIncPoint = function(obj,pos){
        var bound=obj.bound;
        return sp.checkRecIncPointByPointParam(bound.top,bound.right,bound.bottom,bound.left,pos.x,pos.y);
    }
    sp.checkRecIncPointByPointParam = function(top,right,bottom,left,x,y){
        var inc=false;
        if(x>=left&&x<=right&&y>=top&&y<=bottom){
            inc=true;
        }
        return inc;
    }
    sp.checkCrashLeft=function(mainNode,leftNode){
        if(mainNode.bound.left<=leftNode.bound.right){
            return true;
        }else{
            return false;
        }
    }
    sp.checkCrashRight=function(mainNode,rightNode){
        if(mainNode.bound.right>=rightNode.bound.left){
            return true;
        }else{
            return false;
        }
    }
    sp.isUndefinded=function(obj){
        if(typeof obj==='undefined'){
            return true;
        }else{
            return false;
        }
    }
    global[util]=sp;
})(typeof window==="undefined"?this:window,'lv')

function MousePos(element){
    this.element=element;
    if(typeof element==='undefined'){
        this.element=canvas;
    }else{
        this.element=element;
    }
    this.x=null;
    this.y=null;
    this.setPos();
}
MousePos.prototype.setElement=function(element){
    this.element=element;
    return this;
}
MousePos.prototype.setPos=function(){
    var mp=this;
    document.addEventListener('mousemove',function(event){
        var x,y;
        //获取鼠标位于当前屏幕的位置， 并作兼容处理
        if(event.pageX||event.pageY){
            x = event.pageX;
            y = event.pageY;
        }else{
            x = event.clientX + document.body.scrollLeft +document.documentElement.scrollLeft;
            y = event.clientY + document.body.scrollTop +document.documentElement.scrollTop;
        }
        //将当前的坐标值减去元素的偏移位置，即为鼠标位于当前canvas的位置
        var pos = mp.element.getBoundingClientRect();
        x -= pos.left;
        y -= pos.top;
        mp.x=x;
        mp.y=y;
    })
}
function Line(context){
    this.x=0;
    this.y=0;
    this.width=null;
    this.height=8;
    this.colors=['#9FBFFF','#79CDA7','#A09FA0','#FFE262','#F29993','#A2ADDF']; //节点进度条的颜
    this.nodes=[];
    //上下文
    if(typeof context==='undefined'){
        if(typeof ctx==='undefined'){
            console.error('canvas context undefined!')
        }else{
            this.context=ctx;
        }
    }else{
        this.context=context;
    }
}
Line.prototype.setColors=function(colors){
    this.colors=colors;
    return this;
}
Line.prototype.setPos=function(x,y){
    this.x=x;
    this.y=y;
    this.shareNum=null;
    return this;
}
Line.prototype.setWidth=function(width){
    this.width=width;
    return this;
}
Line.prototype.setNodes=function(nodes){
    this.nodes=nodes;
    this.nodes.unshift(0);
    return this;
}
Line.prototype.setShareNum=function(shareNum){
    this.shareNum=shareNum;
    return this;
}
Line.prototype.draw=function () {
    var ctx=this.context;
    ctx.save();
    ctx.translate(this.x,this.y);


    var line=this;
    var moveY=line.height/2;
    //绘制彩线
    ctx.lineWidth=this.height;
    this.nodes.forEach(function(num,ind){
        ctx.strokeStyle=line.colors[ind];
        ctx.beginPath();
        ctx.moveTo(num,moveY);
        if(ind===line.nodes.length-1){
            ctx.lineTo(line.width,moveY);
        }else{
            ctx.lineTo(line.nodes[ind+1],moveY);
        }
        ctx.stroke();
    })
    //绘制刻度线
    var space=line.width/line.shareNum;
    ctx.lineWidth=1;
    ctx.strokeStyle='#fff';
    for(var i=1;i<line.shareNum;i++){
        var posX=Math.round(space*i);
        ctx.beginPath();
        ctx.moveTo(posX,0);
        ctx.lineTo(posX,line.height);
        ctx.stroke();
    }

    ctx.restore();
}
function Node(context,mp){
    this.text='';
    this.x=0;
    this.y=0;
    this.minX=null;
    this.maxX=null;
    this.minMx=null;
    this.maxMx=null;
    this.width=18;
    this.height=36;
    this.color=''; //节点进度条的颜
    this.msp; //节点有效运动单位
    this.mx; //节点有效单位
    //上下文
    if(typeof context==='undefined'){
        if(typeof ctx==='undefined'){
            console.error('canvas context undefined!')
        }else{
            this.context=ctx;
        }
    }else{
        this.context=context;
    }
    //边界
    this.bound=null;
    //node 状态,up down move
    this.mup=false; //mouse up
    this.mdown=false; //mouse down
    this.mout=false; //mouse up
    this.mover=false; //mouse down
    //点击位置
    this.clickPos={x:null,y:null};
    //鼠标位置对象
    if(typeof mp==='undefined'){
        this.mousePos=mousePos;
    }else{
        this.mousePos=mp;
    }
}
Node.prototype.setText=function(text){
    this.text=text;
    return this;
}
Node.prototype.setX=function(x){
    if(this.minX!==null&&x<this.minX){x=this.minX}
    if(this.maxX!==null&&x>this.maxX){x=this.maxX}
    this.x=x;
    this.mx=this.getMxByX(x);
    this.setBound();
    return this;
}
Node.prototype.setMinMx=function(minMx){
    this.minMx=minMx;
    this.minX=this.getXbyMx(minMx);
    return this;
}
Node.prototype.setMaxMx=function(maxMx){
    this.maxMx=maxMx;
    this.maxX=this.getXbyMx(maxMx);
    return this;
}
Node.prototype.getXbyMx=function(mx){
    return this.msp*mx;
}
Node.prototype.getMxByX=function(x){
    return Math.round(x/this.msp);
}

Node.prototype.setMsp=function(msp){
    this.msp=msp;
    return this;
}
Node.prototype.setMx=function(mx){
    if(this.minMx!==null&&mx<this.minMx){mx=this.minMx}
    if(this.maxMx!==null&&mx>this.maxMx){mx=this.maxMx}
    this.mx=mx;
    this.setX(this.mx*this.msp);
    return this;
}
Node.prototype.setY=function(y){
    this.y=y;
    this.setBound();
    return this;
}
Node.prototype.setPos=function(x,y){
    this.x=x;
    this.y=y;
    this.setBound();
    return this;
}
Node.prototype.setColor=function(color){
    this.color=color;
    return this;
}
//获取边界
Node.prototype.setBound=function(){
    this.bound={
        top:this.y,
        right:this.x+this.width,
        bottom:this.y+this.height,
        left:this.x,
    };
}
//在缩放后，会设置一个缩放边界
Node.prototype.setBoundSc=function(){

}
//设置状态
Node.prototype.setMdown=function(bool){
    this.mup=!bool;
    this.mdown=bool;
    this.clickPos={
        x:this.mousePos.x-this.x,
        y:this.mousePos.y-this.y,
    }
    return this;
}
Node.prototype.setMup=function(bool){
    this.mdown=!bool;
    this.mup=bool;
    return this;
}
Node.prototype.setMover=function(bool){
    this.mout=!bool;
    this.mover=bool;
    return this;
}
Node.prototype.setMout=function(bool){
    this.mover=!bool;
    this.mout=bool;
    return this;
}
//建立拖动方法
Node.prototype.drag=function(dir){
    var curX=this.mousePos.x-this.clickPos.x;
    var curY=this.mousePos.y-this.clickPos.y;
    this.setPos(curX,curY);
    return this;
}
Node.prototype.dragX=function(){
    var curX=this.mousePos.x-this.clickPos.x;
    /*if(this.minX!==null&&curX<this.minX){curX=this.minX}
    if(this.maxX!==null&&curX>this.maxX){curX=this.maxX}*/
    this.setX(curX);
    return this;
}
Node.prototype.dragY=function(){
    var curY=this.mousePos.y-this.clickPos.y;
    this.setY(curY);
    return this;
}
Node.prototype.draw=function () {
    var ct=this.context;
    ct.save();
    ct.translate(this.x,this.y);
    //绘水滴
    ct.beginPath();
    ct.fillStyle=this.color;
    ct.arc(9,9,9,Math.PI,0);
    ct.moveTo(18,9)
    ct.quadraticCurveTo(18,15,9,24)
    ct.quadraticCurveTo(0,15,0,9)
    ct.fill();
    //绘制文字
    ct.fillStyle="#fff";
    ct.font='14px Microsoft YaHei';
    ct.textAlign='center';
    ct.fillText(this.text,9,14);
    //绘制下方矩形
    if(this.mdown){
        ct.strokeStyle='#fff';
        if(this.color){
            ct.lineWidth=2
            ct.shadowBlur=0;
            ct.shadowOffsetY=2;
            ct.shadowColor=this.color;
            ct.fillStyle=this.color;
        }else{
            ct.fillStyle='#333';
        }
    }else{
        ct.strokeStyle='#00B38A';
        ct.fillStyle='#fff'
    }

    ct.beginPath();
    ct.moveTo(5,24);
    ct.lineTo(13,24);
    ct.lineTo(13,36);
    ct.lineTo(5,36);
    ct.closePath();
    ct.stroke();
    ct.fill();
    ct.restore();
}
function Progress(obj){
    this.rec=obj.rec;
    this.recW=rec.offsetWidth;
    this.proW=this.recW-18;
    this.shareNum=obj.shareNum;
    this.width=this.recW;
    this.height=45;
    this.msp=this.proW/this.shareNum;
    this.colors=obj.colors;
    this.minPosMx=0;
    if(!lv.isUndefinded(obj.minPosMx)){
        this.minPosMx=obj.minPosMx;
    }
    var canvas=document.createElement('canvas');
    canvas.width=this.recW;
    canvas.height=this.height;
    this.ctx=canvas.getContext('2d');
    this.canvas=canvas;
    this.rec.html='';
    this.rec.appendChild(this.canvas);
    this.mousePos=new MousePos(this.canvas); //鼠标位置对象


    this.nodeData=obj.nodeData;
    this.nodeArr=[];
    this.loadedNum=0; //图片加载数量
    this.crashBegin=false; //是否开始碰撞
    this.crashTm=null; //碰撞时间检测
    this.mainNode=null; //主动节点
    this.draging=false; //是否拖动中

    this.addBtn=obj.addBtn;
    this.subBtn=obj.subBtn;
    this.refreshDetailData=obj.refreshDetailData;
    this.refreshDetail=obj.refreshDetail;
    this.onMouseUp=obj.onMouseUp; //鼠标从节点抬起

    this.onAddNode=obj.onAddNode; //鼠标从节点抬起
    this.onSubNode=obj.onSubNode; //鼠标从节点抬起


    //建立进度线对象
    var line =new Line(this.ctx);
    line.setPos(9,28);
    line.setWidth(this.proW);
    line.setShareNum(this.shareNum);
    line.setColors(this.colors)
    this.line=line;
}
//基本配置
Progress.prototype.init=function(){
    //循环生成node节点，进度条
    var pro=this;
    this.nodeData.forEach(function(ele,ind){
        var len=pro.nodeData.length;
        pro.createNode(ind,ele,ele.mx,len);
    })
    this.setLine();
    this.refreshDetail(this.nodeArr);
    this.addBtn.addEventListener('click',function(){
        pro.addNode();

    })
    this.subBtn.addEventListener('click',function(){
        pro.subNode();
    })
    //鼠标移动
    document.addEventListener('mousemove',function(event){
        if(event.buttons===0&&pro.mainNode){
            pro.mainNode.setMdown(false);
            pro.mainNode=null;
        }
        if(pro.mainNode){
            //移动节点
            pro.moveNode();
            //检测碰撞
            pro.beginCrash();
        }
        let find=false;
        if(pro.mainNode){
            find=true;
        }else{
            var nodeArr=pro.nodeArr;
            for(var i=0;i<nodeArr.length;i++){
                if(lv.checkObjIncPoint(nodeArr[i],pro.mousePos)){
                    find=true;
                    break;
                }
            }
        }
        if(find){
            if(pro.rec.style.cursor!=='pointer'){
                pro.rec.style.cursor='pointer';
            }
        }else{
            if(pro.rec.style.cursor!=='default'){
                pro.rec.style.cursor='default';
            }
        }



    })
    document.addEventListener('mouseup',function(event){
        if(pro.mainNode){
            pro.mainNode.setMdown(false);
            pro.mainNode=null;
            //鼠标抬起事件
            //pro.rec.style.cursor='default';
        }
    })
    document.addEventListener('mousedown',function(event){
        //用mousePos 判断点所在的对象
        pro.mainNode=null;
        var nodeArr=pro.nodeArr;
        for(var i=0;i<nodeArr.length;i++){
            if(lv.checkObjIncPoint(nodeArr[i],pro.mousePos)){
                nodeArr[i].setMdown(true);
                pro.mainNode=nodeArr[i];
                break;
            }
        }
    });
}
//创建node 并填充到nodeArr 数组
Progress.prototype.createNode=function(ind,ele,mx,len){
    //绘制节点
    var node=new Node(this.ctx,this.mousePos);
    node.ind=ind;
    node.setText(ele.text);
    node.setColor(ele.color);
    node.setMsp(this.msp);
    node.setMx(mx); //设置步位
    node.setMinMx(ind+this.minPosMx); //最小值
    if(typeof len!=='undefined'){
        this.setNodeMax(node,len,ind); //设置最大值
    }
    this.nodeArr.push(node);
    return node;
}
//根据节点位置设置最大值
Progress.prototype.setNodeMax=function(node,len,ind){
    node.setMaxMx(this.shareNum-(len-ind-1)); //最大值
}

//移动节点
Progress.prototype.moveNode=function(){
    //节点吸引判断
    for(var i=0;i<this.shareNum+1;i++){
        var curX=i*this.msp;
        var distance=Math.abs(this.mousePos.x-curX);
        if(distance<=this.msp/2){
            this.mainNode.setX(curX);
            break
        }
    }
}
//开始碰撞
Progress.prototype.beginCrash=function(){
    var pro=this;
    pro.checkLeft(pro.mainNode);
    pro.checkRight(pro.mainNode);
    //刷新进度条数据
    pro.setLine();
    //刷新节点数据
    pro.refreshDetailData(pro.nodeArr);
}
//测试左碰撞
Progress.prototype.checkLeft=function(node){
    if(node.ind===0){return}
    var node2=this.nodeArr[node.ind-1];
    var crash=lv.checkCrashLeft(node,node2);
    if(crash){
        node2.setMx(node2.mx-1);
        this.checkLeft(node2)
    }
}
//测试右碰撞
Progress.prototype.checkRight=function(node){
    if(node.ind===this.nodeArr.length-1){return}
    var node2=this.nodeArr[node.ind+1];
    var crash=lv.checkCrashRight(node,node2);
    if(crash){
        node2.setMx(node2.mx+1);
        this.checkRight(node2)
    }
}

Progress.prototype.setLine=function(){
    //画线
    var arry=[]
    this.nodeArr.forEach(function(node,ind){
        arry.push(node.x);
    })
    this.line.setNodes(arry);
}

//添加节点
Progress.prototype.addNode=function(){
    if(this.nodeArr.length>=this.nodeData.length){return}
    var curInd=this.nodeArr.length;
    var curNode=this.createNode(curInd,this.nodeData[curInd],this.shareNum,curInd+1);
    this.setNodeArrMax();
    //检测左碰撞
    this.checkLeft(this.nodeArr[curInd]);

    //刷新进度条数据
    this.setLine();
    this.refreshDetail(this.nodeArr);
    //监听节点事件
    this.onAddNode(this.nodeArr,curNode);

}
//删除节点
Progress.prototype.subNode=function(){
    if(this.nodeArr.length<=1){return}
    var curNode=this.nodeArr.splice(-1,1);
    this.setNodeArrMax();
    //刷新进度条数据
    this.setLine();
    this.refreshDetail(this.nodeArr);
    //监听节点事件
    this.onSubNode(this.nodeArr,curNode);
}
//setNodeArrMax 遍历设置max
Progress.prototype.setNodeArrMax=function(){
    var pro=this;
    this.nodeArr.forEach(function(ele,ind){
        pro.setNodeMax(ele,pro.nodeArr.length,ind);
    })
}

