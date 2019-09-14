import './css/band.less'
require("expose-loader?$!jquery");


//建立数据
//包裹canvas 的div
let rec=document.getElementById('rec');
//div 宽度自定义；canvas 高度写死为38
let recW=rec.offsetWidth;
//平分为20份
let shareNum=20;
//每一步移动距离
let ssp=100/shareNum;
//前端初始数据，abcde 五个节点（默认初始必须显示所有节点），平均分布,按照进度条5% 移动
let colors=['#9FBFFF','#79CDA7','#A09FA0','#FFE262','#F29993','#A2ADDF'];
let nodeData=[{text:'A'},{text:'B'},{text:'C'},{text:'D'},{text:'E'}];
nodeData.forEach(function(ele,ind){
    ele.mx=shareNum/nodeData.length*(ind+1);
    ele.color=colors[ind];
})
//建立进度条对象，并初始化基础数据
let prg=new Progress({
    rec:rec,
    nodeData:nodeData,
    shareNum:shareNum,
    addBtn:document.getElementById('addBtn'),
    subBtn:document.getElementById('subBtn'),
    colors:colors,
    minPosMx:1,
    refreshDetailData:function(nodeArr){
        refreshDetailData(nodeArr);
    },
    refreshDetail:function(nodeArr){
        refreshDetail(nodeArr);
    },
    onMouseUp:function(nodeArr){
    },
    onAddNode:function(nodeArr){
        main.eventsFn.btnChangeTab(nodeArr);
    },
    onSubNode:function(nodeArr){
        main.eventsFn.btnChangeTab(nodeArr);
    },
});
//生成进度条
prg.init();
//根据进度条信息生成详细信息的DOM 节点
function refreshDetail(nodeArr){
    $('#nodesDetal').html('');
    nodeArr.forEach(function(ele,i){
        let begin,end;
        if(i===0){
            begin=0;
        }else{
            begin=nodeArr[i-1].mx*ssp;
        }
        end=ele.mx*ssp;
        let str=begin+'% - '+end+'%';
        $('#nodeDetailDemo .node-name').html(ele.text);
        $('#nodeDetailDemo .percent').html(str);
        $('#nodesDetal').append($('#nodeDetailDemo').html());
    })
}
//根据进度条信息刷新详细信息的DOM 节点的数据
function refreshDetailData(nodeArr){
    nodeArr.forEach(function(ele,i){
        let begin,end;
        if(i===0){
            begin=0;
        }else{
            begin=nodeArr[i-1].mx*ssp;
        }
        end=ele.mx*ssp;
        let str=begin+'% - '+end+'%';
        let obj=$('.nodeDetail').get(i);
        $(obj).find('.node-name').html(ele.text);
        $(obj).find('.percent').html(str);
    })
}

//动画渲染
(function dramFrame(){
    window.requestAnimationFrame(dramFrame);
    prg.ctx.clearRect(0, 0, prg.width, prg.height);
    prg.line.draw();
    //画节点
    prg.nodeArr.forEach(function(node,ind){
        node.draw();
    })
}())