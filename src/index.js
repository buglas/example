import './css/index.less'
const pages=require('../pages');
const listDom=document.getElementById('left');
const ifm=document.getElementById('ifm');
const loading=document.getElementById('loading');

let folders='';
for(let folder in pages){
    let fileDom='';
    pages[folder].forEach((file)=>{
        let id=file+'_'+folder;
        let src=`./${file}.html`
        fileDom+=`<li id="${id}" class="file-tit" data-src="${src}">${file}</li>`;
    })
    folders+=`
        <div class="folder">
            <h3 class="folder-tit">${folder}</h3>
            <ul class="file-tits">${fileDom}</ul>
        </div>
    `;
}
listDom.innerHTML=folders;

let curFileDom=document.getElementsByClassName('file-tit')[0];
curFileDom.setAttribute('class','file-tit act');
ifm.setAttribute('src',curFileDom.getAttribute('data-src'));

listDom.addEventListener('click',function(event){
    const target=event.target;
    if(target.tagName==='LI'&&curFileDom.id!==target.id){
        curFileDom.className='file-tit';
        target.className='file-tit act';
        curFileDom=target;
        loading.style.display='block';
        ifm.setAttribute('src',curFileDom.getAttribute('data-src'));
    }
})

ifm.onload=function (event) {
    loading.style.display='none';
}
