// One input path for mouse, pen and touch. A first tap works without a drag.
export function attachCanvasPointer(canvas:HTMLCanvasElement,onInput:(event:PointerEvent)=>void,options:{move?:boolean;onLeave?:()=>void}={}){
  const controller=new AbortController();
  const listenerOptions={signal:controller.signal};
  let lastPointerDown=-Infinity;
  const down=(event:PointerEvent)=>{
    if(event.pointerType==="mouse"&&event.button!==0)return;
    lastPointerDown=event.timeStamp;
    if(event.pointerType!=="mouse"){
      try{canvas.setPointerCapture(event.pointerId);}catch{/* A detached canvas cannot capture. */}
    }
    onInput(event);
  };
  const end=(event:PointerEvent)=>{
    try{if(canvas.hasPointerCapture(event.pointerId))canvas.releasePointerCapture(event.pointerId);}catch{/* The browser may already have released capture. */}
  };
  canvas.addEventListener("pointerdown",down,listenerOptions);
  // Assistive activation and some embedded browsers emit click without pointerdown.
  // Ignore the normal click following a pointerdown, so waves start only once.
  canvas.addEventListener("click",event=>{
    if(event.timeStamp-lastPointerDown>750)onInput(event as PointerEvent);
  },listenerOptions);
  if(options.move!==false)canvas.addEventListener("pointermove",onInput,listenerOptions);
  canvas.addEventListener("pointerup",end,listenerOptions);
  canvas.addEventListener("pointercancel",event=>{end(event);options.onLeave?.();},listenerOptions);
  canvas.addEventListener("pointerleave",()=>options.onLeave?.(),listenerOptions);
  return ()=>controller.abort();
}
