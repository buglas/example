import {
    Scene,PerspectiveCamera,WebGLRenderer,BoxBufferGeometry,
    BufferGeometry,MeshBasicMaterial,LineBasicMaterial,Mesh,Line,
    Vector3,CatmullRomCurve3
} from 'three';
import OrbitControls from 'three-orbitcontrols'

const canvas = document.querySelector('#c');
const {innerWidth,innerHeight}=window;
const renderer = new WebGLRenderer({canvas});
renderer.setSize(innerWidth, innerHeight, false);
const fov = 45;
const aspect = innerWidth / innerHeight;
const near = 0.01;
const far = 10;
const camera = new PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 2, 0);
camera.updateProjectionMatrix();
const controls = new OrbitControls(camera, canvas);
const scene = new Scene();

//建立路径
let curve;
{
    const points = [
        new Vector3(0.5,0,0.5),
        new Vector3(-0.5,0,0.5),
        new Vector3(-0.5,0,-0.5),
    ];
    //三维样条线
    //顶点，是否闭合，圆滑方式，圆滑力度
    curve = new CatmullRomCurve3(points,true,'catmullrom', 0.01);
    //建立辅助线，用于查看路径
    {
        const points = curve.getPoints(6);
        const geometry = new BufferGeometry().setFromPoints(points);
        const material = new LineBasicMaterial({color: 0xff0000});
        const curveObject = new Line(geometry, material);
        scene.add(curveObject);
    }
}
//建立运动物体
let car;
{
    const geometry =new BoxBufferGeometry(.1,.1,.2);
    const material = new MeshBasicMaterial( {color: 0xcccccc} );
    car = new Mesh( geometry, material );
    scene.add(car);
}

//汽车位置
const carPosition = new Vector3();
//汽车目标点
const carTarget = new Vector3();
function render(time) {
    //将递增的时间转化为距离
    let distance = time*0.0002;  // convert to seconds
    {
        //目标点到目标的距离
        const targetOffset = 0.1;
        //从曲线上获取汽车点位。getPointAt 查手册吧。我只授之以渔。
        curve.getPointAt(distance % 1, carPosition);
        //从曲线上获取汽车目标点位
        curve.getPointAt((distance + targetOffset) % 1, carTarget);
        //汽车定位
        car.position.copy(carPosition);
        //实现软旋转
        car.lookAt(carTarget);
        //此方法还可以实现软位移
        //car.position.lerpVectors(carPosition, carTarget, 0.5);
    }
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
requestAnimationFrame(render);

window.onresize=function(){
    const {innerWidth,innerHeight}=window;
    camera.aspect=innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth,innerHeight);
}