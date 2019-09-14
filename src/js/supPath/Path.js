import {
    BufferGeometry,LineBasicMaterial,Line,
    Vector3,
    CatmullRomCurve3,
} from 'three';
export default class Path extends CatmullRomCurve3{
    constructor(points){
        super(points,false,'catmullrom');
        this.helper=null;
        this.init();
    }
    init(){
        const points = this.getPoints(12);
        const geometry = new BufferGeometry().setFromPoints(points);
        const material = new LineBasicMaterial({color: 0xc0813f});
        this.helper = new Line(geometry, material);
    }
}