export default class Scene{
    constructor(){
        this.children=[];
        this.canvas=null;
        this.ctx=null;
        this.init();
    }
    init(){
        this.canvas=document.createElement('canvas');
        this.canvas.setAttribute('width','100%');
        this.canvas.setAttribute('height','100%');
        this.ctx=this.canvas.getContext('2d');
    }
    add(obj){
        obj.parent=this;
        this.children.push(obj);
    }
    render(){
        for(const ele of this.children){
            ele.draw(this.ctx);
        }
    }
}