/** Keep site breakpoints independent of the space left by the admin panels. */
export function previewViewport(availableWidth:number,availableHeight:number,mobile=false){
 const width=mobile?390:1440;
 const scale=Math.min(1,Math.max(1,availableWidth)/width);
 return {width,height:Math.ceil(Math.max(1,availableHeight)/scale),scale,left:Math.max(0,(availableWidth-width*scale)/2)};
}
