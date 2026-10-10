/*
 * INVESTORS CONFIG (/investors/)
 * Only filled items render; a section with nothing filled is hidden (and left out of the side nav).
 * NEVER enter estimated, projected or unverified numbers. Every number needs a source, and numbers
 * without a source are not shown (market size/growth need market.source, margins need marginsSource,
 * each traction item needs its own source).
 *
 * STILL MISSING (everything below is currently empty):
 *  - investors.vision                          one sentence for the hero
 *  - investors.market                          size, growth, segments[], source
 *  - investors.businessModel                   channels[], pricingNote, margins + marginsSource
 *  - investors.traction                        {value:number, suffix, label, source}, real and verified only
 *  - investors.competition                     {name, difference}  (how NUWA differs)
 *  - investors.roadmap                         {period, milestone}
 *  - investors.team                            {name, role, bio, photo}  photo path relative to this page, e.g. '../assets/...'
 *  - investors.regulatory                      {market, status, plan}, be accurate
 *  - investors.deckUrl                         shows "Download overview" in the hero
 *  - investors.contactEmail / formEndpoint     the request form shows when either is set (see api/investors.js)
 *
 * @type {{vision:string, market:{size:string, growth:string, segments:string[], source:string},
 *   businessModel:{channels:string[], pricingNote:string, margins:string, marginsSource:string},
 *   traction:{value:number, suffix:string, label:string, source:string}[], competition:{name:string, difference:string}[],
 *   roadmap:{period:string, milestone:string}[], team:{name:string, role:string, bio:string, photo:string}[],
 *   regulatory:{market:string, status:string, plan:string}[], deckUrl:string, contactEmail:string, formEndpoint:string}}
 */
const investors={
  vision:'',
  market:{size:'',growth:'',segments:[],source:''},
  businessModel:{channels:[],pricingNote:'',margins:'',marginsSource:''},
  traction:[],
  competition:[],
  roadmap:[],
  team:[],
  regulatory:[],
  deckUrl:'',
  contactEmail:'',
  formEndpoint:''
};

(cfg=>{
const filled=v=>typeof v==='string'&&v.trim()!=='',web=v=>filled(v)&&/^(https?:\/\/|\/|\.\.?\/)/i.test(v.trim()),mailOk=v=>filled(v)&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(filled(text))e.textContent=text;return e};
const source=text=>el('small','inv-source',`Source: ${text.trim()}`);
const show=id=>{const s=document.getElementById(id);s.hidden=false;return s.querySelector('.inv-body')};
const list=(items,cls='inv-chips')=>{const ul=el('ul',cls);items.forEach(t=>ul.append(el('li','',t)));return ul};

// Hero
if(filled(cfg.vision)){const p=document.getElementById('inv-vision');p.textContent=cfg.vision.trim();p.hidden=false}
if(web(cfg.deckUrl)){const a=document.getElementById('inv-deck');a.href=cfg.deckUrl.trim();a.hidden=false}

// Market: numbers only with a source
const m=cfg.market||{},segments=(m.segments||[]).filter(filled),hasSource=filled(m.source);
const marketStats=[[m.size,'Market size'],[m.growth,'Growth']].filter(([v])=>hasSource&&filled(v));
if(marketStats.length||segments.length){const body=show('market');if(marketStats.length){const ul=el('ul','inv-stats');marketStats.forEach(([v,label])=>{const li=el('li');li.append(el('strong','',v.trim()),el('span','',label));ul.append(li)});body.append(ul,source(m.source))}
if(segments.length){body.append(el('p','inv-sub','Segments'),list(segments))}}

// Business model
const bm=cfg.businessModel||{},channels=(bm.channels||[]).filter(filled),margins=filled(bm.margins)&&filled(bm.marginsSource);
if(channels.length||filled(bm.pricingNote)||margins){const body=show('model');if(channels.length)body.append(el('p','inv-sub','Channels'),list(channels));if(filled(bm.pricingNote))body.append(el('p','inv-text',bm.pricingNote));
if(margins){const ul=el('ul','inv-stats'),li=el('li');li.append(el('strong','',bm.margins.trim()),el('span','','Margins'));ul.append(li);body.append(el('p','inv-sub','Margins'),ul,source(bm.marginsSource))}}

// Traction: verified numbers with sources, counted up on view
const traction=(cfg.traction||[]).filter(t=>t&&Number.isFinite(t.value)&&filled(t.label)&&filled(t.source));
if(traction.length){const body=show('traction'),ul=el('ul','inv-stats');traction.forEach(t=>{const li=el('li'),n=el('strong'),dec=(String(t.value).split('.')[1]||'').length;n.dataset.count=t.value;n.dataset.decimals=dec;n.dataset.suffix=filled(t.suffix)?t.suffix:'';
n.textContent=t.value.toLocaleString('en',{minimumFractionDigits:dec,maximumFractionDigits:dec})+n.dataset.suffix;li.append(n,el('span','',t.label),source(t.source));ul.append(li)});body.append(ul)}

// Competition
const competition=(cfg.competition||[]).filter(c=>c&&filled(c.name)&&filled(c.difference));
if(competition.length){const body=show('competition'),ul=el('ul','inv-cards');competition.forEach(c=>{const li=el('li'),card=el('article','inv-card');card.append(el('h3','',c.name),el('p','',c.difference));li.append(card);ul.append(li)});body.append(ul)}

// Regulatory
const regulatory=(cfg.regulatory||[]).filter(r=>r&&filled(r.market)&&(filled(r.status)||filled(r.plan)));
if(regulatory.length){const body=show('regulatory'),wrap=el('div','inv-table-wrap'),table=el('table','inv-table'),head=el('tr');['Market','Status','Plan'].forEach(t=>{const th=el('th','',t);th.scope='col';head.append(th)});const thead=el('thead');thead.append(head);const tbody=el('tbody');
regulatory.forEach(r=>{const tr=el('tr');[r.market,r.status,r.plan].forEach(v=>tr.append(el('td','',filled(v)?v.trim():'')));tbody.append(tr)});table.append(thead,tbody);wrap.append(table);body.append(wrap)}

// Roadmap
const roadmap=(cfg.roadmap||[]).filter(r=>r&&filled(r.milestone));
if(roadmap.length){const body=show('roadmap'),ol=el('ol','inv-steps');roadmap.forEach((r,i)=>{const li=el('li'),dot=el('span','inv-dot'),text=el('div');dot.setAttribute('aria-hidden','true');li.style.setProperty('--t',(.2+(roadmap.length>1?i/(roadmap.length-1)*1.2:0)).toFixed(2)+'s');if(filled(r.period))text.append(el('strong','',r.period));text.append(el('p','',r.milestone));li.append(dot,text);ol.append(li)});body.append(ol)}

// Team
const team=(cfg.team||[]).filter(t=>t&&filled(t.name));
if(team.length){const body=show('team'),ul=el('ul','inv-cards');team.forEach(t=>{const li=el('li'),card=el('article','inv-card');if(filled(t.photo)){const img=el('img','inv-photo');img.src=t.photo.trim();img.alt=t.name;img.width=72;img.height=72;img.loading='lazy';img.decoding='async';card.append(img)}
card.append(el('h3','',t.name));if(filled(t.role))card.append(el('p','inv-role',t.role));if(filled(t.bio))card.append(el('p','',t.bio));li.append(card);ul.append(li)});body.append(ul)}

// Contact form (same approach as the distributor form: POST to formEndpoint, or open the visitor's email app)
const endpoint=filled(cfg.formEndpoint)?cfg.formEndpoint.trim():'',to=mailOk(cfg.contactEmail)?cfg.contactEmail.trim():'';
const contact=document.getElementById('contact');
if(endpoint||to){contact.hidden=false;document.getElementById('inv-request').hidden=false;
const form=document.getElementById('inv-form'),status=document.getElementById('inv-status'),success=document.getElementById('inv-success');
const rules={name:v=>v.length>=2||'Please enter your name.',firm:v=>v.length>=2||'Please enter your firm.',email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)||'Please enter a valid email address.',interest:v=>!!v||'Please choose an option.',message:v=>v.length<=2000||'Please keep your message under 2000 characters.'};
let submitted=false;const check=f=>{const r=rules[f.name];if(!r)return true;const res=r(f.value.trim()),ok=res===true;f.setAttribute('aria-invalid',String(!ok));document.getElementById(`inv-${f.name}-err`).textContent=ok?'':res;return ok};
form.addEventListener('input',e=>{if(submitted&&e.target.name)check(e.target)});form.addEventListener('change',e=>{if(submitted&&e.target.name)check(e.target)});
const done=text=>{document.getElementById('inv-success-text').textContent=text;form.hidden=true;success.hidden=false;if(!reduceMotion)success.classList.add('is-drawing');success.focus()};
form.addEventListener('submit',async e=>{e.preventDefault();submitted=true;status.textContent='';const fields=[...form.querySelectorAll('.inv-field input,.inv-field select,.inv-field textarea')],bad=fields.filter(f=>!check(f));if(bad.length){bad[0].focus();return}
const data=Object.fromEntries(new FormData(form));if(data.website){done('Your request has been sent.');return}
if(!endpoint){const body=`Name: ${data.name}\nFirm: ${data.firm}\nEmail: ${data.email}\nInterest: ${data.interest}\n\n${data.message||''}`;location.href=`mailto:${to}?subject=${encodeURIComponent('Investor inquiry: '+data.firm)}&body=${encodeURIComponent(body)}`;done('Your email app should open with your request ready to send.');return}
form.classList.add('is-loading');form.setAttribute('aria-busy','true');
try{const res=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}),json=await res.json().catch(()=>({}));if(res.ok&&json.ok){done('Your request has been sent. We will be in touch.');return}
if(json.errors)Object.entries(json.errors).forEach(([name,msg])=>{const f=form.elements[name];if(f){f.setAttribute('aria-invalid','true');document.getElementById(`inv-${name}-err`).textContent=msg}});
status.textContent='Something went wrong sending your request. Please try again'+(to?` or email ${to}.`:'.')}catch{status.textContent='Could not send right now. Please check your connection and try again'+(to?` or email ${to}.`:'.')}
finally{form.classList.remove('is-loading');form.removeAttribute('aria-busy')}})}
// The navbar "Let's talk" button points here; fall back to the main page contact when this form is not available.
const talk=document.querySelector('header a[href="#contact"]');if(talk&&contact.hidden)talk.href='../index.html#contact';

// Side nav built from the visible sections, with active-section highlighting
const sections=[...document.querySelectorAll('.inv-sec:not([hidden])')],nav=document.getElementById('inv-nav-list');
sections.forEach(s=>{const li=el('li'),a=el('a','',s.querySelector('h2').textContent);a.href=`#${s.id}`;li.append(a);nav.append(li)});
if('IntersectionObserver' in window){const links=[...nav.querySelectorAll('a')];const spy=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;links.forEach(a=>a.setAttribute('aria-current',String(a.getAttribute('href')===`#${e.target.id}`)));
const active=nav.querySelector('[aria-current=true]');if(active&&nav.scrollWidth>nav.clientWidth)nav.scrollTo({left:active.offsetLeft-20,behavior:reduceMotion?'auto':'smooth'})}),{rootMargin:'-35% 0px -60% 0px'});sections.forEach(s=>spy.observe(s))}

// Mobile menu (same behaviour as the main page)
const menu=document.querySelector('.menu'),headerNav=document.querySelector('header nav');if(menu&&headerNav){menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));headerNav.classList.toggle('open',open)});headerNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');headerNav.classList.remove('open')}))}

if(reduceMotion)return;
// Reveals + traction count-up
const countUp=root=>root.querySelectorAll('[data-count]').forEach(n=>{const target=+n.dataset.count,dec=+n.dataset.decimals,suffix=n.dataset.suffix,start=performance.now(),fmt=v=>v.toLocaleString('en',{minimumFractionDigits:dec,maximumFractionDigits:dec})+suffix;const tick=now=>{const t=Math.min((now-start)/1500,1);n.textContent=fmt(target*(1-Math.pow(1-t,3)));if(t<1)requestAnimationFrame(tick)};n.textContent=fmt(0);requestAnimationFrame(tick)});
if('IntersectionObserver' in window){document.body.classList.add('inv-ready');const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('is-in');io.unobserve(e.target);if(e.target.id==='traction')countUp(e.target)}),{threshold:.15});[document.querySelector('.inv-hero'),...sections].forEach(s=>io.observe(s))}
// Gentle hero background parallax (transform only, capped)
const glow=document.querySelector('.inv-hero-glow');let queued=false;addEventListener('scroll',()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;glow.style.setProperty('--py',Math.min(scrollY*.15,120).toFixed(1)+'px')})},{passive:true});
})(investors);
