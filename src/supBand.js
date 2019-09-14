import './css/supBand.less'
import Node from  './js/band/Node'
import Scene from "@/js/core/Scene"

const rec=document.getElementById('rec');
const canvas=document.createElement('canvas');

const scene=new Scene();
rec.appendChild(scene.canvas);

const node=new Node('A','#9FBFFF');
scene.add(node);

scene.render();

