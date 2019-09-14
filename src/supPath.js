    import {
    Scene,PerspectiveCamera,WebGLRenderer,Color,
    Geometry,
    AxesHelper,PlaneGeometry,PlaneBufferGeometry,SphereGeometry,BoxGeometry,BoxBufferGeometry,CircleBufferGeometry,
    BufferGeometry,
    BufferAttribute,
    MeshBasicMaterial,MeshLambertMaterial,PointsMaterial,LineBasicMaterial,
    Points,Mesh,Line,
    AmbientLight,SpotLight,PointLight,
    Fog,
    Vector3,Face3,
    Group,
    WebGLRenderTarget,
    TextureLoader,
    Quaternion,
    CatmullRomCurve3,
    Matrix4,
    Euler,
    Clock
} from 'three';
import OrbitControls from 'three-orbitcontrols'
import Leaf from './js/supPath/Leaf'

let toggle=false;
const rec = document.querySelector('#rec');
let {clientWidth,clientHeight} = rec;
const renderer = new WebGLRenderer();
let clearColor=new Color(0xdda56b);
renderer.setClearColor(clearColor);
renderer.setSize(clientWidth, clientHeight, false);
rec.appendChild(renderer.domElement);
const scene = new Scene();

/*-----相机-----*/
let camera=new PerspectiveCamera(45,innerWidth/innerHeight,0.1,1000);
// 相机位置
camera.position.set(0,0,2)
camera.lookAt(scene.position);

//轴
let axes=new AxesHelper(20);
axes.visible=toggle;
scene.add(axes);

//图片路径集合
let imgPaths=[];
for (let i=0;i<5;i++){
    imgPaths.push({
        url:require(`./images/leaf${i}.jpg`),
        alphaUrl:require(`./images/leaf${i}Gray.jpg`),
    });
}
//树叶
let leaves=[];
//复制五份树叶集
for (let i=0;i<5;i++){
    crtLeaves(0.4*i+Math.random()*0.2-0.6,Math.random()*1+0.8*i);
}
//建立一个树叶集
function crtLeaves(offsetX=0,offsetT=0){
    for (let i=0;i<5;i++){
        let n=Math.floor(Math.random()*5);
        const imgPath=imgPaths[n];
        const leaf=new Leaf({
            url:imgPath.url,
            alphaUrl:imgPath.alphaUrl,
            rad:Math.PI/40*i,
            x:.08*i+offsetX,
            z:Math.random()*1-0.5,
            beginTime:(0.3+Math.random()*1)*i+offsetT,
        });
        leaf.path.helper.visible=toggle;
        scene.add(leaf.path.helper);
        scene.add(leaf.object);
        leaves.push(leaf);
    }
}
//画个月亮
var geometry = new CircleBufferGeometry( .72, 64 );
var material = new MeshBasicMaterial( { color: 0xeed2b5} );
var circle = new Mesh( geometry, material );
const circleX=0.9*clientWidth/clientHeight-0.4;
circle.position.set(getCircleX(),.38,-1)
scene.add( circle );
function getCircleX(){
    return 0.9*clientWidth/clientHeight-0.4;
}

//计时器
const clock=new Clock();
//动画开始
requestAnimationFrame(render);

//相机轨道控制器
const controls=new OrbitControls(camera,renderer.domElement);
//窗口缩放
window.onresize=function (event) {
    clientWidth=rec.clientWidth;
    clientHeight=rec.clientHeight;
    camera.aspect=clientWidth/clientHeight;
    camera.updateProjectionMatrix();
    circle.position.x=getCircleX();
    renderer.setSize(clientWidth,clientHeight);

}
//文字缓慢显示
setTimeout(function(){
    const say=document.getElementById('say');
    say.style.opacity='1';
},2000)
//按钮单击
document.getElementById('btn').onclick=function () {
    toggle=!toggle;
    axes.visible=toggle;
    setPathVisible(toggle);
}
function setPathVisible(bool) {
    leaves.forEach((ele)=>{
        ele.path.helper.visible=bool;
    })
}



function render(time) {
    let newTime=clock.getDelta();
    leaves.forEach((ele)=>{
        ele.animate(newTime);
    })

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}


