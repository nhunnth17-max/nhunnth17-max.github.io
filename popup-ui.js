/* popup-ui.js - giao diện tối cho popup khách hàng (form#f). Không đụng logic Supabase. */
(()=>{
const CSS=`
dialog{width:min(560px,100vw);height:100dvh;max-height:100dvh;margin:0 auto;padding:0;border:0;background:#1a1442;color:#f1eefc;overflow-y:auto}
dialog::backdrop{background:rgba(0,0,0,.6)}
dialog form{display:grid;grid-template-columns:1fr 1fr;gap:14px 12px;padding:16px 20px}
dialog form#f{padding-top:0}
dialog input,dialog select,dialog textarea{width:100%;box-sizing:border-box;background:#2a2250;border:1px solid #3d3570;border-radius:12px;color:#f1eefc;font:inherit;font-size:17px;padding:13px 14px;outline:none}
dialog ::placeholder{color:#8f89bd}
dialog input:focus,dialog select:focus,dialog textarea:focus{border-color:#5b4fe6;box-shadow:0 0 0 3px rgba(91,79,230,.3)}
dialog textarea{min-height:100px}
dialog button{height:46px;padding:0 18px;border-radius:12px;border:1px solid #3d3570;background:#2a2250;color:#f1eefc;font:inherit;font-weight:600;cursor:pointer}
dialog button[type=submit]{background:#5b4fe6;border-color:#5b4fe6;color:#fff}
dialog label{display:flex;align-items:center;gap:10px;grid-column:1/-1}
dialog input[type=checkbox]{width:22px;height:22px;padding:0;accent-color:#5b4fe6}
.fld{display:flex;flex-direction:column;gap:7px;min-width:0}
.fl{font-size:12.5px;letter-spacing:.08em;text-transform:uppercase;color:#9a94c4}
.dhead{grid-column:1/-1;display:flex;align-items:center;gap:14px;padding:16px 0;border-bottom:1px solid #3d3570;position:sticky;top:0;background:#1a1442;z-index:2}
.dhead .av{width:52px;height:52px;border-radius:50%;background:linear-gradient(145deg,#f08a6a,#e0607a);display:grid;place-items:center;font-weight:700;font-size:19px;flex:none}
.dhead .ht{flex:1;min-width:0}
.dhead .hr{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.dhead .hn{font-size:20px}
.dhead .clk{border:1px solid #8a6d2c;background:#3a2f1c;color:#f5c451;border-radius:999px;padding:3px 12px;font-size:13px;font-family:ui-monospace,Menlo,monospace}
.dhead .hs{color:#9a94c4;font-size:14px;margin-top:2px}
.dhead .hx{width:44px;height:36px;padding:0}
.actions{grid-column:1/-1;display:flex;gap:10px;justify-content:flex-end;position:sticky;bottom:0;background:#1a1442;padding:12px 0;border-top:1px solid #3d3570}
@media(max-width:420px){dialog form{grid-template-columns:1fr}}`;
const st=document.createElement("style");st.textContent=CSS;document.head.append(st);

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
