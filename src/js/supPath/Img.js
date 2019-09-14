import {
    PlaneBufferGeometry,
    MeshBasicMaterial,Mesh,
    TextureLoader,
    Matrix4,
    Euler,
    DoubleSide
} from 'three';
export default class Img extends Mesh{
    constructor(param){
        super();
        this.init(param);
    }
    init({url=null,alphaUrl=null,w=.2,h=.2,opacity=1}){
        this.geometry =new PlaneBufferGeometry(w,h);
        const radY=-Math.PI/2-Math.PI/6+Math.random()*Math.PI/3;
        const  matrix=new Matrix4().makeRotationFromEuler(new Euler( 0, Math.PI/2,radY, 'XYZ' ));
        matrix.applyToBufferAttribute(this.geometry.attributes.position);
        const map=url?new TextureLoader().load(url):null;
        const alphaMap=alphaUrl?new TextureLoader().load(alphaUrl):null;
        this. material = new MeshBasicMaterial({
            map:map,
            transparent:true,
            alphaMap:alphaMap,
            opacity:opacity,
            side:DoubleSide
        });
    }
}