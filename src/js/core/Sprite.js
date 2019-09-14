import Util from 'core/Util'
import Display from "core/Display"

export default class Sprite extends Display{
    constructor() {
        super();
        this.children=[];
    }

    add(obj){
        //不同类型的对象会有不同类型的setPos
        obj.parent=this;
        obj.setView(this.vx,this.vy);
        obj.setPos(obj.x+this.x,obj.y+this.y,obj.z+this.z);
        this.children.push(obj);
    }
}
