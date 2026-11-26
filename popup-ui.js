const NAMES={phone:"Business phone",state:"State",potential:"Potential",lead_source:"Lead (nguồn)",brand:"Brand / sản phẩm",campaign:"Campaign",reason:"Reason (lý do)",follow_up:"Gọi lại (giờ máy bạn)",stage:"Status",timezone:"Timezone",tz:"Timezone"};
const fmt=tz=>{try{return new Intl.DateTimeFormat("en-US",{timeZone:tz,hour:"2-digit",minute:"2-digit",hour12:true}).format(new Date())}catch{return "--:--"}};

function enhance(f){
  if(f.dataset.ui)return;f.dataset.ui="1";
  const btns=[...f.querySelectorAll("button")];
  const els=[...f.querySelectorAll("input:not([type=hidden]):not([type=checkbox]),select,textarea")];
  els.forEach((el,i)=>{
    const t=NAMES[el.name]||el.placeholder||(i==0?"Business name":i==1?"Customer name":el.name.replace(/_/g," "));
    const w=document.createElement("div");w.className="fld";
    const l=document.createElement("span");l.className="fl";l.textContent=t;
    el.before(w);w.append(l,el);
  });
  const bn=els[0],cn=els[1];
  const tzs=els.find(e=>e.tagName=="SELECT"&&[...e.options].some(o=>o.value.includes("/")));
  const h=document.createElement("div");h.className="dhead";
  h.innerHTML='<div class="av"></div><div class="ht"><div class="hr"><b class="hn"></b><span class="clk"></span></div><div class="hs"></div></div><button type="button" class="hx" aria-label="Đóng">✕</button>';
  f.prepend(h);
  h.querySelector(".hx").onclick=()=>f.closest("dialog").close();
  const upd=()=>{
    const b=bn?.value||"",c=cn?.value||"";
    h.querySelector(".av").textContent=(b||c||"?").split(/\s+/).map(w=>w[0]).join("").slice(0,2).toUpperCase();
    h.querySelector(".hn").textContent=c||"Khách mới";
    h.querySelector(".hs").textContent=b||"—";
    h.querySelector(".clk").textContent=tzs?fmt(tzs.value)+" ("+tzs.value.split("/").pop().replace(/_/g," ")+")":"";
  };
  f.addEventListener("input",upd);f.addEventListener("change",upd);upd();
  f._t=setInterval(()=>{f.isConnected?upd():clearInterval(f._t)},20000);
  const a=document.createElement("div");a.className="actions";f.append(a);a.append(...btns);
}
const scan=()=>document.querySelectorAll("dialog form#f").forEach(enhance);
new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});
scan();
})();
