import  './css/canvasFull.less'
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
camera.position.set(0, 0, 2);
camera.updateProjectionMatrix();
const controls = new THREE.OrbitControls(camera, canvas);
const scene = new THREE.Scene();
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );


const [p1, p2, p3]=[
    new THREE.Vector3(0.3,0.2,0),
    new THREE.Vector3(0.4,0.5,0),
    new THREE.Vector3(0.9,0.4,0),
]
crtTriangle(p1, p2, p3);
let v1 = new THREE.Vector3();
let v2 = new THREE.Vector3();
// 通过两个顶点坐标计算其中两条边构成的向量
v1 = p1.clone().sub(p2);
v2 = p1.clone().sub(p3);
crtTriangle(new THREE.Vector3(0,0,0),v1,v2);

const v3 = new THREE.Vector3();
// 三角形面积计算
v3.crossVectors(v1,v2);
const s = v3.length()/2;
console.log('s',s);

crtLine(new THREE.Vector3(0,0,0),v3);

function crtLine(...rest) {
    const geometry = new THREE.BufferGeometry().setFromPoints([...rest]);
    const material = new THREE.LineBasicMaterial({color: 0xffffff});
    const curveObject = new THREE.Line(geometry, material);
    scene.add(curveObject);
}

function crtTriangle(...rest){
    crtLine(...rest,rest[0]);
}

function render(time) {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
requestAnimationFrame(render);