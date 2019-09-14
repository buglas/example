const canvas = document.querySelector('#c');
const width = canvas.clientWidth;
const height = canvas.clientHeight;
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(width, height, false);
const fov = 45;
const aspect = width / height;
const near = 0.01;
const far = 10;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 2, 0);
camera.updateProjectionMatrix();
const controls = new THREE.OrbitControls(camera, canvas);
const scene = new THREE.Scene();

let curve;
let curveObject;
{
    const points = [
        [0.5,0,0.5],
        [-0.5,0,0.5],
        [-0.5,0,-0.5],
    ];
    curve = new THREE.CatmullRomCurve3(
        points.map((p, ndx) => {
            return (new THREE.Vector3()).set(...p);
        }),
        true,
        'catmullrom',
        0.01
    );
    {
        const points = curve.getPoints(6);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({color: 0xff0000});
        curveObject = new THREE.Line(geometry, material);
        scene.add(curveObject);
    }
}

let car;
{
    const geometry =new THREE.BoxBufferGeometry(.1,.1,.2);
    const material = new THREE.MeshBasicMaterial( {color: 0xcccccc} );
    car = new THREE.Mesh( geometry, material );
    scene.add(car);
}

//汽车位置
const carPosition = new THREE.Vector3();
//汽车目标点
const carTarget = new THREE.Vector3();
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