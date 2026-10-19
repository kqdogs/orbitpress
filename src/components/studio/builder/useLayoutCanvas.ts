import { onBeforeUnmount, watch, type Ref } from 'vue';
import type { LayoutRegion, PageLayout } from '../../../lib/schema';
type Move=(id:string,region:LayoutRegion,target?:string,after?:boolean)=>void;
export function useLayoutCanvas(selected:Ref<string>,layout:Ref<PageLayout>,busy:Ref<boolean>,move:Move){
 let frame:HTMLIFrameElement|undefined,dispose=()=>{};
 function paint(){frame?.contentDocument?.querySelectorAll<HTMLElement>('[data-layout-block]').forEach(node=>node.toggleAttribute('data-selected',node.dataset.layoutBlock===selected.value));}
 watch(selected,paint);
 function bind(value:HTMLIFrameElement){
  dispose();frame=value;paint();
  const doc=value.contentDocument,win=value.contentWindow;if(!doc||!win)return;
  const removers:(()=>void)[]=[];
  const on=<K extends keyof DocumentEventMap>(type:K,handler:(event:DocumentEventMap[K])=>void)=>{doc.addEventListener(type,handler);removers.push(()=>doc.removeEventListener(type,handler));};
  const node=(target:EventTarget|null)=>(target as Element|null)?.nodeType===1?target as Element:null;
  const area=(target:Element|null)=>target?.closest<HTMLElement>('[data-layout-region]')?.dataset.layoutRegion as LayoutRegion|undefined;
  const block=(target:Element|null)=>target?.closest<HTMLElement>('[data-layout-block]');
  let start:{id:string;x:number;y:number;pointer:number;handle:HTMLElement}|null=null,moved=false;
  const clear=()=>doc.querySelectorAll('[data-drop]').forEach(e=>e.removeAttribute('data-drop'));
  on('click',event=>{event.preventDefault();const id=block(node(event.target))?.dataset.layoutBlock;if(id)selected.value=id;});
  on('pointerdown',event=>{
   if(busy.value||event.button!==0)return;
   const handle=node(event.target)?.closest<HTMLElement>('[data-layout-handle]');if(!handle)return;
   selected.value=handle.dataset.layoutHandle!;start={id:selected.value,x:event.clientX,y:event.clientY,pointer:event.pointerId,handle};moved=false;
   handle.setPointerCapture(event.pointerId);event.preventDefault();
  });
  on('pointermove',event=>{
   if(!start)return;moved ||=Math.hypot(event.clientX-start.x,event.clientY-start.y)>6;if(!moved)return;
   clear();const target=doc.elementFromPoint(event.clientX,event.clientY);(block(target)||target?.closest('[data-layout-region]'))?.setAttribute('data-drop','');
   if(event.clientY<70)win.scrollBy(0,-18);else if(event.clientY>win.innerHeight-70)win.scrollBy(0,18);
  });
  on('pointerup',event=>{
   if(!start)return;const source=start;start=null;
   if(source.handle.hasPointerCapture(source.pointer))source.handle.releasePointerCapture(source.pointer);
   const target=doc.elementFromPoint(event.clientX,event.clientY),region=area(target),to=block(target),rect=to?.getBoundingClientRect();
   if(moved&&region)move(source.id,region,to?.dataset.layoutBlock,!!rect&&event.clientY>rect.top+rect.height/2);clear();
  });
  on('pointercancel',()=>{start=null;clear();});
  on('keydown',event=>{
   const handle=node(event.target)?.closest<HTMLElement>('[data-layout-handle]');if(!handle)return;
   const id=handle.dataset.layoutHandle!;
   if(event.key==='Enter'||event.key===' '){event.preventDefault();selected.value=id;}
   if(event.altKey&&['ArrowUp','ArrowDown'].includes(event.key)){
    event.preventDefault();const region=area(handle);if(!region)return;
    const blocks=layout.value[region],index=blocks.findIndex(b=>b.id===id),offset=event.key==='ArrowUp'?-1:1;
    if(blocks[index+offset])move(id,region,blocks[index+offset].id,offset===1);
   }
  });
  dispose=()=>{removers.forEach(remove=>remove());start=null;clear();};
 }
 onBeforeUnmount(()=>{dispose();frame=undefined;});
 return bind;
}
