import {
    Group,
    Geometry,BufferGeometry,LineBasicMaterial,Line,
    Vector3,
    CatmullRomCurve3,
} from 'three';
import Img from './Img'
import Path from './Path'
export default class Leaf extends Group{
    constructor(param){
        super();
        this.points=param.points?param.points:[
            new Vector3(1,1.1,0),
            new Vector3(0.3,0.6,0),
            new Vector3(-0.2,-0.4,0),
            new Vector3(-1,-1.1,0),
        ]
        this.path=new Path(this.points);
        this.object=new Img(param);
        this.pos = new Vector3();
        this.nextPos = new Vector3();
        this.time=0;
        this.delayTime=0;
        this.init(param);
    }
    init({rad=Math.PI/12,x=0,y=0,z=0,beginTime=0}){
        this.beginTime=beginTime;
        const geo=new Geometry();
        geo.vertices=this.points;
        geo.rotateZ(rad);
        geo.translate(x,y,z);
        this.path=new Path(geo.vertices);
    }
    animate(time){
        if(this.delayTime<this.beginTime){
            this.delayTime+=time;
            return;
        }
        this.time+=time;
        //将递增的时间转化为距离
        let distance = this.time*0.2;
        //目标点到目标的距离
        const targetOffset = 0.1;
        //从曲线上获取汽车点位。getPointAt 查手册吧。我只授之以渔。
        this.path.getPointAt(distance % 1, this.pos);
        //从曲线上获取汽车目标点位
        this.path.getPointAt((distance + targetOffset) % 1, this.nextPos);
        //汽车定位
        this.object.position.copy(this.pos);
        //实现软旋转
        this.object.lookAt(this.nextPos);
        //此方法还可以实现软位移
        //this.object.position.lerpVectors(this.pos, this.nextPos, 0.5);
    }
}